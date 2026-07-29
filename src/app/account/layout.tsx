import { AccountSidebar } from "@/components/account/account-sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
