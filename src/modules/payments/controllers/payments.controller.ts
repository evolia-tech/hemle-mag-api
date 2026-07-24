import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from '../payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentResult } from '../interfaces/payment-result.interface';

@Controller('payments')
export class PaymentsController {

  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createPayment(@Body() dto: any): Promise<PaymentResult> {
    return this.paymentsService.initiatePayment(dto);
  }
}