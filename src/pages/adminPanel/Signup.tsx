import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

// Secret code required for admin registration
const SECRET_ACCESS_CODE = "876543";

export default function Signup() {
  const { user, loading, signUpAdmin } = useAuth();

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");

  // Access code flow
  const [accessCodeEnabled, setAccessCodeEnabled] = useState(false);
  const [accessCodeVerified, setAccessCodeVerified] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Leaf className="w-8 h-8 text-primary-foreground animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/admin-login" replace />;

  // Enable access code input
  const handleSendAccessCode = () => {
    setAccessCodeEnabled(true);
    setAccessCodeVerified(false);
    setAccessCode("");
    toast.info("Access code input enabled. Please enter your code.");
  };

  // Verify the entered access code
  const handleVerifyAccessCode = () => {
    if (!accessCode) {
      toast.error("Please enter the access code first");
      return;
    }
    if (accessCode === SECRET_ACCESS_CODE) {
      setAccessCodeVerified(true);
      toast.success("Access code verified successfully!");
    } else {
      setAccessCodeVerified(false);
      toast.error("Invalid access code. Please try again.");
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validations
    if (!displayName || !age || !phone || !email || !password || !confirmPassword) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!accessCodeVerified) {
      toast.error("Please verify your access code before proceeding");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (Number(age) < 1 || Number(age) > 120) {
      toast.error("Please enter a valid age");
      return;
    }

    setSubmitting(true);

    try {
      // Create authentication user via your custom hook
      const { error, user: newUser } = await signUpAdmin({
        name: displayName.trim(),
        age: Number(age),
        phone: phone,
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      toast.success("Admin account created successfully!");
      // Optionally redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Age */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary"
                  placeholder="Age"
                  required
                  min="1"
                  max="120"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary"
                  placeholder="10-digit mobile number"
                  required
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            {/* Access Code */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Access Code
                {accessCodeVerified && (
                  <span className="ml-2 inline-flex items-center gap-1 text-green-500 text-xs font-semibold">
                    <CheckCircle size={13} /> Verified
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      setAccessCodeVerified(false);
                    }}
                    disabled={!accessCodeEnabled}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary transition-all ${
                      !accessCodeEnabled
                        ? "opacity-50 cursor-not-allowed bg-muted"
                        : accessCodeVerified
                        ? "border-green-500 focus:ring-green-400"
                        : ""
                    }`}
                    placeholder={
                      accessCodeEnabled
                        ? "Enter access code"
                        : "Click 'Send Code' to enable"
                    }
                  />
                </div>

                {!accessCodeEnabled && (
                  <button
                    type="button"
                    onClick={handleSendAccessCode}
                    className="px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold whitespace-nowrap hover:opacity-90 transition"
                  >
                    Send Code
                  </button>
                )}

                {accessCodeEnabled && (
                  <button
                    type="button"
                    onClick={handleVerifyAccessCode}
                    disabled={accessCodeVerified}
                    className={`px-4 py-3 rounded-xl text-white text-sm font-semibold whitespace-nowrap transition ${
                      accessCodeVerified
                        ? "bg-green-500 cursor-default"
                        : "bg-primary hover:opacity-90"
                    }`}
                  >
                    {accessCodeVerified ? "Verified ✓" : "Verify"}
                  </button>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border focus:ring-2 focus:ring-primary"
                    placeholder="Password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border focus:ring-2 focus:ring-primary"
                    placeholder="Confirm Password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !accessCodeVerified}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/admin-login" className="text-primary font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}