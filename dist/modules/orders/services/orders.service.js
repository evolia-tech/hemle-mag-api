"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_status_enum_1 = require("../enums/order-status.enum");
let OrdersService = OrdersService_1 = class OrdersService {
    orderRepository;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async createOrder(dto) {
        try {
            const order = this.orderRepository.create({
                totalAmount: dto.totalAmount,
                currency: dto.currency.toUpperCase(),
                paymentMethod: dto.paymentMethod.toUpperCase(),
                magazineIds: dto.magazineIds,
                status: dto.status || order_status_enum_1.OrderStatusEnum.PAID,
                customer: { id: dto.customerId },
            });
            const savedOrder = await this.orderRepository.save(order);
            this.logger.log(`📦 Commande ${savedOrder.id} créée avec succès pour le client ${dto.customerId}`);
            return savedOrder;
        }
        catch (error) {
            this.logger.error(`Échec de la création de la commande : ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException("Impossible d'enregistrer la commande en base de données.");
        }
    }
    async findOne(id) {
        try {
            const order = await this.orderRepository.findOne({ where: { id } });
            if (!order) {
                throw new common_1.NotFoundException(`Commande avec l'ID ${id} introuvable.`);
            }
            return order;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException("Erreur lors de la récupération de la commande.");
        }
    }
    async findAll() {
        try {
            return await this.orderRepository.find({ order: { createdAt: 'DESC' } });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Erreur lors du chargement des commandes.");
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map