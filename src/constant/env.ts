// Environment configuration
// In Vite, import.meta.env.MODE is 'development' during dev, 'production' during build
export const ENVIRONMENT = import.meta.env.MODE === 'development' 
  ? 'DEVELOPMENT' 
  : 'PRODUCTION';

