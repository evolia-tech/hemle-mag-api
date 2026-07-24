import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
  BadRequestException,
  HttpStatus,
  Res,
  RawBody,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaymentsService } from '../payments.service';

@Controller('payments/webhook')
export class WebhookController {

  constructor(
    private readonly paymentsService: PaymentsService,
  ) { }

  @Post(':provider')
  @HttpCode(200)
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() rawBody: Buffer, // ✅ NestJS t'injecte directement le bon Buffer grâce au main.ts propre
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    if (!rawBody) {
      throw new BadRequestException('Le Raw Body original est introuvable');
    }

    await this.paymentsService.processWebhook(rawBody, signature);

    return { received: true };
  }
}