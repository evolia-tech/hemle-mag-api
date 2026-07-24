import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private readonly customerRepository;
    private readonly logger;
    constructor(customerRepository: Repository<CustomerEntity>);
    create(dto: CreateCustomerDto): Promise<CustomerEntity>;
    update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity>;
    findByEmail(email: string): Promise<CustomerEntity | null>;
    findOrCreateCustomer(details: {
        email: string;
        firstname: string;
        lastname: string;
        phone?: string;
        country?: string;
    }): Promise<CustomerEntity>;
}
