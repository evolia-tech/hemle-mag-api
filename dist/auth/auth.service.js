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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const staffs_service_1 = require("../modules/staffs/staffs.service");
let AuthService = class AuthService {
    staffsService;
    jwtService;
    constructor(staffsService, jwtService) {
        this.staffsService = staffsService;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const staff = await this.staffsService.findByEmail(dto.email);
        if (!staff) {
            throw new common_1.UnauthorizedException('Email ou mot de passe invalide.');
        }
        if (!staff.isActive) {
            throw new common_1.UnauthorizedException('Compte désactivé. Contactez un administrateur.');
        }
        const isPasswordValid = await staff.comparePassword(dto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe invalide.');
        }
        const payload = {
            sub: staff.id,
            email: staff.email,
            roles: staff.roles,
            firstName: staff.firstName,
            lastName: staff.lastName,
        };
        const { password: _pwd, ...safeStaff } = staff;
        return {
            accessToken: this.jwtService.sign(payload),
            staff: safeStaff,
        };
    }
    async me(staffId) {
        return this.staffsService.findById(staffId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staffs_service_1.StaffsService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map