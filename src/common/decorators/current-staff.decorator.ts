import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Staff } from 'src/modules/staffs/entities/staff.entity';

/**
 * Décorateur pour accéder au staff connecté depuis les controllers.
 * Passport injecte l'utilisateur validé dans request.user.
 *
 * Usage :
 *   @CurrentStaff() staff: Staff          → objet complet
 *   @CurrentStaff('id') id: string        → une propriété spécifique
 *   @CurrentStaff('roles') roles: Role[]  → les rôles
 */
export const CurrentStaff = createParamDecorator(
  (data: keyof Staff | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const staff: Staff = request.user; // Passport stocke dans request.user

    if (data) {
      return staff?.[data];
    }

    return staff;
  },
);