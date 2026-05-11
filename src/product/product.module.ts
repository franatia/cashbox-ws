import { Module } from '@nestjs/common';
import { ProductController } from './core/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Item } from './entities/item.entity';
import { ItemGroup } from './entities/item-group.entity';
import { Group } from './entities/group.entity';
import { Feature } from './entities/feature.entity';
import { FeatureValue } from './entities/feature-value.entity';
import { Brand } from './entities/brand.entity';
import { ProjectModule } from '@/projects/project.module';
import { Complement } from './entities/complement.entity';
import { ProductService } from './core/product.service';
import { FeaturesService } from './features/features.service';
import { FeatureValuesService } from './feature-values/feature-values.service';
import { FeatureGroupService } from './feature-group/feature-group.service';
import { ComplementService } from './complement/complement.service';
import { BrandService } from './brand/brand.service';
import { ItemService } from './item/item.service';
import ItemSearch from './item/item.search';
import ItemGroupSearch from './item-group/item-group.search';
import { ItemGroupService } from './item-group/item-group.service';
import { GroupService } from './group/group.service';
import { FeatureGroup } from './entities/feature-group.entity';
import FeatureGroupItem from './entities/feature-group-item.entity';
import ItemGroupController from './item-group/item-group.controller';
import ItemController from './item/item.controller';
import { FeaturesController } from './features/features.controller';
import FeatureValuesController from './feature-values/feature-values.controller';
import { FeatureGroupController } from './feature-group/feature-group.controller';
import { FeatureGroupSearch } from './feature-group/feature-group.search';
import ItemQuery from './item/item.query';
import FeatureGroupQuery from './feature-group/feature-group.query';
import FeatureValuesQuery from './feature-values/feature-values.query';
import FeaturesQuery from './features/features.query';
import ItemGroupQuery from './item-group/item-group.query';
import ProductQuery from './core/product.query';
import { ComplementItem } from './entities/complement-item.entity';
import Composity from './entities/composity.entity';
import ComplementQuery from './complement/complement.query';
import ComplementController from './complement/complement.controller';
import { ComplementSearch } from './complement/complement.search';
import { ComplementItemSearch } from './complement/complement-item.search';
import ComposityService from './composity/composity.service';
import CompositySearch from './composity/composity.search';
import ComposityQuery from './composity/composity.query';
import ComposityController from './composity/composity.controller';
import ProductSearch from './core/product.search';
import GroupSearch from './group/group.search';
import GroupQuery from './group/group.query';
import FeatureSearch from './features/features.search';
import FeatureValuesSearch from './feature-values/feature-values.search';
import GroupController from './group/group.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Item,
      ItemGroup,
      Group,
      Feature,
      FeatureValue,
      Complement,
      ComplementItem,
      Composity,
      Brand,
      FeatureGroup,
      FeatureGroupItem
    ]),
    ProjectModule
  ],
  controllers: [
    ItemGroupController,
    ItemController,
    FeaturesController,
    FeatureValuesController,
    FeatureGroupController,
    ComplementController,
    ComposityController,
    GroupController,
    ProductController,
  ],
  providers: [
    ProductService,
    ProductQuery,
    ProductSearch,

    ItemService,
    ItemSearch,
    ItemQuery,

    ItemGroupService,
    ItemGroupSearch,
    ItemGroupQuery,
    
    GroupService,
    GroupSearch,
    GroupQuery,

    FeaturesService,
    FeaturesQuery,
    FeatureSearch,

    FeatureValuesService,
    FeatureValuesQuery,
    FeatureValuesSearch,

    FeatureGroupService,
    FeatureGroupSearch,
    FeatureGroupQuery,

    ComplementService,
    ComplementQuery,
    ComplementSearch,
    ComplementItemSearch,

    ComposityService,
    CompositySearch,
    ComposityQuery,

    BrandService,
  ],

  exports : [
    ProductService,
    ProductQuery,
    ProductSearch,

    ItemService,
    ItemSearch,
    ItemQuery,

    ItemGroupService,
    ItemGroupSearch,
    ItemGroupQuery,
    
    GroupService,
    GroupSearch,
    GroupQuery,

    FeaturesService,
    FeaturesQuery,
    FeatureSearch,

    FeatureValuesService,
    FeatureValuesQuery,
    FeatureValuesSearch,

    FeatureGroupService,
    FeatureGroupSearch,
    FeatureGroupQuery,

    ComplementService,
    ComplementQuery,
    ComplementSearch,
    ComplementItemSearch,

    ComposityService,
    CompositySearch,
    ComposityQuery,

    BrandService,
  ]
})
export class ProductModule { }
