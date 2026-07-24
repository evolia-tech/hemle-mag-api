import { OrderEntity } from 'src/modules/orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    country: string;

    @OneToMany(() => OrderEntity, (order) => order.customer)
    orders: OrderEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}