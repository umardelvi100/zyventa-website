import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { AuthPanel } from "@/components/auth/auth-panel";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/translations";

export default async function LoginPage() {
  const dict = getDictionary(await getLocale());

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="mb-8 w-full max-w-sm">
          <h1 className="text-3xl font-black tracking-tight">{dict.auth.welcomeBack}</h1>
          <p className="mt-2 text-neutral-500">{dict.auth.signInSubtitle}</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <AuthPanel />
    </div>
  );
}
