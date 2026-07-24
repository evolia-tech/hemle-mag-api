"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagazinesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const magazine_entity_1 = require("./entities/magazine.entity");
const magazines_service_1 = require("./magazines.service");
const public_magazine_controller_1 = require("./controllers/public-magazine.controller");
const admin_magazine_controller_1 = require("./controllers/admin-magazine.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const media_entity_1 = require("../media/entities/media.entity");
let MagazinesModule = class MagazinesModule {
};
exports.MagazinesModule = MagazinesModule;
exports.MagazinesModule = MagazinesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('jwt.secret'),
                    signOptions: {
                        expiresIn: config.get('jwt.expiresIn'),
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([magazine_entity_1.Magazine, media_entity_1.Media]),
        ],
        controllers: [
            public_magazine_controller_1.PublicMagazinesController,
            admin_magazine_controller_1.AdminMagazinesController,
        ],
        providers: [magazines_service_1.MagazinesService],
        exports: [magazines_service_1.MagazinesService],
    })
], MagazinesModule);
//# sourceMappingURL=magazines.module.js.map