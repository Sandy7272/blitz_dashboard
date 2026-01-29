/**
 * Custom Auth Hook
 * Provides a clean API for authentication throughout the app
 */

import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useMemo } from 'react';
import { AuthUser, AuthContextValue, LoginOptions, LogoutOptions, ROLES } from './auth.types';
import { isAuthConfigured } from './authConfig';

// Namespace for custom claims (must match Auth0 rules/actions)
const CLAIMS_NAMESPACE = 'https://blitz.ai';

export function useAuth(): AuthContextValue {
  const auth0 = useAuth0();

  // Extract user with typed custom claims
  const user = useMemo((): AuthUser | null => {
    if (!auth0.user) return null;
    
    return {
      sub: auth0.user.sub || '',
      email: auth0.user.email,
      email_verified: auth0.user.email_verified,
      name: auth0.user.name,
      nickname: auth0.user.nickname,
      picture: auth0.user.picture,
      updated_at: auth0.user.updated_at,
      [`${CLAIMS_NAMESPACE}/roles`]: auth0.user[`${CLAIMS_NAMESPACE}/roles`] as string[] | undefined,
      [`${CLAIMS_NAMESPACE}/permissions`]: auth0.user[`${CLAIMS_NAMESPACE}/permissions`] as string[] | undefined,
    };
  }, [auth0.user]);

  // Login with redirect
  const login = useCallback(async (options?: LoginOptions) => {
    if (!isAuthConfigured) {
      console.warn('Auth0 not configured');
      return;
    }
    
    await auth0.loginWithRedirect({
      appState: { returnTo: options?.returnTo || window.location.pathname },
      authorizationParams: {
        screen_hint: options?.screen_hint,
      },
    });
  }, [auth0]);

  // Signup (same as login but with signup hint)
  const signup = useCallback(async (options?: LoginOptions) => {
    await login({ ...options, screen_hint: 'signup' });
  }, [login]);

  // Logout
  const logout = useCallback((options?: LogoutOptions) => {
    if (!isAuthConfigured) {
      console.warn('Auth0 not configured');
      return;
    }
    
    auth0.logout({
      logoutParams: {
        returnTo: options?.returnTo || window.location.origin,
      },
    });
  }, [auth0]);

  // Get access token for API calls
  const getAccessToken = useCallback(async (): Promise<string> => {
    if (!isAuthConfigured) {
      console.warn('Auth0 not configured');
      return '';
    }
    
    try {
      const token = await auth0.getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      // If refresh fails, redirect to login
      if ((error as Error).message?.includes('login_required')) {
        await login();
      }
      throw error;
    }
  }, [auth0, login]);

  // Check if user has a specific role
  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false;
    const roles = user[`${CLAIMS_NAMESPACE}/roles`] || [];
    return roles.includes(role);
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    const permissions = user[`${CLAIMS_NAMESPACE}/permissions`] || [];
    return permissions.includes(permission);
  }, [user]);

  // Return auth state with mock fallback for development
  if (!isAuthConfigured) {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
      login,
      signup,
      logout,
      getAccessToken,
      hasRole: () => false,
      hasPermission: () => false,
    };
  }

  return {
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    user,
    error: auth0.error || null,
    login,
    signup,
    logout,
    getAccessToken,
    hasRole,
    hasPermission,
  };
}

// Export a hook for checking admin status
export function useIsAdmin(): boolean {
  const { hasRole } = useAuth();
  return hasRole(ROLES.ADMIN);
}

// Export a hook for checking pro status
export function useIsPro(): boolean {
  const { hasRole } = useAuth();
  return hasRole(ROLES.PRO) || hasRole(ROLES.ENTERPRISE) || hasRole(ROLES.ADMIN);
}
