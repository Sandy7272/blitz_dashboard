import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Zap, ArrowRight, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/auth";

const features = [
  "500 free credits to start",
  "Access all AI workflows",
  "No credit card required",
  "Premium support included",
];

export default function Signup() {
  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAuth0Signup = async () => {
    await signup({ returnTo: '/' });
  };

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
              Start creating
              <br />
              <span className="text-primary text-glow">in seconds</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-10">
              Join thousands of creators using AI to transform their product visuals
              and grow their business.
            </p>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>
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
            Create your account
          </h2>
          <p className="text-muted-foreground mb-8">
            Get started with 500 free credits
          </p>

          {/* Auth0 Signup Button */}
          <button
            onClick={handleAuth0Signup}
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
                <span>Create account with Auth0</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">What you'll get</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Mobile features */}
          <div className="lg:hidden space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Desktop additional info */}
          <div className="hidden lg:block">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-lg">🎁</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">Welcome bonus</p>
                  <p className="text-muted-foreground text-xs">500 credits to explore all features</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
