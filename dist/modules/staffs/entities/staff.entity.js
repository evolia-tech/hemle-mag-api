"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../database/base.entity");
const role_enum_1 = require("../enums/role.enum");
const bcrypt = __importStar(require("bcrypt"));
let Staff = class Staff extends base_entity_1.BaseEntity {
    email;
    password;
    firstName;
    lastName;
    roles;
    isActive;
    slug;
    bio;
    avatarUrl;
    jobTitle;
    phoneNumber;
    async hashPassword() {
        if (this.password &&
            !this.password.startsWith('$2a$') &&
            !this.password.startsWith('$2b$') &&
            !this.password.startsWith('$2y$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    async comparePassword(attempt) {
        return bcrypt.compare(attempt, this.password);
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    hasRole(role) {
        return this.roles?.includes(role) ?? false;
    }
    hasAnyRole(...roles) {
        return roles.some((r) => this.roles?.includes(r));
    }
};
exports.Staff = Staff;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        unique: true,
    }),
    __metadata("design:type", String)
], Staff.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        select: false,
    }),
    __metadata("design:type", String)
], Staff.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'first_name',
        type: 'varchar',
    }),
    __metadata("design:type", String)
], Staff.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_name',
        type: 'varchar',
    }),
    __metadata("design:type", String)
], Staff.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-array',
        default: role_enum_1.Role.EDITOR,
    }),
    __metadata("design:type", Array)
], Staff.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], Staff.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Staff.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Staff.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'avatar_url',
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Staff.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'job_title',
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Staff.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'phone_number',
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Staff.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Staff.prototype, "hashPassword", null);
exports.Staff = Staff = __decorate([
    (0, typeorm_1.Entity)('staffs')
], Staff);
//# sourceMappingURL=staff.entity.js.map