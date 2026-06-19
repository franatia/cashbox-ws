import { Module } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserve } from './entities/reserve.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Reserve
    ])
  ],
  controllers: [ReserveController],
  providers: [ReserveService],
})
export class ReserveModule {}
