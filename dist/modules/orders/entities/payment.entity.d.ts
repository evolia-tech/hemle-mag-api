import { PaymentStatus } from '../../payments/enums/payment-status.enum';
export declare class Payment {
    id: string;
    provider: string;
    externalPaymentId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    metadata?: Record<string, any>;
    raw?: any;
    createdAt: Date;
    updatedAt: Date;
}
