// src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../modules/staffs/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Staff } from 'src/modules/staffs/entities/staff.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Pas de rôle requis → accès libre (route publique)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const staff: Staff = request.user;

    if (!staff || !staff.roles) {
      throw new ForbiddenException('Accès refusé : aucun rôle attribué.');
    }

    // Vérifie qu'au moins un des rôles requis est présent dans le tableau de rôles du staff
    const hasRole = requiredRoles.some((role) => staff.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Accès refusé : rôle requis parmi [${requiredRoles.join(', ')}].`,
      );
    }

    return true;
  }
}