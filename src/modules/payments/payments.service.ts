// src/modules/payments/payments.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { PAYMENTS_PROVIDER } from './constants/payments.tokens';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { PaymentStatus } from './enums/payment-status.enum';

import { MagazinesService } from '../magazines/magazines.service';
import { StripeProvider } from './providers/stripe.provider';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResult } from './interfaces/payment-result.interface';
import { PaymentProviderEnum } from './enums/payment-provider.enum';
import { CustomersService } from '../customers/customers.service';
import { OrdersService } from '../orders/services/orders.service';
import { OrderStatusEnum } from '../orders/enums/order-status.enum';
import { PaymentMethodEnum } from '../orders/enums/paymen-method.enum';
import { PaymentEntity } from './entities/payment.entity';
import { CustomerEntity } from '../customers/entities/customer.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

/**
 * PaymentsService
 *
 * Responsabilité :
 * 1. Créer les PaymentIntents
 * 2. Créer les Orders en base
 * 3. Gérer les webhooks
 * 4. Générer les downloadTokens
 *
 * Flux :
 * 1. createPayment() → récupère magazines, crée Order, crée PaymentIntent
 * 2. handleWebhook() → met à jour Order, émet event
 * 3. confirmPaymentIntent() → génère downloadToken
 */
@Injectable()
export class PaymentsService {

  private providersMap: Map<PaymentProviderEnum, PaymentProvider> = new Map();

  constructor(
    @Inject(PAYMENTS_PROVIDER)
    private readonly providers: PaymentProvider[],

    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    private readonly dataSource: DataSource,

    private readonly magazinesService: MagazinesService,

    private readonly customerService: CustomersService,
    private readonly orderService: OrdersService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.providers.forEach((p) => this.providersMap.set(p.name, p));
  }


  private getProvider(paymentProviderName: PaymentProviderEnum): PaymentProvider {
    const provider: PaymentProvider | undefined = this.providersMap.get(paymentProviderName);
    if (!provider) {
      throw new BadRequestException(`La passerelle [${paymentProviderName}] n'est pas supportée.`);
    }
    return provider;
  }
  /**
     * Initialiser le processus de paiement (Panier Invité)
     */
  async initiatePayment(dto: CreatePaymentDto): Promise<PaymentResult> {
    const provider = this.getProvider(dto.provider || PaymentProviderEnum.STRIPE);

    // B. Utilisation de TA fonction pour valider les prix et récupérer les images en BDD
    const lineItems = await Promise.all(
      dto.items.map(async (item) => {
        const magazineDetails = await this.magazinesService.findByIdForPayment(item.magazineId);

        return {
          title: magazineDetails.title,
          amount: magazineDetails.price,
          quantity: item.quantity,
          coverImage: magazineDetails.coverImage, // L'image de GCP arrive ici
        };
      }),
    );

    // C. Préparation des métadonnées (les IDs des magazines achetés)
    const magazineIds = dto.items.map((item) => item.magazineId);

    const providerInput = {
      currency: dto.currency.toLowerCase(),
      lineItems: lineItems,
      metadata: {
        magazineIds: JSON.stringify(magazineIds), // On fige le tableau d'IDs en JSON textuel
        userId: 'GUEST',
      }
    };

    // D. On demande la session Stripe (sans écriture SQL à ce stade !)
    return provider.createPayment(providerInput);
  }

