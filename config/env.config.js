/**
 * Environment Configuration Helper
 * Centralized configuration for different environments
 */

// Get environment from process.env or default to 'dev'
const environment = process.env.ENVIRONMENT || 'dev';

// Environment-specific configurations
const environments = {
  dev: {
    baseURL: process.env.BASE_URL || 'https://aryan-vms.empcrux.com',
    apiURL: process.env.API_URL || 'http://localhost:3000/api',
  },
  staging: {
    baseURL: process.env.BASE_URL || 'https://aryan-vms.empcrux.com',
    apiURL: process.env.API_URL || 'https://vms.staging.abenka.com/api',
  },
  prod: {
    baseURL: process.env.BASE_URL || 'https://aryan-vms.empcrux.com',
    apiURL: process.env.API_URL || 'https://vms.abenka.com/api',
  },
};

// Get current environment config
const getCurrentEnv = () => {
  return environments[environment] || environments.dev;
};

// Get credentials from environment variables (for CI/CD) or return test data defaults
const getCredentials = () => {
  return {
    admin: {
      username: process.env.ADMIN_USERNAME || 'admin@aryanpumps.com',
      password: process.env.ADMIN_PASSWORD || 'password123',
    },
    user: {
      username: process.env.USER_USERNAME || 'admin@aryanpumps.com',
      password: process.env.USER_PASSWORD || 'password123',
    },
  };
};

module.exports = {
  environment,
  getCurrentEnv,
  getCredentials,
  environments,
};
