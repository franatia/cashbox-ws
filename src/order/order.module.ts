import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { ProductItem } from '@/product/entities/product-item.entity';
import { Stock } from '@/stock/entities/stock.entity';
import { StockMovement } from '@/stock/entities/stock-movement.entity';
import { Price } from '@/price/entities/price.entity';
import { Project } from '@/projects/entities/project.entity';
import { Node } from '@/projects/entities/node.entity';
import { Customer } from '@/customer/entities/customer.entity';
import { Payment } from '@/payment/entities/payment.entity';
import { Cashbox } from '@/cashbox/entities/cashbox.entity';
import { CashboxMovement } from '@/cashbox/entities/cashbox-movement.entity';
import { CashboxMovementDetail } from '@/cashbox/entities/cashbox-movement-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      ProductItem,
      Stock,
      StockMovement,
      Price,
      Project,
      Node,
      Customer,
      Payment,
      Cashbox,
      CashboxMovement,
      CashboxMovementDetail,
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }

