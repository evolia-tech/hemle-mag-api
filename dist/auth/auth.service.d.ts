import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { StaffsService } from "../modules/staffs/staffs.service";
export declare class AuthService {
    private readonly staffsService;
    private readonly jwtService;
    constructor(staffsService: StaffsService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        staff: {
            email: string;
            firstName: string;
            lastName: string;
            roles: import("../modules/staffs/enums/role.enum").Role[];
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
}
