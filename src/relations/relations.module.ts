import { Module } from '@nestjs/common';
import { RelationsGuard } from './relations.guard';
import { APP_GUARD } from '@nestjs/core';
import { RelationsEngine } from './relations.engine';
import { ProjectModule } from '@/project/project.module';
import { ProductModule } from '@/product/product.module';
import { TaxModule } from '@/tax/tax.module';
import { CostsModule } from '@/costs/costs.module';
import { StockModule } from '@/stock/stock.module';

@Module({
  imports: [
    ProjectModule,
    ProductModule,
    TaxModule,
    CostsModule,
    StockModule
  ],
  providers: [
    RelationsGuard,
    {
      provide: APP_GUARD,
      useClass: RelationsGuard
    },
    RelationsEngine,
  ],
  exports: [
    RelationsEngine
  ]
})
export class RelationsModule { }
