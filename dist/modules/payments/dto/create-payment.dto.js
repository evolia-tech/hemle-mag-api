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
exports.CreateCheckoutPageDto = exports.CreatePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const payment_provider_enum_1 = require("../enums/payment-provider.enum");
class PaymentItemDto {
    magazineId;
    quantity;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentItemDto.prototype, "magazineId", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaymentItemDto.prototype, "quantity", void 0);
class CreatePaymentDto {
    provider;
    customerEmail;
    firstName;
    lastName;
    phone;
    currency;
    items;
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, class_validator_1.IsEnum)(payment_provider_enum_1.PaymentProviderEnum, { message: 'Le fournisseur de paiement doit être valide (stripe ou paypal).' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "customerEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentItemDto),
    __metadata("design:type", Array)
], CreatePaymentDto.prototype, "items", void 0);
class CreateCheckoutPageDto {
    provider;
    currency;
    items;
}
exports.CreateCheckoutPageDto = CreateCheckoutPageDto;
__decorate([
    (0, class_validator_1.IsEnum)(payment_provider_enum_1.PaymentProviderEnum, { message: 'Le fournisseur de paiement doit être valide (stripe ou paypal).' }),
    __metadata("design:type", String)
], CreateCheckoutPageDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCheckoutPageDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentItemDto),
    __metadata("design:type", Array)
], CreateCheckoutPageDto.prototype, "items", void 0);
//# sourceMappingURL=create-payment.dto.js.map