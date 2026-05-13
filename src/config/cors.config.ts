import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const createCorsOptions = (): CorsOptions => {
  const origins = process.env.CORS_ORIGINS?.split(',') ?? [];

  
  return {
    origin: (origin, callback) => {

      if (!origin) {
        return callback(null, true);
      }

      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
};