  async processWebhook(payload: Buffer, signature: string) {
    const provider = this.getProvider(PaymentProviderEnum.STRIPE) as StripeProvider;

    // 1. Validation technique via le provider
    const result = await provider.verifyWebhook(payload, signature);

    if (result && result.isSuccess) {
      const { customerDetails, amountTotal, currency, providerReference, metadata } = result;

      // 2. 🛡️ ÉTAPE IDEMPOTENCE (Point 2) : Éviter les traitements en doublon
      const existingPayment = await this.paymentRepository.findOne({
        where: { providerReference: providerReference as string },
      });

      if (existingPayment) {
        console.log(`⚠️ Webhook Stripe déjà traité pour la référence : ${providerReference}. Traitement ignoré.`);
        return;
      }

      // 3. ⛓️ TRANSACTION SQL UNIQUE (Point 3) : Assurer la cohérence complète des écritures
      await this.dataSource.transaction(async (manager) => {
        const customerRepo = manager.getRepository(CustomerEntity);
        const orderRepo = manager.getRepository(OrderEntity);
        const paymentRepo = manager.getRepository(PaymentEntity);

        // A. Client (Find or Create)
        let customer = await customerRepo.findOne({ where: { email: customerDetails.email } });
        if (!customer) {
          customer = customerRepo.create({
            email: customerDetails.email,
            firstName: customerDetails.firstname,
            lastName: customerDetails.lastname,
            phone: customerDetails.phone,
            country: customerDetails.country,
          });
          customer = await customerRepo.save(customer);
          console.log(`🎉 Nouveau client enregistré via transaction : ${customer.email}`);
        } else {
          // Synchronisation facultative des informations
          customer.phone = customerDetails.phone || customer.phone;
          customer.country = customerDetails.country || customer.country;
          customer = await customerRepo.save(customer);
          console.log(`👤 Client existant reconnu et synchronisé via transaction : ${customer.email}`);
        }

        // B. Commande
        const order = orderRepo.create({
          totalAmount: amountTotal,
          currency: currency.toUpperCase(),
          paymentMethod: PaymentMethodEnum.CARD,
          magazineIds: metadata.magazineIds,
          status: OrderStatusEnum.PAID,
          customer: { id: customer.id } as any,
        });
        const savedOrder = await orderRepo.save(order);
        console.log(`📦 Commande ${savedOrder.id} créée sous transaction.`);

        // C. Reçu de paiement
        const record = paymentRepo.create({
          orderId: savedOrder.id,
          amount: amountTotal,
          currency: currency.toUpperCase(),
          provider: PaymentProviderEnum.STRIPE,
          providerReference: providerReference as string,
          status: PaymentStatus.PAID,
        });
        await paymentRepo.save(record);
        console.log(`💳 Reçu financier de paiement enregistré sous transaction.`);
      });

      // 6. ✉️ ÉTAPE LIVRAISON (Hors transaction) : Déclenchement de l'envoi de l'e-mail
      try {
        const magazines = await this.magazinesService.findByIds(metadata.magazineIds);
        const emailItems = magazines.map((mag) => {
          const downloadToken = this.magazinesService.generateDownloadToken(mag.id);
          const downloadUrl = `${this.configService.get<string>('frontend.url')}/magazines/download?token=${downloadToken}`;
          return {
            title: mag.title,
            downloadUrl,
          };
        });

        const customerName = `${customerDetails.firstname} ${customerDetails.lastname}`.trim() || 'Client';
        await this.mailService.sendMagazinesOrder(
          customerDetails.email,
          customerName,
          emailItems,
        );
        console.log(`✉️ Succès ! E-mail de livraison envoyé à : ${customerDetails.email}`);
      } catch (mailError) {
        console.error(`❌ Échec de l'envoi de l'e-mail de livraison : ${mailError.message}`);
      }
    }
  }

  /**
 * Enregistre le reçu financier en base de données
 */
  async savePaymentRecord(details: {
    orderId: string;
    amount: number;
    currency: string;
    provider: string;
    providerReference: string;
    status: string;
  }): Promise<PaymentEntity> {
    try {
      const record = this.paymentRepository.create({
        orderId: details.orderId,
        amount: details.amount,
        currency: details.currency.toUpperCase(),
        provider: details.provider as PaymentProviderEnum,
        providerReference: details.providerReference,
        status: details.status as PaymentStatus,
      });

      return await this.paymentRepository.save(record);
    } catch (error) {
      //this.logger.error(`Impossible de sauvegarder le reçu de paiement pour la commande ${details.orderId}: ${error.message}`);
      throw new InternalServerErrorException("Erreur lors de l'enregistrement financier du paiement.");
    }
  }
}