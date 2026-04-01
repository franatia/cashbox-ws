import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductItem } from './entities/product-item.entity';
import { ProductItemGroup } from './entities/product-item-group.entity';
import { ProductGroup } from './entities/product-group.entity';
import { ProductFeature } from './entities/product-feature.entity';
import { FeatureValue } from './entities/feature-value.entity';
import { FeatureSchema } from './entities/feature-schema.entity';
import { FeatureSchemaItem } from './entities/feature-schema-item.entity';
import { ComposityItem } from './entities/composity-item.entity';
import { Brand } from './entities/brand.entity';
import { ProjectModule } from '@/projects/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductItem,
      ProductItemGroup,
      ProductGroup,
      ProductFeature,
      FeatureValue,
      FeatureSchema,
      FeatureSchemaItem,
      ComposityItem,
      Brand
    ]),
    ProjectModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
