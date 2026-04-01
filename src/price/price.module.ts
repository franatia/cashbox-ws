import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { PriceList } from './entities/price-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, PriceList])
  ],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule { }
