import { Repository, DataSource } from 'typeorm';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { MagazinesService } from '../magazines/magazines.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResult } from './interfaces/payment-result.interface';
import { CustomersService } from '../customers/customers.service';
import { OrdersService } from '../orders/services/orders.service';
import { PaymentEntity } from './entities/payment.entity';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
export declare class PaymentsService {
    private readonly providers;
    private readonly paymentRepository;
    private readonly dataSource;
    private readonly magazinesService;
    private readonly customerService;
    private readonly orderService;
    private readonly configService;
    private readonly mailService;
    private providersMap;
    constructor(providers: PaymentProvider[], paymentRepository: Repository<PaymentEntity>, dataSource: DataSource, magazinesService: MagazinesService, customerService: CustomersService, orderService: OrdersService, configService: ConfigService, mailService: MailService);
    private getProvider;
    initiatePayment(dto: CreatePaymentDto): Promise<PaymentResult>;
    processWebhook(payload: Buffer, signature: string): Promise<void>;
    savePaymentRecord(details: {
        orderId: string;
        amount: number;
        currency: string;
        provider: string;
        providerReference: string;
        status: string;
    }): Promise<PaymentEntity>;
}
