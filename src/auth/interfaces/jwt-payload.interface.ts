import { Role } from '../../modules/staffs/enums/role.enum';

/**
 * Payload encodé dans le JWT.
 * Contient les informations minimales nécessaires pour l'autorisation.
 */
export interface JwtPayload {
  /** UUID du membre staff */
  sub: string;
  email: string;
  /** Tableau des rôles RBAC du membre */
  roles: Role[];
  firstName: string;
  lastName: string;
}