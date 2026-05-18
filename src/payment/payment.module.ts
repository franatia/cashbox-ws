import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Order } from '@/order/entities/order.entity';
import { Cashbox } from '@/cashbox/entities/cashbox.entity';
import { CashboxMovement } from '@/cashbox/entities/cashbox-movement.entity';
import { CashboxMovementDetail } from '@/cashbox/entities/cashbox-movement-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Order,
      Cashbox,
      CashboxMovement,
      CashboxMovementDetail,
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }

