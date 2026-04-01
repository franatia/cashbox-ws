import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerSegment } from './entities/customer-segment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerSegment])
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule { }
