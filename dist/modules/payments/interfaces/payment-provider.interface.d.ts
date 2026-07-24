import { PaymentProviderEnum } from '../enums/payment-provider.enum';
import { CreatePaymentInput } from './create-payment.input';
import { PaymentResult } from './payment-result.interface';
import { PaymentWebhookResult } from './payment-webhook-result.interface';
export interface PaymentProvider {
    readonly name: PaymentProviderEnum;
    createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
    verifyWebhook(payload: Buffer, signature?: string): Promise<PaymentWebhookResult | {
        isSuccess: false;
    }>;
}
