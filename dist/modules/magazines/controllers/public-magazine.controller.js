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
exports.PublicMagazinesController = void 0;
const common_1 = require("@nestjs/common");
const magazines_service_1 = require("../magazines.service");
let PublicMagazinesController = class PublicMagazinesController {
    magazinesService;
    constructor(magazinesService) {
        this.magazinesService = magazinesService;
    }
    findAllPublished() {
        return this.magazinesService.findAllPublishedWithMedia();
    }
    findLatest() {
        return this.magazinesService.findLatestPublished();
    }
    findOne(slug) {
        return this.magazinesService.findBySlug(slug);
    }
    async downloadWithToken(token) {
        if (!token) {
            throw new common_1.BadRequestException('Missing token');
        }
        return this.magazinesService.downloadWithToken(token);
    }
};
exports.PublicMagazinesController = PublicMagazinesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicMagazinesController.prototype, "findAllPublished", null);
__decorate([
    (0, common_1.Get)('latest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicMagazinesController.prototype, "findLatest", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicMagazinesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('download'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicMagazinesController.prototype, "downloadWithToken", null);
exports.PublicMagazinesController = PublicMagazinesController = __decorate([
    (0, common_1.Controller)('magazines'),
    __metadata("design:paramtypes", [magazines_service_1.MagazinesService])
], PublicMagazinesController);
//# sourceMappingURL=public-magazine.controller.js.map