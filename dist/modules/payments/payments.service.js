"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payments_tokens_1 = require("./constants/payments.tokens");
const payment_status_enum_1 = require("./enums/payment-status.enum");
const magazines_service_1 = require("../magazines/magazines.service");
const payment_provider_enum_1 = require("./enums/payment-provider.enum");
const customers_service_1 = require("../customers/customers.service");
const orders_service_1 = require("../orders/services/orders.service");
const order_status_enum_1 = require("../orders/enums/order-status.enum");
const paymen_method_enum_1 = require("../orders/enums/paymen-method.enum");
const payment_entity_1 = require("./entities/payment.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../mail/mail.service");
let PaymentsService = class PaymentsService {
    providers;
    paymentRepository;
    dataSource;
    magazinesService;
    customerService;
    orderService;
    configService;
    mailService;
    providersMap = new Map();
    constructor(providers, paymentRepository, dataSource, magazinesService, customerService, orderService, configService, mailService) {
        this.providers = providers;
        this.paymentRepository = paymentRepository;
        this.dataSource = dataSource;
        this.magazinesService = magazinesService;
        this.customerService = customerService;
        this.orderService = orderService;
        this.configService = configService;
        this.mailService = mailService;
        this.providers.forEach((p) => this.providersMap.set(p.name, p));
    }
    getProvider(paymentProviderName) {
        const provider = this.providersMap.get(paymentProviderName);
        if (!provider) {
            throw new common_1.BadRequestException(`La passerelle [${paymentProviderName}] n'est pas supportée.`);
        }
        return provider;
    }
    async initiatePayment(dto) {
        const provider = this.getProvider(dto.provider || payment_provider_enum_1.PaymentProviderEnum.STRIPE);
        const lineItems = await Promise.all(dto.items.map(async (item) => {
            const magazineDetails = await this.magazinesService.findByIdForPayment(item.magazineId);
            return {
                title: magazineDetails.title,
                amount: magazineDetails.price,
                quantity: item.quantity,
                coverImage: magazineDetails.coverImage,
            };
        }));
        const magazineIds = dto.items.map((item) => item.magazineId);
        const providerInput = {
            currency: dto.currency.toLowerCase(),
            lineItems: lineItems,
            metadata: {
                magazineIds: JSON.stringify(magazineIds),
                userId: 'GUEST',
            }
        };
        return provider.createPayment(providerInput);
    }
    async processWebhook(payload, signature) {
        const provider = this.getProvider(payment_provider_enum_1.PaymentProviderEnum.STRIPE);
        const result = await provider.verifyWebhook(payload, signature);
        if (result && result.isSuccess) {
            const { customerDetails, amountTotal, currency, providerReference, metadata } = result;
            const existingPayment = await this.paymentRepository.findOne({
                where: { providerReference: providerReference },
            });
            if (existingPayment) {
                console.log(`⚠️ Webhook Stripe déjà traité pour la référence : ${providerReference}. Traitement ignoré.`);
                return;
            }
            await this.dataSource.transaction(async (manager) => {
                const customerRepo = manager.getRepository(customer_entity_1.CustomerEntity);
                const orderRepo = manager.getRepository(order_entity_1.OrderEntity);
                const paymentRepo = manager.getRepository(payment_entity_1.PaymentEntity);
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
                }
                else {
                    customer.phone = customerDetails.phone || customer.phone;
                    customer.country = customerDetails.country || customer.country;
                    customer = await customerRepo.save(customer);
                    console.log(`👤 Client existant reconnu et synchronisé via transaction : ${customer.email}`);
                }
                const order = orderRepo.create({
                    totalAmount: amountTotal,
                    currency: currency.toUpperCase(),
                    paymentMethod: paymen_method_enum_1.PaymentMethodEnum.CARD,
                    magazineIds: metadata.magazineIds,
                    status: order_status_enum_1.OrderStatusEnum.PAID,
                    customer: { id: customer.id },
                });
                const savedOrder = await orderRepo.save(order);
                console.log(`📦 Commande ${savedOrder.id} créée sous transaction.`);
                const record = paymentRepo.create({
                    orderId: savedOrder.id,
                    amount: amountTotal,
                    currency: currency.toUpperCase(),
                    provider: payment_provider_enum_1.PaymentProviderEnum.STRIPE,
                    providerReference: providerReference,
                    status: payment_status_enum_1.PaymentStatus.PAID,
                });
                await paymentRepo.save(record);
                console.log(`💳 Reçu financier de paiement enregistré sous transaction.`);
            });
            try {
                const magazines = await this.magazinesService.findByIds(metadata.magazineIds);
                const emailItems = magazines.map((mag) => {
                    const downloadToken = this.magazinesService.generateDownloadToken(mag.id);
                    const downloadUrl = `${this.configService.get('frontend.url')}/magazines/download?token=${downloadToken}`;
                    return {
                        title: mag.title,
                        downloadUrl,
                    };
                });
                const customerName = `${customerDetails.firstname} ${customerDetails.lastname}`.trim() || 'Client';
                await this.mailService.sendMagazinesOrder(customerDetails.email, customerName, emailItems);
                console.log(`✉️ Succès ! E-mail de livraison envoyé à : ${customerDetails.email}`);
            }
            catch (mailError) {
                console.error(`❌ Échec de l'envoi de l'e-mail de livraison : ${mailError.message}`);
            }
        }
    }
    async savePaymentRecord(details) {
        try {
            const record = this.paymentRepository.create({
                orderId: details.orderId,
                amount: details.amount,
                currency: details.currency.toUpperCase(),
                provider: details.provider,
                providerReference: details.providerReference,
                status: details.status,
            });
            return await this.paymentRepository.save(record);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Erreur lors de l'enregistrement financier du paiement.");
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(payments_tokens_1.PAYMENTS_PROVIDER)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentEntity)),
    __metadata("design:paramtypes", [Array, typeorm_2.Repository,
        typeorm_2.DataSource,
        magazines_service_1.MagazinesService,
        customers_service_1.CustomersService,
        orders_service_1.OrdersService,
        config_1.ConfigService,
        mail_service_1.MailService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map