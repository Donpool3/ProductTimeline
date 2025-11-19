import '@testing-library/jest-dom';

// Mock environment utilities for Jest
jest.mock('./utils/env', () => ({
  getEnv: (key: string, defaultValue?: string) => {
    const envVars: Record<string, string> = {
      VITE_MOCK_MODE: 'true',
      VITE_API_BASE_URL: '/api/v1',
      VITE_MOCK_DELAY: '500',
    };
    return envVars[key] || defaultValue || '';
  },
  isMockMode: () => true,
  getApiBaseUrl: () => '/api/v1',
  getMockDelay: () => 500,
}));
