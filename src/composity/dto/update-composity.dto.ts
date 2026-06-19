import { PartialType } from '@nestjs/swagger';
import { CreateComposityDto } from './create-composity.dto';

export class UpdateComposityDto extends PartialType(CreateComposityDto) {}