/**
 * Auth API Setup Hook
 * Connects the auth module to the API layer for token injection
 */

import { useEffect } from 'react';
import { useAuth } from '@/auth';
import { setAuthTokenGetter } from '@/lib/api';

export function useAuthApiSetup() {
  const { getAccessToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Set up the token getter for API calls
      setAuthTokenGetter(getAccessToken);
    }
  }, [isAuthenticated, getAccessToken]);
}
