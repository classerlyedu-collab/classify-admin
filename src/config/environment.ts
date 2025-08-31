export interface EnvironmentConfig {
    // API Configuration
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_API_VERSION: string;

    // Google Maps Configuration
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;

    // Application Configuration
    NODE_ENV: string;

    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: boolean;
    NEXT_PUBLIC_ENABLE_MAPS: boolean;

    // UI Configuration
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;

    // Timeouts and Limits
    NEXT_PUBLIC_REQUEST_TIMEOUT: number;
    NEXT_PUBLIC_AUTO_HIDE_DURATION: number;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
    return {
        // API Configuration
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api/v1/',
        NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',

        // Google Maps Configuration
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',

        // Application Configuration
        NODE_ENV: process.env.NODE_ENV || 'development',

        // Feature Flags
        NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
        NEXT_PUBLIC_ENABLE_MAPS: process.env.NEXT_PUBLIC_ENABLE_MAPS === 'true',

        // UI Configuration
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Classify Admin',
        NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

        // Timeouts and Limits
        NEXT_PUBLIC_REQUEST_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT || '30000'),
        NEXT_PUBLIC_AUTO_HIDE_DURATION: parseInt(process.env.NEXT_PUBLIC_AUTO_HIDE_DURATION || '5000'),
    };
};

export const config = getEnvironmentConfig();
