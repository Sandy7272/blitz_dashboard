import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/auth";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = (location.state as { from?: Location })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleAuth0Login = async () => {
    const returnTo = (location.state as { from?: Location })?.from?.pathname || '/';
    await login({ returnTo });
  };

  // Show error if passed from callback
  const errorMessage = (location.state as { error?: string })?.error;

  return (
    <div className="min-h-screen bg-background gradient-radial flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center glow-primary">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <span className="text-3xl font-display font-bold text-foreground">
                Blitz AI
              </span>
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Transform your visuals
              <br />
              <span className="text-primary text-glow">with AI magic</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Professional product photography, food styling, and website audits
              powered by cutting-edge AI.
            </p>
          </motion.div>

          {/* Floating cards animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <div className="flex gap-4">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="glass-card p-4 w-48"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                  <span className="text-primary text-lg">📸</span>
                </div>
                <p className="text-sm text-foreground font-medium">Apparel Photography</p>
                <p className="text-xs text-muted-foreground mt-1">Studio-quality shots</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="glass-card p-4 w-48"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
                  <span className="text-orange-400 text-lg">🍕</span>
                </div>
                <p className="text-sm text-foreground font-medium">Food Photography</p>
                <p className="text-xs text-muted-foreground mt-1">Mouth-watering visuals</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow-primary-subtle">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">
              Blitz AI
            </span>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Welcome back
          </h2>
          <p className="text-muted-foreground mb-8">
            Sign in to access your dashboard and projects
          </p>

          {/* Error message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
            >
              <p className="text-destructive text-sm">{errorMessage}</p>
            </motion.div>
          )}

          {/* Auth0 Login Button */}
          <button
            onClick={handleAuth0Login}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Sign in with Auth0</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">Secure authentication</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              'Enterprise-grade security',
              'Single sign-on (SSO) ready',
              'Multi-factor authentication',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">✓</span>
                </div>
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
