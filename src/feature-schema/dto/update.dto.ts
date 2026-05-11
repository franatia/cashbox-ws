import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureSchemaDto } from './create.dto';

export class UpdateFeatureSchemaDto extends PartialType(CreateFeatureSchemaDto) {}
