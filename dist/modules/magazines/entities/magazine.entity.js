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
exports.Magazine = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../database/base.entity");
const priceTransformer = {
    to: (value) => value,
    from: (value) => Number(value),
};
let Magazine = class Magazine extends base_entity_1.BaseEntity {
    slug;
    number;
    title;
    subtitle;
    summary;
    price;
    releaseDate;
    isPublished;
    sections;
};
exports.Magazine = Magazine;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        unique: true,
    }),
    __metadata("design:type", String)
], Magazine.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
    }),
    __metadata("design:type", String)
], Magazine.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
    }),
    __metadata("design:type", String)
], Magazine.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Magazine.prototype, "subtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], Magazine.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        transformer: priceTransformer,
    }),
    __metadata("design:type", Number)
], Magazine.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'release_date',
        type: 'date',
    }),
    __metadata("design:type", Date)
], Magazine.prototype, "releaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_published',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Magazine.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        default: () => "'[]'::jsonb",
    }),
    __metadata("design:type", Array)
], Magazine.prototype, "sections", void 0);
exports.Magazine = Magazine = __decorate([
    (0, typeorm_1.Entity)('magazines')
], Magazine);
//# sourceMappingURL=magazine.entity.js.map