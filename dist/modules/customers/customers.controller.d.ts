import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity>;
    findByEmail(email: string): Promise<CustomerEntity | null>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerEntity>;
}
