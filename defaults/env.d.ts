declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        DATABASE_HOST: string;
        DATABASE_PORT: string;
        DATABASE_USERNAME: string;
        DATABASE_PASSWORD: string;
        DATABASE_NAME: string;
        JWT_SECRET: string;
        AWS_BUCKET_NAME: string;
        TZ?: string;
        // Add other environment variables as needed
    }
}