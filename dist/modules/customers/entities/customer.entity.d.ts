import { OrderEntity } from "../../orders/entities/order.entity";
export declare class CustomerEntity {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    orders: OrderEntity[];
    createdAt: Date;
}
