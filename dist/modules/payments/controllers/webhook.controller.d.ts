import { PaymentsService } from '../payments.service';
export declare class WebhookController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    handleStripeWebhook(signature: string, rawBody: Buffer): Promise<{
        received: boolean;
    }>;
}
