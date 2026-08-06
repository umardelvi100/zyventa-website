import Link from "next/link";

const COLOR_MAP: Record<string, string> = {
  indigo: "bg-indigo-600 text-white",
  orange: "bg-orange-500 text-white",
  emerald: "bg-emerald-600 text-white",
  rose: "bg-rose-500 text-white",
  slate: "bg-slate-900 text-white",
};

export function AnnouncementBar({
  text,
  link,
  color = "indigo",
}: {
  text: string;
  link?: string | null;
  color?: string;
}) {
  const cls = COLOR_MAP[color] ?? COLOR_MAP.indigo;
  const content = (
    <p className="px-4 py-2 text-center text-xs font-medium tracking-wide">{text}</p>
  );
  if (link) {
    return (
      <div className={cls}>
        <Link href={link} className="block opacity-90 transition hover:opacity-100">
          {content}
        </Link>
      </div>
    );
  }
  return <div className={cls}>{content}</div>;
}
