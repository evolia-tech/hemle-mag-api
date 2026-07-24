import { PaymentSucceededEvent } from '../payments/events/payment-succeeded.event';
import { OrdersService } from './services/orders.service';
export declare class OrdersListener {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void>;
}
