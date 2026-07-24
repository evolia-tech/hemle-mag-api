import { PaymentsService } from '../payments.service';
import { PaymentResult } from '../interfaces/payment-result.interface';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(dto: any): Promise<PaymentResult>;
}
