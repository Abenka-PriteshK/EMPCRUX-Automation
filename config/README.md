# Configuration Directory

This directory contains centralized configuration files for the automation framework.

## Files

### `env.config.js`

Centralized environment configuration helper that:

- Manages environment-specific settings (dev/staging/prod)
- Provides credential management from environment variables
- Handles base URL configuration
- Falls back to defaults when environment variables are not set

## Usage

```javascript
const { getCurrentEnv, getCredentials } = require('./config/env.config');

// Get current environment configuration
const env = getCurrentEnv();
console.log(env.baseURL); // http://localhost:3000

// Get credentials
const creds = getCredentials();
console.log(creds.admin.username); // admin@compmgmt.com
```

## Environment Variables

The configuration reads from the following environment variables:

- `ENVIRONMENT`: dev, staging, or prod (default: dev)
- `BASE_URL`: Base URL for the application
- `API_URL`: API endpoint URL
- `ADMIN_USERNAME`: Admin user email
- `ADMIN_PASSWORD`: Admin user password
- `USER_USERNAME`: Regular user email
- `USER_PASSWORD`: Regular user password
