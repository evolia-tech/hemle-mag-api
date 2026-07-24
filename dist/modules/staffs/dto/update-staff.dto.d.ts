import { CreateStaffDto } from './create-staff.dto';
declare const UpdateStaffDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateStaffDto, "password">>>;
export declare class UpdateStaffDto extends UpdateStaffDto_base {
}
export declare class ChangePasswordDto {
    currentPassword?: string;
    newPassword: string;
}
export {};
