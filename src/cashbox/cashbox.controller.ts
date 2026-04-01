import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CashboxService } from './cashbox.service';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';

@Controller('cashbox')
export class CashboxController {
  constructor(private readonly cashboxService: CashboxService) {}
}
