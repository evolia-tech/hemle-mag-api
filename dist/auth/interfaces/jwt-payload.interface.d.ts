import { Role } from '../../modules/staffs/enums/role.enum';
export interface JwtPayload {
    sub: string;
    email: string;
    roles: Role[];
    firstName: string;
    lastName: string;
}
