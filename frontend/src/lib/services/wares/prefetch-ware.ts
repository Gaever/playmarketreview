import { QUERY_KEY_WARE } from "@/lib/consts";
import { formatGetWare } from "@/lib/formatters/wares";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";

export async function prefetchWare(args: { wareId: string }) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_WARE, args.wareId],
    queryFn: async () => formatGetWare((await http.wares.getWare({ wareId: args.wareId }))?.data),
  });
}
