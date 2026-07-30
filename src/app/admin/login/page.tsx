"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { adminLoginAction } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLoginAction, null);
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="relative h-10 w-36">
            <Image src="/zyventa-logo.png" alt="Zyventa" fill sizes="144px" className="object-contain" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
            Admin Portal
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <h1 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
            Sign in to your account
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            For authorized personnel only.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            {/* Error banner */}
            {state?.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
                {state.error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@zyventa.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in to Admin Portal"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          This area is restricted to Zyventa platform administrators.
        </p>
      </div>
    </div>
  );
}
