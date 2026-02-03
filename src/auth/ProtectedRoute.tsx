/**
 * Protected Route Component
 * Guards routes that require authentication
 */

import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useAuth } from './useAuth';
import { isAuthConfigured } from './authConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // 1. WAIT: If Auth0 is still loading, show a spinner instead of redirecting
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. CHECK: If loading is done and still not authenticated, THEN redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. ROLE CHECK (Optional): If roles are required
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />; // or an unauthorized page
  }

  return <>{children}</>;
};

// Loading screen component
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-background gradient-radial flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center glow-primary">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2"
          >
            <Loader2 className="w-20 h-20 text-primary/30" />
          </motion.div>
        </div>
        <p className="text-muted-foreground font-medium">Authenticating...</p>
      </motion.div>
    </div>
  );
}

// Access denied component
function AccessDenied({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background gradient-radial flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h2 className="text-xl font-display font-bold text-foreground mb-2">
          Access Denied
        </h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        <a href="/" className="btn-primary inline-block">
          Go to Dashboard
        </a>
      </motion.div>
    </div>
  );
}

export { AuthLoadingScreen };
