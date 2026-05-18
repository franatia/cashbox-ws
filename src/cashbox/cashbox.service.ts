import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Cashbox } from './entities/cashbox.entity';
import { CashboxMovement, CashboxMovementType } from './entities/cashbox-movement.entity';
import { CashboxMovementDetail } from './entities/cashbox-movement-detail.entity';
import { MovementDirection } from '@/common/constants/movement-direction.enum';
import { Project } from '@/projects/entities/project.entity';
import { Node } from '@/projects/entities/node.entity';

export enum CashboxStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Injectable()
export class CashboxService {
  constructor(
    @InjectRepository(Cashbox)
    private readonly cashboxRepo: Repository<Cashbox>,
    @InjectRepository(CashboxMovement)
    private readonly movementRepo: Repository<CashboxMovement>,
    @InjectRepository(CashboxMovementDetail)
    private readonly detailRepo: Repository<CashboxMovementDetail>,
    private readonly dataSource: DataSource,
  ) {}

  async createCashbox(nodeId: string, projectId: string): Promise<{ id: string }> {
    const cashboxDraft = this.cashboxRepo.create({
      project: { id: projectId },
      node: { id: nodeId }
    });
    const { id } = await this.cashboxRepo.save(cashboxDraft);
    return { id };
  }

  async createSeveralCashboxes(nodeIds: string[], projectId: string): Promise<{ ids: string[] }> {
    const cashboxDrafts = this.cashboxRepo.create(
      nodeIds.map(nodeId => ({
        project: { id: projectId },
        node: { id: nodeId }
      }))
    );
    const ids = (await this.cashboxRepo.save(cashboxDrafts)).map(c => c.id);
    return { ids };
  }

  async getCashboxStatus(nodeId: string, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Cashbox) : this.cashboxRepo;
    const nodeRepo = manager ? manager.getRepository(Node) : this.dataSource.getRepository(Node);
    const movementRepo = manager ? manager.getRepository(CashboxMovement) : this.movementRepo;

    let cashbox = await repo.findOne({
      where: { node: { id: nodeId } },
      relations: ['node']
    });

    if (!cashbox) {
      // Heal: automatically create Cashbox if not found!
      const node = await nodeRepo.findOne({
        where: { id: nodeId },
        relations: ['project']
      });
      if (!node) {
        throw new NotFoundException(`Branch warehouse node #${nodeId} not found`);
      }
      const newCashbox = repo.create({
        node: { id: nodeId },
        project: { id: node.project.id }
      });
      cashbox = await repo.save(newCashbox);
    }

    // Load movements ordered by createAt ASC
    const movements = await movementRepo.find({
      where: { cashbox: { id: cashbox.id } },
      relations: ['details', 'user'],
      order: { createAt: 'ASC' }
    });

    // Find the latest opening and closing events
    let lastOpenMovement: CashboxMovement | null = null;
    let lastCloseMovement: CashboxMovement | null = null;

    for (const mov of movements) {
      if (mov.description === 'Apertura de caja') {
        lastOpenMovement = mov;
      } else if (mov.description === 'Cierre de caja') {
        lastCloseMovement = mov;
      }
    }

    const isOpen = lastOpenMovement !== null && 
      (lastCloseMovement === null || lastCloseMovement.createAt < lastOpenMovement.createAt);

    const openedAt = lastOpenMovement ? lastOpenMovement.createAt.toISOString() : null;
    const closedAt = lastCloseMovement ? lastCloseMovement.createAt.toISOString() : null;
    
    // Calculate opening balance
    const openingBalance = lastOpenMovement && lastOpenMovement.details && lastOpenMovement.details[0] 
      ? lastOpenMovement.details[0].total 
      : 0;

    // Calculate current balance
    let currentBalance = 0;
    if (isOpen && lastOpenMovement) {
      currentBalance = openingBalance;
      // Sum all movements after the opening movement
      const sessionMovements = movements.filter(m => m.createAt > lastOpenMovement!.createAt);
      for (const m of sessionMovements) {
        const total = m.details && m.details[0] ? m.details[0].total : 0;
        if (m.direction === MovementDirection.IN) {
          currentBalance += total;
        } else {
          currentBalance -= total;
        }
      }
    } else if (lastCloseMovement) {
      currentBalance = 0; // If closed, cash is balanced or archived
    }

    // Map movements to frontend expected DTO
    const mappedMovements = movements.map(m => ({
      id: m.id,
      description: m.description,
      type: m.type,
      direction: m.direction === MovementDirection.IN ? 'IN' : 'OUT',
      amount: m.details && m.details[0] ? m.details[0].total : 0,
      createdAt: m.createAt.toISOString(),
      userName: m.user ? m.user.username : 'Sistema'
    })).reverse(); // Newest first

