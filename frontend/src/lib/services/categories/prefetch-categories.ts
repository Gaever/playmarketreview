import { QUERY_KEY_CATEGORIES } from "@/lib/consts";
import { formatGetCategories } from "@/lib/formatters/categories";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";

export async function prefetchCategories() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_CATEGORIES],
    queryFn: async () => formatGetCategories(await http.categories.getCategories()),
  });
}
