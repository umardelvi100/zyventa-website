import type { SellerOrderStatus } from "@/lib/seller/types";

const ORDER_STATUS_CONFIG: Record<
  SellerOrderStatus,
  { label: string; className: string }
> = {
  pending:           { label: "Pending",           className: "bg-amber-50 text-amber-700 border-amber-200" },
  packed:            { label: "Packed",            className: "bg-blue-50 text-blue-700 border-blue-200" },
  warehouse_accepted:{ label: "Warehouse Accepted",className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  ready_for_pickup:  { label: "Ready for Pickup",  className: "bg-purple-50 text-purple-700 border-purple-200" },
  shipped:           { label: "Shipped",           className: "bg-sky-50 text-sky-700 border-sky-200" },
  out_for_delivery:  { label: "Out for Delivery",  className: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  delivered:         { label: "Delivered",         className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  returned:          { label: "Returned",          className: "bg-orange-50 text-orange-700 border-orange-200" },
  cancelled:         { label: "Cancelled",         className: "bg-red-50 text-red-700 border-red-200" },
};

export function OrderStatusBadge({ status }: { status: SellerOrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function ApprovalBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const map = {
    pending:  "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function SeverityDot({ severity }: { severity: "info" | "warning" | "success" | "error" }) {
  const map = {
    info:    "bg-blue-500",
    warning: "bg-amber-500",
    success: "bg-emerald-500",
    error:   "bg-red-500",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${map[severity]}`} />;
}
