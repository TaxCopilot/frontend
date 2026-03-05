/**
 * Centralized env configuration for TaxCopilot frontend.
 * All env vars should be accessed through this module.
 */

const getEnv = (key: string, fallback: string): string =>
  (typeof process !== 'undefined' && process.env?.[key]) || fallback;

export const env = {
  apiUrl: getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8000'),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  isProd: getEnv('NODE_ENV', 'development') === 'production',
};
