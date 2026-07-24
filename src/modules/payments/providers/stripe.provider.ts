// src/modules/payments/providers/stripe.provider.ts


import { PaymentProvider } from '../interfaces/payment-provider.interface';
import { CreatePaymentInput } from '../interfaces/create-payment.input';
import { PaymentResult } from '../interfaces/payment-result.interface';
import { PaymentWebhookResult } from '../interfaces/payment-webhook-result.interface';
import { PaymentStatus } from '../enums/payment-status.enum';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

import Stripe from 'stripe';

import { PaymentProviderEnum } from '../enums/payment-provider.enum';

export class StripeProvider implements PaymentProvider {

  readonly name = PaymentProviderEnum.STRIPE;
  private stripe: Stripe.Stripe;
  private frontendUrl: string;
  private webhookSecret: string;

  constructor(apiKey: string, frontendUrl: string, webhookSecret: string) {
    // Créer l'instance Stripe avec la secret key
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2026-04-22.dahlia',
    });

    this.frontendUrl = frontendUrl;
    this.webhookSecret = webhookSecret;
  }

  /**
     * ÉTAPE A : Créer la page de paiement Stripe (Checkout Session)
     */
  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      // 🔐 Demander obligatoirement le numéro de téléphone sur l'interface Stripe
      phone_number_collection: {
        enabled: true,
      },

      // On map les données reçues de l'input vers le format strict de Stripe
      line_items: input.lineItems.map((item) => ({
        price_data: {
          currency: input.currency,
          product_data: {
            name: item.title,
            // Si l'image de couverture GCP existe, on la passe dans un tableau, sinon tableau vide
            images: item.coverImage ? [item.coverImage] : [],
          },
          // Stripe exige un montant entier en centimes (ex: 9.99€ -> 999)
          unit_amount: Math.round(item.amount * 100),
        },
        quantity: item.quantity,
      })),

      success_url: `${this.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/payments/cancel`,

      // On cache nos données de livraison dans les métadonnées de Stripe
      metadata: {
        userId: input.metadata.userId,          // Vaudra 'GUEST'
        magazineIds: input.metadata.magazineIds, // La chaîne JSON contenant les IDs des magazines
      },
    });

    // On renvoie les deux éléments requis par notre interface PaymentResult
    return {
      paymentUrl: session.url!,
      providerReference: session.id,
    };
  }

  /**
     * ÉTAPE B : Vérifier et décoder le Webhook envoyé par Stripe après le paiement
     */
  async verifyWebhook(payload: Buffer, signature?: string): Promise<PaymentWebhookResult | { isSuccess: false }> {

    console.log(payload);

    if (!signature) {
      throw new BadRequestException('Signature Stripe manquante');
    }

    let event: any;

    try {
      // Sécurité maximale : Stripe vérifie si le message n'a pas été modifié en route
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );

    } catch (err) {
      throw new BadRequestException(`Échec de la vérification du Webhook Stripe: ${err.message}`);
    }

    // Si le paiement est validé avec succès par la banque du client
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;      // On extrait et décodes les métadonnées qu'on avait cachées à l'étape A

      console.log(session);

      const [firstName, ...lastNameParts] = (session.customer_details?.name).split(' ');
      const lastName = lastNameParts.join(' ') || '';

      return {
        isSuccess: true,
        providerReference: session.id,
        currency: session.currency || 'eur',
        amountTotal: session.amount_total ? session.amount_total / 100 : 0, // Stripe en centimes -> conversion
        customerDetails: {
          email: session.customer_details?.email,
          firstname: firstName,
          lastname: lastName,
          phone: session.customer_details?.phone,
          country: session.customer_details?.address?.country,
        },
        metadata: {
          magazineIds: JSON.parse(session.metadata?.magazineIds || '[]'),
        },
      };
    }

    // Si c'est un autre événement Stripe (ex: paiement échoué), on signale l'échec
    return { isSuccess: false };
  }
}