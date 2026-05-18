import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CashboxService } from './cashbox.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CashboxMovementType } from './entities/cashbox-movement.entity';
import { MovementDirection } from '@/common/constants/movement-direction.enum';

@Controller('cashbox')
export class CashboxController {
  constructor(private readonly cashboxService: CashboxService) {}

  @Get()
  getCashboxStatus(
    @Query('nodeId') nodeId: string,
  ) {
    return this.cashboxService.getCashboxStatus(nodeId);
  }

  @Post('open')
  openCashbox(
    @Body('nodeId') nodeId: string,
    @Body('openingBalance') openingBalance: number,
    @CurrentUser() userId: string,
  ) {
    return this.cashboxService.openCashbox(nodeId, openingBalance, userId);
  }

  @Post('close')
  closeCashbox(
    @Body('nodeId') nodeId: string,
    @CurrentUser() userId: string,
  ) {
    return this.cashboxService.closeCashbox(nodeId, userId);
  }

  @Post('movements')
  addManualMovement(
    @Body('nodeId') nodeId: string,
    @Body('description') description: string,
    @Body('type') type: CashboxMovementType,
    @Body('direction') direction: MovementDirection,
    @Body('amount') amount: number,
    @CurrentUser() userId: string,
  ) {
    return this.cashboxService.addManualMovement(nodeId, description, type, direction, amount, userId);
  }
}
