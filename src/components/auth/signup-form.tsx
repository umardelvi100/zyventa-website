"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";

export function SignupForm() {
  const router = useRouter();
  const { dict } = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.success("Account created — please sign in.");
      router.push("/login");
      return;
    }

    toast.success(`Welcome to Zyventa, ${name.split(" ")[0]}!`);
    router.push("/");
    router.refresh();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium">{dict.auth.fullName}</label>
        <div className="relative">
          <User className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-black/10 bg-white py-3 ps-10 pe-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">{dict.auth.email}</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-black/10 bg-white py-3 ps-10 pe-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">{dict.auth.password}</label>
        <div className="relative">
          <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-black/10 bg-white py-3 ps-10 pe-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-red-600"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition disabled:opacity-70"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? dict.auth.creatingAccount : dict.auth.createAccount}
      </motion.button>

      <p className="text-center text-sm text-neutral-500">
        {dict.auth.alreadyHaveAccount}{" "}
        <Link href="/login" className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400">
          {dict.auth.signIn}
        </Link>
      </p>
    </motion.form>
  );
}
