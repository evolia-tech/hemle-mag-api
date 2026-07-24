// src/modules/customers/customers.service.ts

import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) { }

  /**
   * Crée un nouveau client en base de données
   */
  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      const customer = this.customerRepository.create(dto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      this.logger.error(`Échec de la création du client (${dto.email}) : ${error.message}`);
      throw new InternalServerErrorException("Une erreur est survenue lors de la création du profil client.");
    }
  }

  /**
   * Met à jour les informations d'un client existant via son ID
   */
  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    try {
      const updateResult = await this.customerRepository.update(id, dto);

      if (updateResult.affected === 0) {
        throw new NotFoundException(`Client avec l'ID ${id} introuvable pour la mise à jour.`);
      }

      // On récupère et retourne le client mis à jour
      const updatedCustomer = await this.customerRepository.findOne({ where: { id } });
      if (!updatedCustomer) {
        throw new NotFoundException(`Impossible de recharger le client après modification.`);
      }

      return updatedCustomer;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Échec de la mise à jour du client (${id}) : ${error.message}`);
      throw new InternalServerErrorException("Une erreur est survenue lors de la mise à jour du profil client.");
    }
  }

  /**
   * Recherche un client par son adresse e-mail
   */
  async findByEmail(email: string): Promise<CustomerEntity | null> {
    try {
      return await this.customerRepository.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(`Échec de la recherche du client (${email}) : ${error.message}`);
      throw new InternalServerErrorException("Une erreur est survenue lors de la recherche du client.");
    }
  }

  /**
   * Fonction combinée pour le Webhook Stripe :
   * Cherche le client, le crée s'il n'existe pas, ou le met à jour s'il existe déjà.
   */
  async findOrCreateCustomer(details: {
    email: string;
    firstname: string;
    lastname: string;
    phone?: string;
    country?: string;
  }): Promise<CustomerEntity> {

    // 🔍 1. Recherche du client
    const customer = await this.findByEmail(details.email);

    // 🆕 2. Cas : Le client n'existe pas -> Création
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
      } catch (error) {
        throw error; // Propagera l'InternalServerErrorException du create()
      }
    }

    // 🔄 3. Cas : Le client existe déjà -> Mise à jour et synchronisation
    else {
      try {
        // On prépare les données de mise à jour (on garde les anciennes valeurs si Stripe renvoie du vide)
        const updateDto: UpdateCustomerDto = {
          phone: details.phone || customer.phone,
          country: details.country || customer.country,
        };

        const updatedCustomer = await this.update(customer.id, updateDto);
        this.logger.log(`👤 Client existant reconnu et synchronisé : ${updatedCustomer.email}`);
        return updatedCustomer;
      } catch (error) {
        throw error; // Propagera l'erreur du update()
      }
    }
  }
}