"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeProvider = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const payment_provider_enum_1 = require("../enums/payment-provider.enum");
class StripeProvider {
    name = payment_provider_enum_1.PaymentProviderEnum.STRIPE;
    stripe;
    frontendUrl;
    webhookSecret;
    constructor(apiKey, frontendUrl, webhookSecret) {
        this.stripe = new stripe_1.default(apiKey, {
            apiVersion: '2026-04-22.dahlia',
        });
        this.frontendUrl = frontendUrl;
        this.webhookSecret = webhookSecret;
    }
    async createPayment(input) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            phone_number_collection: {
                enabled: true,
            },
            line_items: input.lineItems.map((item) => ({
                price_data: {
                    currency: input.currency,
                    product_data: {
                        name: item.title,
                        images: item.coverImage ? [item.coverImage] : [],
                    },
                    unit_amount: Math.round(item.amount * 100),
                },
                quantity: item.quantity,
            })),
            success_url: `${this.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.frontendUrl}/payments/cancel`,
            metadata: {
                userId: input.metadata.userId,
                magazineIds: input.metadata.magazineIds,
            },
        });
        return {
            paymentUrl: session.url,
            providerReference: session.id,
        };
    }
    async verifyWebhook(payload, signature) {
        console.log(payload);
        if (!signature) {
            throw new common_1.BadRequestException('Signature Stripe manquante');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Échec de la vérification du Webhook Stripe: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log(session);
            const [firstName, ...lastNameParts] = (session.customer_details?.name).split(' ');
            const lastName = lastNameParts.join(' ') || '';
            return {
                isSuccess: true,
                providerReference: session.id,
                currency: session.currency || 'eur',
                amountTotal: session.amount_total ? session.amount_total / 100 : 0,
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
        return { isSuccess: false };
    }
}
exports.StripeProvider = StripeProvider;
//# sourceMappingURL=stripe.provider.js.map