    return {
      id: cashbox.id,
      nodeId: nodeId,
      status: isOpen ? CashboxStatus.OPEN : CashboxStatus.CLOSED,
      openedAt,
      closedAt,
      openingBalance,
      currentBalance,
      movements: mappedMovements
    };
  }

  async openCashbox(nodeId: string, openingBalance: number, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      let cashbox = await manager.findOne(Cashbox, { where: { node: { id: nodeId } } });
      if (!cashbox) {
        const node = await manager.findOne(Node, {
          where: { id: nodeId },
          relations: ['project']
        });
        if (!node) throw new NotFoundException('Branch warehouse node not found');
        const newCashbox = manager.create(Cashbox, {
          node: { id: nodeId },
          project: { id: node.project.id }
        });
        cashbox = await manager.save(Cashbox, newCashbox);
      }

      // Check if already open
      const status = await this.getCashboxStatus(nodeId, manager);
      if (status.status === CashboxStatus.OPEN) {
        throw new BadRequestException('Cashbox register is already open');
      }

      const user = await manager.findOne('User', { where: { id: userId } }) as any;

      // Create opening CashboxMovement
      const movement = new CashboxMovement();
      movement.cashbox = cashbox;
      movement.description = 'Apertura de caja';
      movement.type = CashboxMovementType.DEPOSIT;
      movement.direction = MovementDirection.IN;
      movement.user = user;

      const savedMovement = await manager.save(CashboxMovement, movement);

      // Create Movement Detail
      const detail = new CashboxMovementDetail();
      detail.movement = savedMovement;
      detail.total = openingBalance;

      await manager.save(CashboxMovementDetail, detail);

      return { success: true };
    });
  }

  async closeCashbox(nodeId: string, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      let cashbox = await manager.findOne(Cashbox, { where: { node: { id: nodeId } } });
      if (!cashbox) {
        const node = await manager.findOne(Node, {
          where: { id: nodeId },
          relations: ['project']
        });
        if (!node) throw new NotFoundException('Branch warehouse node not found');
        const newCashbox = manager.create(Cashbox, {
          node: { id: nodeId },
          project: { id: node.project.id }
        });
        cashbox = await manager.save(Cashbox, newCashbox);
      }

      // Check if already closed
      const status = await this.getCashboxStatus(nodeId, manager);
      if (status.status === CashboxStatus.CLOSED) {
        throw new BadRequestException('Cashbox register is already closed');
      }

      const user = await manager.findOne('User', { where: { id: userId } }) as any;

      // Create closing CashboxMovement (Withdrawal of active balance to vault/safe)
      const movement = new CashboxMovement();
      movement.cashbox = cashbox;
      movement.description = 'Cierre de caja';
      movement.type = CashboxMovementType.WITHDRAWAL;
      movement.direction = MovementDirection.OUT;
      movement.user = user;

      const savedMovement = await manager.save(CashboxMovement, movement);

      // Create Movement Detail
      const detail = new CashboxMovementDetail();
      detail.movement = savedMovement;
      detail.total = status.currentBalance;

      await manager.save(CashboxMovementDetail, detail);

      return { success: true };
    });
  }

  async addManualMovement(nodeId: string, description: string, type: CashboxMovementType, direction: MovementDirection, amount: number, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      let cashbox = await manager.findOne(Cashbox, { where: { node: { id: nodeId } } });
      if (!cashbox) {
        const node = await manager.findOne(Node, {
          where: { id: nodeId },
          relations: ['project']
        });
        if (!node) throw new NotFoundException('Branch warehouse node not found');
        const newCashbox = manager.create(Cashbox, {
          node: { id: nodeId },
          project: { id: node.project.id }
        });
        cashbox = await manager.save(Cashbox, newCashbox);
      }

      const status = await this.getCashboxStatus(nodeId, manager);
      if (status.status === CashboxStatus.CLOSED) {
        throw new BadRequestException('Cannot add movement to a closed register');
      }

      const user = await manager.findOne('User', { where: { id: userId } }) as any;

      const movement = new CashboxMovement();
      movement.cashbox = cashbox;
      movement.description = description;
      movement.type = type;
      movement.direction = direction;
      movement.user = user;

      const savedMovement = await manager.save(CashboxMovement, movement);

      const detail = new CashboxMovementDetail();
      detail.movement = savedMovement;
      detail.total = amount;

      await manager.save(CashboxMovementDetail, detail);

      return { success: true };
    });
  }
}
