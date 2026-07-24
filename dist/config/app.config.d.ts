export declare const appConfig: () => {
    app: {
        env: string;
        port: number;
    };
    database: {
        host: string | undefined;
        port: number;
        username: string | undefined;
        password: string | undefined;
        database: string | undefined;
        logging: boolean;
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
        currency: string;
        successUrl: string;
        cancelUrl: string;
    };
    jwt: {
        secret: string | undefined;
        expiresIn: string | undefined;
    };
    frontend: {
        url: string | undefined;
    };
    mail: {
        host: string;
        port: number;
        secure: boolean;
        user: string | undefined;
        pass: string | undefined;
        from: string;
    };
};
