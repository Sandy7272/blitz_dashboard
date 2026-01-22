import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { User, Mail, Globe, LogOut, Camera, Shield, Bell, Palette } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "mr", name: "मराठी" },
];

export default function Profile() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [language, setLanguage] = useState("en");

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Profile Photo
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary text-primary-foreground hover:shadow-glow transition-shadow">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">John Doe</p>
                <p className="text-sm text-muted-foreground mb-3">
                  JPG, PNG or GIF. Max 2MB
                </p>
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm py-2 px-4">
                    Upload
                  </button>
                  <button className="btn-ghost text-sm text-destructive">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Personal Information
            </h2>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glass pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass pl-12"
                  />
                </div>
              </div>
            </div>
            <button className="btn-primary mt-6">
              Save Changes
            </button>
          </motion.div>

          {/* Plan Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Current Plan
                </h2>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-display font-bold text-primary">
                    Pro
                  </span>
                  <span className="credit-pill text-xs">Active</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  1,250 credits remaining • Renews on Feb 15, 2024
                </p>
              </div>
              <button className="btn-secondary">
                Manage Plan
              </button>
            </div>
          </motion.div>

          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Language
            </h2>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-glass pl-12 appearance-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-foreground font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your account</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded accent-primary"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-foreground font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded accent-primary"
                />
              </label>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 border border-destructive/30"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data.
            </p>
            <button className="btn-ghost text-destructive border border-destructive/30 hover:bg-destructive/10">
              Delete Account
            </button>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button className="btn-secondary w-full flex items-center justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
