import { Role } from '../enums/role.enum';
export declare class CreateStaffDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    isActive?: boolean;
    phoneNumber?: string;
    bio?: string;
    avatarUrl?: string;
    jobTitle?: string;
}
