import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
  ) {}

  async updateStockQuantity(id: string, quantity: number): Promise<Stock> {
    const stock = await this.stockRepo.findOne({
      where: { id },
      relations: ['productItem']
    });

    if (!stock) {
      throw new NotFoundException(`Stock record #${id} not found`);
    }

    stock.quantity = quantity;
    return await this.stockRepo.save(stock);
  }

  create(createStockDto: any) {
    return 'This action adds a new stock';
  }

  findAll() {
    return this.stockRepo.find();
  }

  findOne(id: string) {
    return this.stockRepo.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.stockRepo.delete(id);
  }
}
