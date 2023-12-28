import { Category } from "@/types";
import { getCategories } from "../http/categories";

export function formatGetCategories(args: Awaited<ReturnType<typeof getCategories>>): Category[] {
  return (args.data?.data || []).map((item) => ({ id: `${item.id}`, label: item.name }));
}
