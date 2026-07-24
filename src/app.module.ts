import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { appConfig } from './config/app.config';
import { MagazinesModule } from './modules/magazines/magazines.module';
import { AuthModule } from './auth/auth.module';
import { StaffsModule } from './modules/staffs/staffs.module';
import { MediaModule } from './modules/media/media.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { MailModule } from './modules/mail/mail.module';
import { ArticlesModule } from './modules/articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    StaffsModule,
    AuthModule,
    MediaModule.registerMedia(),
    PaymentsModule.registerPayments(),
    MagazinesModule,
    NewsletterModule,
    MailModule,
    ArticlesModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
