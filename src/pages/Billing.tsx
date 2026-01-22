import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Zap, Check, CreditCard, Download, ArrowRight } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "₹499",
    credits: 100,
    features: ["100 AI credits", "All workflows", "Email support", "720p exports"],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹1,499",
    credits: 500,
    features: ["500 AI credits", "All workflows", "Priority support", "4K exports", "API access"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹4,999",
    credits: 2000,
    features: ["2000 AI credits", "All workflows", "24/7 support", "4K exports", "API access", "Custom models"],
    popular: false,
  },
];

const invoices = [
  { id: "INV-001", date: "Jan 15, 2024", amount: "₹1,499", status: "Paid" },
  { id: "INV-002", date: "Dec 15, 2023", amount: "₹1,499", status: "Paid" },
  { id: "INV-003", date: "Nov 15, 2023", amount: "₹499", status: "Paid" },
];

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Billing & Plans
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription and purchase credits
          </p>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-foreground">Current Plan</h2>
                <span className="credit-pill text-xs">PRO</span>
              </div>
              <p className="text-muted-foreground">
                Next billing date: February 15, 2024
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Credits remaining</p>
                <p className="text-2xl font-display font-bold text-primary">1,250</p>
              </div>
              <button className="btn-primary">
                Buy Credits
              </button>
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`glass-card p-6 relative ${
                  plan.popular ? "border-primary/50 glow-primary-subtle" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-display font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-primary mt-2">
                    <Zap className="w-4 h-4 inline mr-1" />
                    {plan.credits} credits
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full ${
                    plan.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {selectedPlan === plan.name ? "Current Plan" : "Upgrade"}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Invoice History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            Invoice History
          </h2>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Invoice
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                  >
                    <td className="p-4 text-sm text-foreground font-medium">
                      {invoice.id}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {invoice.date}
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {invoice.amount}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="btn-ghost text-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
