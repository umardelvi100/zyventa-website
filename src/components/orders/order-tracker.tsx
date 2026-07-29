import { Check, Package, ShieldCheck, Truck } from "lucide-react";

const STEPS = [
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: ShieldCheck },
];

export function OrderTracker({ status }: { status: string }) {
  const isPostDelivery = status.startsWith("return") || status === "refunded";
  const currentIndex = isPostDelivery ? 2 : Math.max(0, STEPS.findIndex((s) => s.key === status));

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-initial">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                  done
                    ? "border-indigo-600 bg-indigo-600 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                    : "border-neutral-200 text-neutral-300 dark:border-neutral-700 dark:text-neutral-600"
                }`}
              >
                {done && i < currentIndex ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              <span
                className={`text-[11px] font-medium ${
                  done ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-400 dark:text-neutral-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-1.5 mb-4 h-0.5 flex-1 rounded-full transition ${
                  i < currentIndex ? "bg-indigo-600 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
