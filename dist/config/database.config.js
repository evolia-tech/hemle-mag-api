"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const app_config_1 = require("./app.config");
const databaseConfig = () => {
    const config = (0, app_config_1.appConfig)();
    const db = config.database;
    return {
        type: 'postgres',
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        database: db.database,
        autoLoadEntities: true,
        synchronize: false,
        logging: db.logging,
    };
};
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map