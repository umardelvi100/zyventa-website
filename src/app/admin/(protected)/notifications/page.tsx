import Link from "next/link";
import { Bell, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/admin/mock-data";
import type { NotificationSeverity } from "@/lib/admin/types";

const SEVERITY_CONFIG: Record<
  NotificationSeverity,
  { icon: React.ReactNode; cls: string; bg: string }
> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    cls: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    cls: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  error: {
    icon: <XCircle className="h-4 w-4" />,
    cls: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    cls: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
};

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export default function NotificationsPage() {
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
  const read = MOCK_NOTIFICATIONS.filter((n) => n.read);

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Unread", value: unread.length, cls: "text-red-600 dark:text-red-400" },
          { label: "Total", value: MOCK_NOTIFICATIONS.length, cls: "text-neutral-800 dark:text-white" },
          { label: "Warnings", value: MOCK_NOTIFICATIONS.filter((n) => n.severity === "warning").length, cls: "text-amber-600 dark:text-amber-400" },
          { label: "Errors", value: MOCK_NOTIFICATIONS.filter((n) => n.severity === "error").length, cls: "text-red-600 dark:text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
            <p className="text-xs text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
            <Bell className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold text-neutral-800 dark:text-white">
              Unread Notifications
            </p>
          </div>
          <ul className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
            {unread.map((n) => {
              const cfg = SEVERITY_CONFIG[n.severity];
              return (
                <li key={n.id} className="flex items-start gap-4 px-5 py-4 bg-indigo-50/30 dark:bg-indigo-950/10">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.cls}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{n.title}</p>
                      <span className="shrink-0 text-xs text-neutral-400">{relativeTime(n.timestamp)}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{n.message}</p>
                    {n.entityId && n.entityType === "seller" && (
                      <Link
                        href={`/admin/sellers/${n.entityId}`}
                        className="mt-1 inline-text text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        View Seller →
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Read */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Previous Notifications</p>
        </div>
        <ul className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
          {read.map((n) => {
            const cfg = SEVERITY_CONFIG[n.severity];
            return (
              <li key={n.id} className="flex items-start gap-4 px-5 py-4">
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.cls} opacity-60`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{n.title}</p>
                    <span className="shrink-0 text-xs text-neutral-400">{relativeTime(n.timestamp)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-500">{n.message}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
