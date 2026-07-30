/**
 * Admin root layout — covers the full viewport so the main site's
 * Navbar and Footer are hidden while on any /admin route.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-neutral-950">
      {children}
    </div>
  );
}
