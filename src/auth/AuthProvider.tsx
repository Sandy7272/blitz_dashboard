/**
 * Auth0 Provider Wrapper
 * Wraps the application with Auth0 context
 */

import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { authConfig, isAuthConfigured } from './authConfig';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    // Navigate to the intended destination after login
    navigate(appState?.returnTo || '/');
  };

  // If Auth0 is not configured, render children without provider
  // This allows development without Auth0 setup
  if (!isAuthConfigured) {
    console.info('Auth0 not configured - running in development mode');
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      authorizationParams={{
        redirect_uri: authConfig.redirectUri,
        audience: authConfig.audience || undefined,
        scope: authConfig.scope,
      }}
      cacheLocation={authConfig.cacheLocation}
      useRefreshTokens={authConfig.useRefreshTokens}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
