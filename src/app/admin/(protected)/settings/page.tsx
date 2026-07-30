export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Platform Settings */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Platform Settings</p>
          <p className="text-xs text-neutral-400">Configure global marketplace parameters.</p>
        </div>
        <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
          {[
            { label: "Platform Commission Rate", value: "10%", note: "Applied to all seller revenues" },
            { label: "Minimum Product Price (AED)", value: "5.00", note: "Products below this price are rejected" },
            { label: "Maximum Return Window (days)", value: "14", note: "Customers may return within this period" },
            { label: "Auto-suspend threshold (return rate)", value: "15%", note: "Sellers above this rate are flagged for review" },
            { label: "Marketplace Currency", value: "AED (United Arab Emirates Dirham)", note: "Read-only — contact support to change" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{s.label}</p>
                <p className="text-xs text-neutral-400">{s.note}</p>
              </div>
              <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-mono font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Account */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Admin Account</p>
        </div>
        <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
          {[
            { label: "Name", value: "Umar Delvi" },
            { label: "Email", value: "umardelvi@gmail.com" },
            { label: "Role", value: "Platform Administrator" },
            { label: "Access Level", value: "Full Access" },
            { label: "Session Duration", value: "24 hours" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{f.label}</p>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future capabilities */}
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/50">
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Planned Future Settings</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-400 sm:grid-cols-3">
          {[
            "JWT Authentication",
            "Multiple Admin Roles",
            "Role-Based Permissions",
            "Audit Logs",
            "Live Notifications (WebSocket)",
            "Payment Gateway Config",
            "Email Notification Templates",
            "Promotional Banner Manager",
            "Coupon & Discount Engine",
            "Flash Sale Scheduler",
            "Seller Tier Management",
            "Automated Compliance Checks",
          ].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
