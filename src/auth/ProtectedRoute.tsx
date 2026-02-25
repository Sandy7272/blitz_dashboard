/**
 * Protected Route Component
 * Guards routes that require authentication
 */

import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { isAuthConfigured } from './authConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallbackPath?: string;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Use the raw hook directly to avoid abstraction bugs
  const { isAuthenticated, isLoading } = useAuth0(); 
  const location = useLocation();

  // 1. WAIT: Show spinner while Auth0 initializes
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // 2. CHECK: Only redirect if loading is DONE and user is NOT logged in
  if (!isAuthenticated) {
    // Save the current location so we can send them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. ALLOW
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
          Go to Listing Kit
        </a>
      </motion.div>
    </div>
  );
}

export { AuthLoadingScreen };
