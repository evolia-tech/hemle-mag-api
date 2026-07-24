// src/modules/orders/orders.service.ts

import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { PaymentMethodEnum } from '../enums/paymen-method.enum';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) { }

  /**
   * Crée et enregistre une commande en base de données
   */
  async createOrder(dto: CreateOrderDto): Promise<OrderEntity> {
    try {
      // Create instancie l'entité et mappe automatiquement le customerId grâce à TypeORM
      const order = this.orderRepository.create({
        totalAmount: dto.totalAmount,
        currency: dto.currency.toUpperCase(),
        paymentMethod: dto.paymentMethod.toUpperCase() as PaymentMethodEnum,
        magazineIds: dto.magazineIds,
        status: (dto.status as OrderStatusEnum) || OrderStatusEnum.PAID,
        customer: { id: dto.customerId } as any, // Liaison rapide par ID
      });

      const savedOrder = await this.orderRepository.save(order);
      this.logger.log(`📦 Commande ${savedOrder.id} créée avec succès pour le client ${dto.customerId}`);
      return savedOrder;
    } catch (error) {
      this.logger.error(`Échec de la création de la commande : ${error.message}`, error.stack);
      throw new InternalServerErrorException("Impossible d'enregistrer la commande en base de données.");
    }
  }

  /**
   * Récupère une commande par son ID (pour Mariette ou le Front)
   */
  async findOne(id: string): Promise<OrderEntity> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Commande avec l'ID ${id} introuvable.`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Erreur lors de la récupération de la commande.");
    }
  }

  /**
   * Liste toutes les commandes (Utile pour le dashboard d'administration)
   */
  async findAll(): Promise<OrderEntity[]> {
    try {
      return await this.orderRepository.find({ order: { createdAt: 'DESC' } });
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors du chargement des commandes.");
    }
  }
}