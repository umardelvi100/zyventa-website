import { Star } from "lucide-react";

export type ReviewData = {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date;
  userName: string;
};

export function ReviewList({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) {
    return <p className="text-neutral-500">No reviews yet — be the first to leave one.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-400">
              {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(review.createdAt)}
            </span>
          </div>
          <p className="mt-2 font-semibold">{review.title}</p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{review.body}</p>
          <p className="mt-2 text-xs font-medium text-neutral-400">{review.userName}</p>
        </div>
      ))}
    </div>
  );
}
