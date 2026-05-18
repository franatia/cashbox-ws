import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order, OrderStatus } from '@/order/entities/order.entity';
import { Project } from '@/projects/entities/project.entity';
import { Customer } from '@/customer/entities/customer.entity';
import { Cashbox } from '@/cashbox/entities/cashbox.entity';
import { CashboxMovement, CashboxMovementType } from '@/cashbox/entities/cashbox-movement.entity';
import { CashboxMovementDetail } from '@/cashbox/entities/cashbox-movement-detail.entity';
import { MovementDirection } from '@/common/constants/movement-direction.enum';
import { PaymentStatus, PaymentListStatus } from './entities/payment.enum';
import { DomainLogger } from '@/common/logging/domain-logger';

@Injectable()
export class PaymentService {
  private readonly logger = new DomainLogger('PAYMENT');

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, userId: string) {
    const { projectId, total, orderId, customerId, method, status } = createPaymentDto;

    this.logger.log(`Iniciando procesamiento de cobro por $${total} mediante método ${method}...`);

    return await this.dataSource.transaction(async (manager) => {
      // 1. Fetch relations
      const project = await manager.findOne(Project, { where: { id: projectId } });
      if (!project) {
        this.logger.warn(`Proyecto con ID ${projectId} no encontrado`);
        throw new NotFoundException('Project not found');
      }

      let order: Order | null = null;
      if (orderId) {
        order = await manager.findOne(Order, {
          where: { id: orderId },
          relations: ['sourceTarget', 'payments']
        });
        if (!order) throw new NotFoundException('Order not found');
      }

      let customer: Customer | null = null;
      if (customerId) {
        customer = await manager.findOne(Customer, { where: { id: customerId } });
        if (!customer) throw new NotFoundException('Customer not found');
      }

      const user = await manager.findOne('User', { where: { id: userId } }) as any;

      // 2. Create the payment
      const payment = new Payment();
      payment.project = { id: project.id } as any;
      payment.total = total;
      if (order) payment.order = { id: order.id } as any;
      if (customer) payment.customer = { id: customer.id } as any;
      payment.method = method;
      payment.status = status ?? PaymentStatus.CONFIRMED;

      this.logger.log(`[TypeORM Lifecycle] Guardando entidad 'Payment' | Payload: ${JSON.stringify({
        projectId: project.id,
        total,
        orderId: order?.id,
        customerId: customer?.id,
        method,
        status: status ?? PaymentStatus.CONFIRMED
      })}`);
      const savedPayment = await manager.save(Payment, payment);

      // 3. Update order payment status
      if (order) {
        const previousPaidTotal = order.payments ? order.payments.reduce((acc, pay) => acc + pay.total, 0) : 0;
        const totalPaid = previousPaidTotal + total;

        let newPaymentStatus = order.paymentStatus;
        let newStatus = order.status;

        if (totalPaid >= order.total) {
          newPaymentStatus = PaymentListStatus.CONFIRMED;
          newStatus = OrderStatus.CONFIRMED;
        } else if (totalPaid > 0) {
          newPaymentStatus = PaymentListStatus.PARTIALLY_PAID;
        } else {
          newPaymentStatus = PaymentListStatus.PENDING;
        }

        if (order.paymentStatus !== newPaymentStatus || order.status !== newStatus) {
          const updatePayload = {
            paymentStatus: newPaymentStatus,
            status: newStatus
          };
          this.logger.log(`[TypeORM Lifecycle] Actualizando entidad 'Order' ID: ${order.id} | Payload: ${JSON.stringify(updatePayload)} | Campos modificados: ${Object.keys(updatePayload).join(', ')}`);
          await manager.update(Order, order.id, updatePayload);
        }

        // 4. Record Cashbox impact if order has a source node (the store/cash register location)
        if (order.sourceTarget) {
          const cashbox = await manager.findOne(Cashbox, {
            where: { node: { id: order.sourceTarget.id } }
          });

          if (cashbox) {
            // Create CashboxMovement
            const movement = new CashboxMovement();
            movement.cashbox = { id: cashbox.id } as any;
            movement.description = `Cobro de Orden #${order.id.slice(0, 8)}`;
            movement.type = CashboxMovementType.PAYMENT;
            movement.direction = MovementDirection.IN;
            if (user) movement.user = { id: user.id } as any;

            const movementPayload = {
              cashboxId: cashbox.id,
              description: `Cobro de Orden #${order.id.slice(0, 8)}`,
              type: CashboxMovementType.PAYMENT,
              direction: MovementDirection.IN,
              userId: user?.id
            };
            this.logger.log(`[TypeORM Lifecycle] Guardando entidad 'CashboxMovement' | Payload: ${JSON.stringify(movementPayload)}`);
            const savedMovement = await manager.save(CashboxMovement, movement);

            // Create CashboxMovementDetail linking the payment
            const movementDetail = new CashboxMovementDetail();
            movementDetail.movement = { id: savedMovement.id } as any;
            movementDetail.payment = { id: savedPayment.id } as any;
            movementDetail.total = total;

            const detailPayload = {
              movementId: savedMovement.id,
              paymentId: savedPayment.id,
              total
            };
            this.logger.log(`[TypeORM Lifecycle] Guardando entidad 'CashboxMovementDetail' | Payload: ${JSON.stringify(detailPayload)}`);
            await manager.save(CashboxMovementDetail, movementDetail);
            this.logger.log(`Impacto contable de caja registrado de forma exitosa.`);
          }
        }
      }

      this.logger.log(`¡Cobro de $${total} procesado con éxito! ID de Pago: ${savedPayment.id}`);
      return savedPayment;
    });
  }

  async findAll(projectId?: string) {
    return this.paymentRepo.find({
      where: projectId ? { project: { id: projectId } } : {},
      relations: ['project', 'order', 'customer'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['project', 'order', 'customer']
    });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepo.save(payment);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    await this.paymentRepo.remove(payment);
  }
}

