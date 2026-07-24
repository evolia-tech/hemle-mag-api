import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderEntity } from '../entities/order.entity';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly logger;
    constructor(orderRepository: Repository<OrderEntity>);
    createOrder(dto: CreateOrderDto): Promise<OrderEntity>;
    findOne(id: string): Promise<OrderEntity>;
    findAll(): Promise<OrderEntity[]>;
}
