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
var CustomersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
let CustomersService = CustomersService_1 = class CustomersService {
    customerRepository;
    logger = new common_1.Logger(CustomersService_1.name);
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async create(dto) {
        try {
            const customer = this.customerRepository.create(dto);
            return await this.customerRepository.save(customer);
        }
        catch (error) {
            this.logger.error(`Échec de la création du client (${dto.email}) : ${error.message}`);
            throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la création du profil client.");
        }
    }
    async update(id, dto) {
        try {
            const updateResult = await this.customerRepository.update(id, dto);
            if (updateResult.affected === 0) {
                throw new common_1.NotFoundException(`Client avec l'ID ${id} introuvable pour la mise à jour.`);
            }
            const updatedCustomer = await this.customerRepository.findOne({ where: { id } });
            if (!updatedCustomer) {
                throw new common_1.NotFoundException(`Impossible de recharger le client après modification.`);
            }
            return updatedCustomer;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.logger.error(`Échec de la mise à jour du client (${id}) : ${error.message}`);
            throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la mise à jour du profil client.");
        }
    }
    async findByEmail(email) {
        try {
            return await this.customerRepository.findOne({ where: { email } });
        }
        catch (error) {
            this.logger.error(`Échec de la recherche du client (${email}) : ${error.message}`);
            throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la recherche du client.");
        }
    }
    async findOrCreateCustomer(details) {
        const customer = await this.findByEmail(details.email);
        if (!customer) {
            try {
                const newCustomer = await this.create({
                    email: details.email,
                    firstName: details.firstname,
                    lastName: details.lastname,
                    phone: details.phone,
                    country: details.country,
                });
                this.logger.log(`🎉 Nouveau client enregistré via achat : ${newCustomer.email}`);
                return newCustomer;
            }
            catch (error) {
                throw error;
            }
        }
        else {
            try {
                const updateDto = {
                    phone: details.phone || customer.phone,
                    country: details.country || customer.country,
                };
                const updatedCustomer = await this.update(customer.id, updateDto);
                this.logger.log(`👤 Client existant reconnu et synchronisé : ${updatedCustomer.email}`);
                return updatedCustomer;
            }
            catch (error) {
                throw error;
            }
        }
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = CustomersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.CustomerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map