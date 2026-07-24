import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { OrderItem } from './entities/order-item.entity';
import { Payment } from './entities/payment.entity';
import { OrdersListener } from './orders.listener';
import { OrderEntity } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      //OrderItem,
      Payment,
    ]),
  ],
  providers: [
    OrdersService,
    OrdersListener,
  ],
  exports: [
    TypeOrmModule, // ✅ important
    OrdersService
  ],
})
export class OrdersModule { }
