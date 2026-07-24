import { PaymentProviderEnum } from '../enums/payment-provider.enum';
declare class PaymentItemDto {
    magazineId: string;
    quantity: number;
}
export declare class CreatePaymentDto {
    provider: PaymentProviderEnum;
    customerEmail: string;
    firstName: string;
    lastName: string;
    phone: string;
    currency: string;
    items: PaymentItemDto[];
}
export declare class CreateCheckoutPageDto {
    provider?: PaymentProviderEnum;
    currency?: string;
    items: PaymentItemDto[];
}
export {};
