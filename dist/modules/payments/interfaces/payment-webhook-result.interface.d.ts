export interface PaymentWebhookResult {
    isSuccess: boolean;
    providerReference?: string;
    currency: string;
    amountTotal: number;
    customerDetails: {
        email: string;
        firstname: string;
        lastname: string;
        phone: string;
        country: string;
    };
    metadata: {
        magazineIds: string[];
    };
}
