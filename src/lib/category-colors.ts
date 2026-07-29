export type CategoryPalette = {
  gradient: string;
  text: string;
  hoverText: string;
  bg: string;
  ring: string;
};

const palettes: Record<string, CategoryPalette> = {
  Medicines: {
    gradient: "from-teal-500 to-cyan-400",
    text: "text-teal-700 dark:text-teal-400",
    hoverText: "hover:text-teal-700 dark:hover:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    ring: "ring-teal-400/40",
  },
  Cosmetics: {
    gradient: "from-purple-500 to-pink-400",
    text: "text-purple-700 dark:text-purple-400",
    hoverText: "hover:text-purple-700 dark:hover:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    ring: "ring-purple-400/40",
  },
  Consumables: {
    gradient: "from-amber-500 to-yellow-400",
    text: "text-amber-700 dark:text-amber-400",
    hoverText: "hover:text-amber-700 dark:hover:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    ring: "ring-amber-400/40",
  },
};

const fallback: CategoryPalette = {
  gradient: "from-indigo-500 to-orange-400",
  text: "text-indigo-700 dark:text-indigo-400",
  hoverText: "hover:text-indigo-700 dark:hover:text-indigo-400",
  bg: "bg-indigo-50 dark:bg-indigo-950/30",
  ring: "ring-indigo-400/40",
};

export function getCategoryPalette(category: string): CategoryPalette {
  return palettes[category] ?? fallback;
}
