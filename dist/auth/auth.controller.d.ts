import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Role } from "../modules/staffs/enums/role.enum";
import { CreateStaffDto } from "../modules/staffs/dto/create-staff.dto";
import { StaffsService } from "../modules/staffs/staffs.service";
export declare class AuthController {
    private readonly authService;
    private readonly staffsService;
    constructor(authService: AuthService, staffsService: StaffsService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        staff: {
            email: string;
            firstName: string;
            lastName: string;
            roles: Role[];
            isActive: boolean;
            slug: string | null;
            bio: string | null;
            avatarUrl: string | null;
            jobTitle: string | null;
            phoneNumber: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date | null;
            createdById?: string;
            updatedById?: string;
        };
    }>;
    me(staffId: string): Promise<import("../modules/staffs/entities/staff.entity").Staff>;
    createAccount(dto: CreateStaffDto, createdById: string): Promise<import("../modules/staffs/entities/staff.entity").Staff>;
}
