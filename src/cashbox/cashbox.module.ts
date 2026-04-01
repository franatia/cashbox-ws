import { Module } from '@nestjs/common';
import { CashboxService } from './cashbox.service';
import { CashboxController } from './cashbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cashbox } from './entities/cashbox.entity';
import { CashboxMovement } from './entities/cashbox-movement.entity';
import { CashboxMovementDetail } from './entities/cashbox-movement-detail.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Cashbox, CashboxMovement, CashboxMovementDetail])
    ],
  controllers: [CashboxController],
  providers: [CashboxService],
  exports: [
    CashboxService
  ]
})
export class CashboxModule {}
