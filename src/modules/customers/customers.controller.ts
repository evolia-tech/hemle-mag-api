// src/modules/customers/customers.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  /**
   * ➕ Créer un client manuellement
   * POST /customers
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    return await this.customersService.create(createCustomerDto);
  }

  /**
   * 🔍 Rechercher un client par son adresse e-mail
   * GET /customers/search?email=exemple@domaine.com
   */
  @Get('search')
  async findByEmail(@Query('email') email: string): Promise<CustomerEntity | null> {
    return await this.customersService.findByEmail(email);
  }

  /**
   * 📝 Modifier les informations d'un client
   * PATCH /customers/:id
   * Utilise ParseUUIDPipe pour valider que l'ID transmis est bien un UUID conforme
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<CustomerEntity> {
    return await this.customersService.update(id, updateCustomerDto);
  }
}