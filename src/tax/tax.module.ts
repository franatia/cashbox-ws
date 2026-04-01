import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tax } from './entities/tax.entity';
import { TaxSchema } from './entities/tax-schema.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tax,
      TaxSchema
    ])
  ],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule { }
