export interface AppConfig {
  app: {
    env: string;
    port: number;
  };

  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging: boolean;
  };

  stripe: {
    secretKey: string;
    webhookSecret: string;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  };

  jwt: {
    secret: string;
    expiresIn: string;
  };

  frontend: {
    url: string;
  };

  mail: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
  };
}