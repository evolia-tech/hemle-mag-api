import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { CustomerEntity } from 'src/modules/customers/entities/customer.entity';
import { PaymentMethodEnum } from '../enums/paymen-method.enum';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PAID
  })
  status: OrderStatusEnum;

  // 🔄 Modification ici : type défini sur 'enum'
  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    name: 'payment_method',
  })
  paymentMethod: PaymentMethodEnum;

  @Column({ type: 'jsonb', name: 'magazine_ids' })
  magazineIds: string[]; // Stocke le tableau des magazines achetés

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, { cascade: true })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}