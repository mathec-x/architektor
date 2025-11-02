declare namespace NodeJS {
    interface ProcessEnv {
        APPLICATION_NAME: string;
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        DATABASE_URL: string;
        LOG_LEVEL: string;
        LOG_FORMAT: string;
        JWT_SECRET: string;
        AWS_BUCKET_NAME: string;
        TZ?: string;
        // Add other environment variables as needed
    }
}