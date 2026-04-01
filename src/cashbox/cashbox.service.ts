import { Injectable } from '@nestjs/common';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { Cashbox } from './entities/cashbox.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CashboxService {

  constructor(
    @InjectRepository(Cashbox)
    private readonly cashboxRepo: Repository<Cashbox>
  ) { }

  async createCashbox(nodeId: string, projectId: string): Promise<{
    id: string,
  }> {

    const cashboxDraft = this.cashboxRepo.create({
      project: {
        id: projectId
      },
      node: {
        id: nodeId
      }
    })

    const { id } = await this.cashboxRepo.save(cashboxDraft);

    return { id };

  }

  async createSeveralCashboxes(nodeIds: string[], projectId: string): Promise<{
    ids: string[]
  }> {

    const cashboxDrafts = this.cashboxRepo.create(
      nodeIds.map(nodeId => ({
        project: {
          id: projectId
        },
        node: {
          id: nodeId
        }
      }))
    )

    const ids = (await this.cashboxRepo.save(cashboxDrafts)).map(c => c.id);

    return {
      ids
    }

  }
}
