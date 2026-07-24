import { PaymentProvider } from '../interfaces/payment-provider.interface';
import { CreatePaymentInput } from '../interfaces/create-payment.input';
import { PaymentResult } from '../interfaces/payment-result.interface';
import { PaymentWebhookResult } from '../interfaces/payment-webhook-result.interface';
import { PaymentProviderEnum } from '../enums/payment-provider.enum';
export declare class StripeProvider implements PaymentProvider {
    readonly name = PaymentProviderEnum.STRIPE;
    private stripe;
    private frontendUrl;
    private webhookSecret;
    constructor(apiKey: string, frontendUrl: string, webhookSecret: string);
    createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
    verifyWebhook(payload: Buffer, signature?: string): Promise<PaymentWebhookResult | {
        isSuccess: false;
    }>;
}
