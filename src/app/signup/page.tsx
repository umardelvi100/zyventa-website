import { SignupForm } from "@/components/auth/signup-form";
import { AuthPanel } from "@/components/auth/auth-panel";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/translations";

export default async function SignupPage() {
  const dict = getDictionary(await getLocale());

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="mb-8 w-full max-w-sm">
          <h1 className="text-3xl font-black tracking-tight">{dict.auth.createYourAccount}</h1>
          <p className="mt-2 text-neutral-500">{dict.auth.joinSubtitle}</p>
        </div>
        <SignupForm />
      </div>
      <AuthPanel />
    </div>
  );
}
