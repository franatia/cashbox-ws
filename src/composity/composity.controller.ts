import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComposityService } from './composity.service';
import { CreateComposityDto } from './dto/create-composity.dto';
import { UpdateComposityDto } from './dto/update-composity.dto';

@Controller('composity')
export class ComposityController {
  constructor(private readonly composityService: ComposityService) {}

  @Post()
  create(@Body() createComposityDto: CreateComposityDto) {
    return this.composityService.create(createComposityDto);
  }

  @Get()
  findAll() {
    return this.composityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.composityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComposityDto: UpdateComposityDto) {
    return this.composityService.update(+id, updateComposityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.composityService.remove(+id);
  }
}
