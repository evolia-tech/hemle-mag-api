import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): void;
    findAll(): void;
    findOne(id: string): void;
    update(id: string, updateOrderDto: UpdateOrderDto): void;
    remove(id: string): void;
}
