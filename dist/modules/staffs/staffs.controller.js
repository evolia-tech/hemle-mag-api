"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const staffs_service_1 = require("./staffs.service");
const create_staff_dto_1 = require("./dto/create-staff.dto");
const update_staff_dto_1 = require("./dto/update-staff.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("./enums/role.enum");
const current_staff_decorator_1 = require("../../common/decorators/current-staff.decorator");
const staff_entity_1 = require("./entities/staff.entity");
let StaffsController = class StaffsController {
    staffsService;
    constructor(staffsService) {
        this.staffsService = staffsService;
    }
    create(createStaffDto, createdById, avatarFile) {
        return this.staffsService.create(createStaffDto, createdById, avatarFile);
    }
    findAll() {
        return this.staffsService.findAll();
    }
    getMe(staff) {
        return staff;
    }
    findOne(id) {
        return this.staffsService.findById(id);
    }
    update(id, updateStaffDto, updatedById, avatarFile) {
        return this.staffsService.update(id, updateStaffDto, updatedById, avatarFile);
    }
    changePassword(id, dto, requesterId, requesterRoles) {
        return this.staffsService.changePassword(id, dto, requesterId, requesterRoles);
    }
    toggleActive(id, updatedById) {
        return this.staffsService.toggleActive(id, updatedById);
    }
    remove(id) {
        return this.staffsService.remove(id);
    }
};
exports.StaffsController = StaffsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPER_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_staff_decorator_1.CurrentStaff)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto, String, Object]),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_staff_decorator_1.CurrentStaff)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_entity_1.Staff]),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.EDITOR),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_staff_decorator_1.CurrentStaff)('id')),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.UpdateStaffDto, String, Object]),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/change-password'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.EDITOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_staff_decorator_1.CurrentStaff)('id')),
    __param(3, (0, current_staff_decorator_1.CurrentStaff)('roles')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.ChangePasswordDto, String, Array]),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_staff_decorator_1.CurrentStaff)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffsController.prototype, "remove", null);
exports.StaffsController = StaffsController = __decorate([
    (0, common_1.Controller)('staffs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    })),
    __metadata("design:paramtypes", [staffs_service_1.StaffsService])
], StaffsController);
//# sourceMappingURL=staffs.controller.js.map