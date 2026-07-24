export interface PaymentSucceededPayload {
    orderId: string;
    customerEmail: string;
    firstName: string;
    lastName: string;
    phone?: string;
}
export declare class PaymentSucceededEvent {
    readonly payload: PaymentSucceededPayload;
    constructor(payload: PaymentSucceededPayload);
}
