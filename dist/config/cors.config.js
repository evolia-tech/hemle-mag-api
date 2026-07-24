"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCorsOptions = void 0;
const createCorsOptions = () => {
    const origins = process.env.CORS_ORIGINS?.split(',') ?? [];
    return {
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (origins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    };
};
exports.createCorsOptions = createCorsOptions;
//# sourceMappingURL=cors.config.js.map