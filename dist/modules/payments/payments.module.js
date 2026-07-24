"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PaymentsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const payments_service_1 = require("./payments.service");
const payments_tokens_1 = require("./constants/payments.tokens");
const stripe_provider_1 = require("./providers/stripe.provider");
const typeorm_1 = require("@nestjs/typeorm");
const magazines_module_1 = require("../magazines/magazines.module");
const jwt_1 = require("@nestjs/jwt");
const webhook_controller_1 = require("./controllers/webhook.controller");
const payments_controller_1 = require("./controllers/payments.controller");
const payment_entity_1 = require("./entities/payment.entity");
const customers_module_1 = require("../customers/customers.module");
const orders_module_1 = require("../orders/orders.module");
let PaymentsModule = PaymentsModule_1 = class PaymentsModule {
    static registerPayments() {
        return {
            module: PaymentsModule_1,
            controllers: [
                payments_controller_1.PaymentsController,
                webhook_controller_1.WebhookController
            ],
            providers: [
                {
                    provide: payments_tokens_1.PAYMENTS_PROVIDER,
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => {
                        const providers = [
                            new stripe_provider_1.StripeProvider(configService.get('STRIPE_SECRET_KEY'), configService.get('FRONTEND_URL'), configService.get('STRIPE_WEBHOOK_SECRET'))
                        ];
                        return providers;
                    },
                },
                payments_service_1.PaymentsService,
            ],
            imports: [
                typeorm_1.TypeOrmModule.forFeature([payment_entity_1.PaymentEntity]),
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
                magazines_module_1.MagazinesModule,
                customers_module_1.CustomersModule,
                orders_module_1.OrdersModule
            ],
            exports: [payments_service_1.PaymentsService],
        };
    }
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = PaymentsModule_1 = __decorate([
    (0, common_1.Module)({})
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map