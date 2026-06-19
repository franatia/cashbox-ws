import { Injectable } from '@nestjs/common';
import { CreateComposityDto } from './dto/create-composity.dto';
import { UpdateComposityDto } from './dto/update-composity.dto';

@Injectable()
export class ComposityService {
  create(createComposityDto: CreateComposityDto) {
    return 'This action adds a new composity';
  }

  findAll() {
    return `This action returns all composity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} composity`;
  }

  update(id: number, updateComposityDto: UpdateComposityDto) {
    return `This action updates a #${id} composity`;
  }

  remove(id: number) {
    return `This action removes a #${id} composity`;
  }
}
