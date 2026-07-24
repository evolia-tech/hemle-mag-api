import { OrderStatusEnum } from '../enums/order-status.enum';
import { CustomerEntity } from "../../customers/entities/customer.entity";
import { PaymentMethodEnum } from '../enums/paymen-method.enum';
export declare class OrderEntity {
    id: string;
    totalAmount: number;
    currency: string;
    status: OrderStatusEnum;
    paymentMethod: PaymentMethodEnum;
    magazineIds: string[];
    customer: CustomerEntity;
    createdAt: Date;
    updatedAt: Date;
}
