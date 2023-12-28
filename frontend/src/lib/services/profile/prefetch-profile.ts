import { QUERY_KEY_PROFILE } from "@/lib/consts";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";
import { getServersideAuth } from "../auth/get-serverside-auth";
import { formatGetMe, formatUser } from "@/lib/formatters/user";

export async function prefetchProfile(props?: { userId?: string }) {
  const { token } = await getServersideAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_PROFILE, props?.userId],
    queryFn: async () =>
      (props?.userId && formatUser(await http.user.getUser({ userId: props.userId }))) ||
      (token && formatGetMe(await http.user.getMe())) ||
      null,
  });
}
