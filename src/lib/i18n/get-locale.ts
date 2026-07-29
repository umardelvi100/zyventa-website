import { cookies } from "next/headers";
import type { Locale } from "./translations";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get("locale")?.value;
  return value === "ar" ? "ar" : "en";
}
