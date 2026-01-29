/**
 * Auth0 Configuration
 * Uses Vite environment variables for security
 */

export const authConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || '',
  redirectUri: window.location.origin,
  
  // Auth0 SDK options
  cacheLocation: 'memory' as const, // More secure than localStorage
  useRefreshTokens: true, // Enable silent refresh
  
  // Scopes for API access
  scope: 'openid profile email offline_access',
};

// Validate configuration in development
if (import.meta.env.DEV) {
  const missingVars: string[] = [];
  
  if (!authConfig.domain) missingVars.push('VITE_AUTH0_DOMAIN');
  if (!authConfig.clientId) missingVars.push('VITE_AUTH0_CLIENT_ID');
  
  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Auth0 Configuration Warning:\n` +
      `Missing environment variables: ${missingVars.join(', ')}\n` +
      `Auth functionality will be limited until these are configured.`
    );
  }
}

export const isAuthConfigured = Boolean(authConfig.domain && authConfig.clientId);
