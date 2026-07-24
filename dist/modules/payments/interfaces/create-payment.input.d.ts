export interface CreatePaymentInput {
    currency: string;
    lineItems: Array<{
        title: string;
        amount: number;
        quantity: number;
        coverImage: string | null;
    }>;
    metadata: {
        magazineIds: string;
        userId: string;
    };
}
