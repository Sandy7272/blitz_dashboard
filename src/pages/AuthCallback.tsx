/**
 * Auth Callback Page
 * Handles the redirect from Auth0 after authentication
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useAuth } from '@/auth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Get the intended destination from state or default to home
        const from = (location.state as { from?: Location })?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else if (error) {
        console.error('Authentication error:', error);
        navigate('/login', { 
          replace: true, 
          state: { error: error.message } 
        });
      }
    }
  }, [isAuthenticated, isLoading, error, navigate, location]);

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
        <p className="text-muted-foreground font-medium">
          {error ? 'Authentication failed...' : 'Completing sign in...'}
        </p>
        {error && (
          <p className="text-destructive text-sm max-w-xs text-center">
            {error.message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
