import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentProviderEnum } from '../enums/payment-provider.enum';
export declare class PaymentEntity {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    provider: PaymentProviderEnum;
    providerReference: string;
    status: PaymentStatus;
    createdAt: Date;
    updated_at: Date;
}
