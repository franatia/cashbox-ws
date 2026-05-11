import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from './entities/catalog.entity';
import { LinkingCatalog } from './entities/linking-catalog.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Catalog,
      LinkingCatalog
    ])
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
