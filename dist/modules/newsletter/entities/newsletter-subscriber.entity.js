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
exports.NewsletterSubscriber = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../database/base.entity");
const newsletter_subscriber_status_enum_1 = require("../enums/newsletter-subscriber-status.enum");
let NewsletterSubscriber = class NewsletterSubscriber extends base_entity_1.BaseEntity {
    email;
    status;
    unsubscribeToken;
    firstName;
    subscribedAt;
    unsubscribedAt;
};
exports.NewsletterSubscriber = NewsletterSubscriber;
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], NewsletterSubscriber.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus,
        default: newsletter_subscriber_status_enum_1.NewsletterSubscriberStatus.SUBSCRIBED,
    }),
    __metadata("design:type", String)
], NewsletterSubscriber.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unsubscribe_token', type: 'varchar', unique: true }),
    __metadata("design:type", String)
], NewsletterSubscriber.prototype, "unsubscribeToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], NewsletterSubscriber.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subscribed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], NewsletterSubscriber.prototype, "subscribedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unsubscribed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], NewsletterSubscriber.prototype, "unsubscribedAt", void 0);
exports.NewsletterSubscriber = NewsletterSubscriber = __decorate([
    (0, typeorm_1.Entity)('newsletter_subscribers')
], NewsletterSubscriber);
//# sourceMappingURL=newsletter-subscriber.entity.js.map