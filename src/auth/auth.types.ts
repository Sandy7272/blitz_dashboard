/**
 * Auth0 Authentication Types
 * Strong TypeScript typing for user and role management
 */

export interface AuthUser {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  updated_at?: string;
  // Custom claims from Auth0 (namespace required)
  'https://blitz.ai/roles'?: string[];
  'https://blitz.ai/permissions'?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: Error | null;
}

export interface AuthContextValue extends AuthState {
  login: (options?: LoginOptions) => Promise<void>;
  signup: (options?: LoginOptions) => Promise<void>;
  logout: (options?: LogoutOptions) => void;
  getAccessToken: () => Promise<string>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export interface LoginOptions {
  returnTo?: string;
  screen_hint?: 'signup' | 'login';
}

export interface LogoutOptions {
  returnTo?: string;
}

// Role constants for RBAC
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Permission constants
export const PERMISSIONS = {
  CREATE_PROJECT: 'create:project',
  DELETE_PROJECT: 'delete:project',
  VIEW_ANALYTICS: 'view:analytics',
  MANAGE_USERS: 'manage:users',
  MANAGE_BILLING: 'manage:billing',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
