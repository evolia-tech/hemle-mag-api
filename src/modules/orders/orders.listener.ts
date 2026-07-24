// orders/orders.listener.ts

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentSucceededEvent } from '../payments/events/payment-succeeded.event';
import { OrdersService } from './services/orders.service';

@Injectable()
export class OrdersListener {

  constructor(private readonly ordersService: OrdersService) { }

  @OnEvent('payment.succeeded')
  async handlePaymentSucceeded(event: PaymentSucceededEvent) {
    //await this.ordersService.createOrderFromPayment(event.payload);
  }
}