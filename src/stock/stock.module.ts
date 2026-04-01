import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Stock } from './entities/stock.entity';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferItem } from './entities/stock-transfer-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Lot } from './entities/lot.entity';
import { InsertProductSchema } from './entities/insert-product-schema.entity';
import { InsertProductSchemaItem } from './entities/insert-product-schema-item.entity';
import { ConceptualStockMovement } from './entities/conceptual-stock-movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock,
      StockTransfer,
      StockTransferItem,
      StockMovement,
      Lot,
      InsertProductSchema,
      InsertProductSchemaItem,
      ConceptualStockMovement
    ])
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule { }
