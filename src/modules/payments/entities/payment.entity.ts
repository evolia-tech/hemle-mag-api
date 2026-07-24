import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentProviderEnum } from '../enums/payment-provider.enum';

@Entity('payments')
export class PaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 👈 LE CHAMP MANQUANT EST ICI
    @Column({ name: 'order_id', type: 'varchar' })
    orderId: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'varchar', default: 'EUR' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PaymentProviderEnum,
    })
    provider: PaymentProviderEnum;

    @Column({ name: 'provider_reference', type: 'varchar', unique: true })
    providerReference: string; // Stocke le cs_test_... de Stripe

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}