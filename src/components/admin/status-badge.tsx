import type {
  VerificationStatus,
  ProductApprovalStatus,
  OrderStatus,
} from "@/lib/admin/types";

const VERIFICATION: Record<VerificationStatus, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800",
  },
  verified: {
    label: "Verified",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
  },
  suspended: {
    label: "Suspended",
    cls: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800",
  },
};

const APPROVAL: Record<ProductApprovalStatus, { label: string; cls: string }> = {
  pending_review: {
    label: "Pending Review",
    cls: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800",
  },
};

const ORDER: Record<OrderStatus, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
  },
  processing: {
    label: "Processing",
    cls: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-800",
  },
  shipped: {
    label: "Shipped",
    cls: "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:ring-indigo-800",
  },
  delivered: {
    label: "Delivered",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800",
  },
  returned: {
    label: "Returned",
    cls: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:ring-orange-800",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800",
  },
};

function Pill({ label, cls }: { label: string; cls: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ring-1 ring-inset ${cls}`}
    >
      {label}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const cfg = VERIFICATION[status];
  return <Pill label={cfg.label} cls={cfg.cls} />;
}

export function ApprovalBadge({ status }: { status: ProductApprovalStatus }) {
  const cfg = APPROVAL[status];
  return <Pill label={cfg.label} cls={cfg.cls} />;
}

export function OrderBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER[status];
  return <Pill label={cfg.label} cls={cfg.cls} />;
}
