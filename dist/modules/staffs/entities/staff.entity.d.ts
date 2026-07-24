import { BaseEntity } from '../../../database/base.entity';
import { Role } from '../enums/role.enum';
export declare class Staff extends BaseEntity {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    isActive: boolean;
    slug: string | null;
    bio: string | null;
    avatarUrl: string | null;
    jobTitle: string | null;
    phoneNumber: string | null;
    hashPassword(): Promise<void>;
    comparePassword(attempt: string): Promise<boolean>;
    get fullName(): string;
    hasRole(role: Role): boolean;
    hasAnyRole(...roles: Role[]): boolean;
}
