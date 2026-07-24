import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto, ChangePasswordDto } from './dto/update-staff.dto';
import { Role } from './enums/role.enum';
import { Staff } from './entities/staff.entity';
export declare class StaffsController {
    private readonly staffsService;
    constructor(staffsService: StaffsService);
    create(createStaffDto: CreateStaffDto, createdById: string, avatarFile?: Express.Multer.File): Promise<Staff>;
    findAll(): Promise<Staff[]>;
    getMe(staff: Staff): Staff;
    findOne(id: string): Promise<Staff>;
    update(id: string, updateStaffDto: UpdateStaffDto, updatedById: string, avatarFile?: Express.Multer.File): Promise<Staff>;
    changePassword(id: string, dto: ChangePasswordDto, requesterId: string, requesterRoles: Role[]): Promise<{
        message: string;
    }>;
    toggleActive(id: string, updatedById: string): Promise<Staff>;
    remove(id: string): Promise<void>;
}
