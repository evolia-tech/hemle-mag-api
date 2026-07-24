import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto, ChangePasswordDto } from './dto/update-staff.dto';
import { Role } from './enums/role.enum';
import { MediaService } from '../media/media.service';
export declare class StaffsService {
    private readonly staffRepo;
    private readonly mediaService;
    constructor(staffRepo: Repository<Staff>, mediaService: MediaService);
    private readonly safeSelect;
    private resolveAvatarUrl;
    create(dto: CreateStaffDto, createdById?: string, avatarFile?: Express.Multer.File): Promise<Staff>;
    findAll(): Promise<Staff[]>;
    findById(id: string): Promise<Staff>;
    findEntityByIdWithPassword(id: string): Promise<Staff>;
    findByEmail(email: string): Promise<Staff | null>;
    update(id: string, dto: UpdateStaffDto, updatedById?: string, avatarFile?: Express.Multer.File): Promise<Staff>;
    changePassword(id: string, dto: ChangePasswordDto, requesterId: string, requesterRoles: Role[]): Promise<{
        message: string;
    }>;
    toggleActive(id: string, updatedById?: string): Promise<Staff>;
    remove(id: string): Promise<void>;
    private generateUniqueSlug;
}
