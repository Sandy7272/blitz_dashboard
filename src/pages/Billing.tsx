import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Check, CreditCard, Zap, Loader2, AlertCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { load } from '@cashfreepayments/cashfree-js';

export default function Billing() {
  const { user } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null); // State for credits
  const [cashfree, setCashfree] = useState<any>(null);

  // 1. Fetch Credits Function
  const fetchCredits = useCallback(async () => {
    if (!user?.sub) return;
    try {
      const profile = await api.getUserProfile(user.sub);
      setCredits(profile.credits);
    } catch (e) {
      console.error("Failed to load credits");
    }
  }, [user]);

  // 2. Load Credits on Mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // 1. Load Cashfree SDK
  useEffect(() => {
    const initCashfree = async () => {
      try {
        const cf = await load({ mode: "production" }); // Change to "production" for live
        setCashfree(cf);
      } catch (e) {
        console.error("Cashfree SDK failed to load", e);
      }
    };
    initCashfree();
  }, []);

  const handlePurchase = async () => {
    if (!user?.sub || !cashfree) return;
    
    try {
      setLoading(true); // Button Loading Starts
      
      // 1. Create Order (Backend call)
      const res = await api.createCashfreeOrder(user.sub, user.email);
      const { payment_session_id, order_id } = res;

      // 2. Open Checkout
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      };

      // FIX: await this promise so errors are caught!
      const result = await cashfree.checkout(checkoutOptions);

      if(result.error){
          // User closed popup or error occurred
          setLoading(false); // Reset Button
          toast.error(result.error.message || "Payment cancelled");
      }
      if(result.paymentDetails){
          // Payment Success
          await verifyPayment(order_id);
      }
      
    } catch (e: any) {
      console.error("Payment Error:", e);
      
      // Check if the backend sent a specific error message
      if (e.response && e.response.data) {
        console.error("Backend Details:", e.response.data);
        toast.error(`Error: ${e.response.data.error || "Payment init failed"}`);
      } else {
        toast.error("Failed to initiate payment");
      }
      setLoading(false);
    }
  };

  // 3. Update verifyPayment to refresh credits
  const verifyPayment = async (orderId: string) => {
    try {
        const res = await api.verifyCashfreeOrder(orderId, user!.sub!);
        if (res.status === 'success') {
            toast.success("Payment Successful! Credits Added.");
            fetchCredits(); // <--- REFRESH CREDITS HERE
        } else {
            toast.warning("Payment processing. Check back shortly.");
        }
    } catch (e) {
        toast.error("Verification failed. Please contact support.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Billing & Credits</h1>
          <p className="text-muted-foreground">Simple, transparent pricing. Pay as you go.</p>
        </div>

        {/* Current Balance Card */}
        <div className="glass-card p-6 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-bold">Current Balance</h2>
                    <p className="text-sm text-muted-foreground">Credits available for generation</p>
                </div>
            </div>
            <div className="text-3xl font-mono font-bold">
               {/* Display Credits or Loading State */}
               {credits !== null ? credits : <Loader2 className="w-6 h-6 animate-spin inline" />} Cr
            </div>
        </div>

        {/* Pricing Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 border-2 border-primary relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                </div>
                
                <h3 className="text-xl font-bold mb-2">Power Pack</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">$20</span>
                    <span className="text-muted-foreground">/ one-time</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" /> 10 Professional Posts
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" /> All AI Formats (Story, Feed)
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" /> High-Res Downloads
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" /> Commercial License
                    </li>
                </ul>

                <button 
                    onClick={handlePurchase}
                    disabled={loading}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    {loading ? "Processing..." : "Buy 10 Credits"}
                </button>
            </div>
            
            {/* Enterprise / Contact */}
            <div className="glass-card p-8 flex flex-col justify-center text-center opacity-80 hover:opacity-100 transition-opacity">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground mb-6">Need bulk generation or custom integrations?</p>
                <button className="btn-secondary w-full py-3">Contact Sales</button>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}