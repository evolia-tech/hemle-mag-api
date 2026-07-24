"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentStaff = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentStaff = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const staff = request.user;
    if (data) {
        return staff?.[data];
    }
    return staff;
});
//# sourceMappingURL=current-staff.decorator.js.map