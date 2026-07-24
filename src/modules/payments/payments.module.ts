// payments.module.ts

import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PAYMENTS_PROVIDER } from './constants/payments.tokens';
import { StripeProvider } from './providers/stripe.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagazinesModule } from '../magazines/magazines.module';
import { JwtModule } from '@nestjs/jwt';
import { WebhookController } from './controllers/webhook.controller';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentEntity } from './entities/payment.entity';
import { CustomersModule } from '../customers/customers.module';
import { OrdersModule } from '../orders/orders.module';
// import { PaypalProvider } from './providers/paypal.provider';

@Module({})
export class PaymentsModule {

  static registerPayments(): DynamicModule {
    return {
      module: PaymentsModule,
      controllers: [
        PaymentsController,
        WebhookController
      ],
      providers: [
        {
          provide: PAYMENTS_PROVIDER,
          inject: [ConfigService],
          useFactory: (configService: ConfigService<any>) => {

            const providers = [
              new StripeProvider(
                configService.get<string>('STRIPE_SECRET_KEY')!,
                configService.get<string>('FRONTEND_URL')!,
                configService.get<string>('STRIPE_WEBHOOK_SECRET')!,
              )
            ];

            return providers;
          },
        },

        PaymentsService,
      ],
      imports: [
        TypeOrmModule.forFeature([PaymentEntity]), // 👈 AJOUT ICI : Donne accès au PaymentRepository requis par ton service
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get('jwt.secret'),
            signOptions: {
              expiresIn: config.get('jwt.expiresIn'),
            },
          }),
        }),
        MagazinesModule,
        CustomersModule,
        OrdersModule
      ],
      exports: [PaymentsService],
    };
  }
}