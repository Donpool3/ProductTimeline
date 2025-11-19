/**
 * Environment Variable Utilities
 *
 * Provides a testable way to access environment variables
 */

export const getEnv = (key: string, defaultValue?: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env[key] as string) || defaultValue || '';
  }
  return defaultValue || '';
};

export const isMockMode = (): boolean => {
  return getEnv('VITE_MOCK_MODE') === 'true';
};

export const getApiBaseUrl = (): string => {
  return getEnv('VITE_API_BASE_URL', '/api/v1');
};

export const getMockDelay = (): number => {
  return parseInt(getEnv('VITE_MOCK_DELAY', '500'));
};
