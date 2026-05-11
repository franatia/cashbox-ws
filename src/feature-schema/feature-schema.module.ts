import { Module } from '@nestjs/common';
import { FeatureSchemaController } from './feature-schema.controller';
import { FeatureSchemaService } from './feature-schema.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureSchema } from './entities/feature-schema.entity';
import { FeatureSchemaItem } from './entities/feature-schema-item.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      FeatureSchema,
      FeatureSchemaItem
    ]),
  ],
  controllers: [
    FeatureSchemaController
  ],
  providers: [FeatureSchemaService],
})
export class FeatureSchemaModule {}
