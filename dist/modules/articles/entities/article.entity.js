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
exports.Article = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../database/base.entity");
const article_status_enum_1 = require("../enums/article-status.enum");
const staff_entity_1 = require("../../staffs/entities/staff.entity");
let Article = class Article extends base_entity_1.BaseEntity {
    title;
    slug;
    summary;
    content;
    coverImageUrl;
    status;
    publishedAt;
    author;
    authorId;
};
exports.Article = Article;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], Article.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Article.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Article.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cover_image_url', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Article.prototype, "coverImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: article_status_enum_1.ArticleStatus,
        default: article_status_enum_1.ArticleStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Article.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Article.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", Object)
], Article.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Article.prototype, "authorId", void 0);
exports.Article = Article = __decorate([
    (0, typeorm_1.Entity)('articles')
], Article);
//# sourceMappingURL=article.entity.js.map