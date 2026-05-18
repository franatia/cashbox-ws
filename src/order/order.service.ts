import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Project } from '@/projects/entities/project.entity';
import { Node } from '@/projects/entities/node.entity';
import { Customer } from '@/customer/entities/customer.entity';
import { ProductItem } from '@/product/entities/product-item.entity';
import { Stock } from '@/stock/entities/stock.entity';
import { StockMovement } from '@/stock/entities/stock-movement.entity';
import { Price } from '@/price/entities/price.entity';
import { PriceList } from '@/price/entities/price-list.entity';
import { MovementDirection } from '@/common/constants/movement-direction.enum';
import { ProductSubtractType } from '@/product/entities/product.entity';
import { PaymentListStatus } from '@/payment/entities/payment.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { projectId, sourceNodeId, targetNodeId, customerId, channel, details } = createOrderDto;

    return await this.dataSource.transaction(async (manager) => {
      // 1. Fetch relations
      const project = await manager.findOne(Project, { where: { id: projectId } });
      if (!project) throw new NotFoundException('Project not found');

      let sourceNode: Node | null = null;
      if (sourceNodeId) {
        sourceNode = await manager.findOne(Node, { where: { id: sourceNodeId } });
        if (!sourceNode) throw new NotFoundException('Source node not found');
      }

      let targetNode: Node | null = null;
      if (targetNodeId) {
        targetNode = await manager.findOne(Node, { where: { id: targetNodeId } });
        if (!targetNode) throw new NotFoundException('Target node not found');
      }

      let customer: Customer | null = null;
      if (customerId) {
        customer = await manager.findOne(Customer, { where: { id: customerId } });
        if (!customer) throw new NotFoundException('Customer not found');
      }

      const user = await manager.findOne('User', { where: { id: userId } }) as any;

      // 2. Create the Order shell
      const order = new Order();
      order.project = project;
      order.sourceTarget = sourceNode;
      order.targetNode = targetNode;
      order.customer = customer!;
      order.channel = channel;
      order.status = OrderStatus.CONFIRMED;
      order.paymentStatus = PaymentListStatus.PENDING;

      const savedOrder = await manager.save(Order, order);

      let subtotal = 0;
      let totalDiscount = 0;
      let total = 0;
      let profit = 0;

      const orderDetails: OrderDetail[] = [];

      // 3. Process order items
      for (const itemDto of details) {
        const productItem = await manager.findOne(ProductItem, {
          where: { id: itemDto.productItemId },
          relations: ['product']
        });
        if (!productItem) throw new NotFoundException(`ProductItem not found: ${itemDto.productItemId}`);

        const quantity = itemDto.quantity;
        if (quantity <= 0) throw new BadRequestException('Quantity must be greater than 0');

        // Stock subtraction validation
        if (sourceNode && productItem.product.subtractType === ProductSubtractType.IMMEDIATE) {
          const stock = await manager.findOne(Stock, {
            where: { node: { id: sourceNode.id }, productItem: { id: productItem.id } }
          });

          if (!stock || stock.quantity < quantity) {
            throw new BadRequestException(`Insufficient stock for product item: ${productItem.sku}`);
          }

          // Decrement stock
          stock.quantity -= quantity;
          await manager.save(Stock, stock);

          // Record stock movement
          const movement = new StockMovement();
          movement.stock = stock;
          movement.quantity = quantity;
          movement.unitCost = 0;
          movement.direction = MovementDirection.OUT;
          movement.createdBy = user;
          await manager.save(StockMovement, movement);
        }

        // Determine price
        let itemPrice = itemDto.price;
        if (itemPrice === undefined) {
          if (itemDto.priceListId) {
            const customPrice = await manager.findOne(Price, {
              where: {
                productItem: { id: productItem.id },
                priceList: { id: itemDto.priceListId }
              }
            });
            itemPrice = customPrice ? customPrice.price : productItem.product.basePrice;
          } else {
            itemPrice = productItem.product.basePrice;
          }
        }

        const discount = itemDto.discount ?? 0;
        const itemSubtotal = itemPrice * quantity;
        const itemTotal = itemSubtotal - discount;

        subtotal += itemSubtotal;
        totalDiscount += discount;
        total += itemTotal;
        profit += itemTotal;

        // Create OrderDetail
        const detail = new OrderDetail();
        detail.order = savedOrder;
        detail.productItem = productItem;
        detail.price = itemPrice;
        detail.quantity = quantity;
        detail.discount = discount;
        detail.profit = itemTotal;
        detail.totalTaxes = 0;
        
        if (itemDto.priceListId) {
          const priceList = await manager.findOne(PriceList, { where: { id: itemDto.priceListId } });
          if (priceList) detail.priceList = priceList;
        }

        orderDetails.push(await manager.save(OrderDetail, detail));
      }

      // 4. Update order financial totals
      savedOrder.subtotal = subtotal;
      savedOrder.discount = totalDiscount;
      savedOrder.total = total;
      savedOrder.profit = profit;
      savedOrder.details = orderDetails;

      const finalOrder = await manager.save(Order, savedOrder);

      if (finalOrder.details) {
        finalOrder.details = finalOrder.details.map(detail => {
          delete (detail as any).order;
          return detail;
        });
      }

      return finalOrder;
    });
  }

  async findAll(projectId?: string) {
    return this.orderRepo.find({
      where: projectId ? { project: { id: projectId } } : {},
      relations: ['project', 'sourceTarget', 'targetNode', 'customer', 'details', 'details.productItem', 'details.productItem.product', 'payments'],
      order: { createAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['project', 'sourceTarget', 'targetNode', 'customer', 'details', 'details.productItem', 'details.productItem.product', 'payments']
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepo.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
  }
}

