import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}
}
