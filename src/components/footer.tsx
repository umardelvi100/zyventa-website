import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/translations";

export async function Footer() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <footer className="mt-24 border-t border-black/5 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-neutral-500 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Zyventa. {dict.footer.rights}</p>
        <p>{dict.footer.demoNotice}</p>
      </div>
    </footer>
  );
}
