interface AppEnv {
    API_URL: string;
    APP_NAME: string;
    NODE_ENV: 'development' | 'production' | 'test';
}

const env: AppEnv = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Restaurant Coupon Manager',
    NODE_ENV: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
};

export default env;