import { IAdListItem } from "@/types";
import { getFavorites } from "../http/favorites";
import { formatGetWares } from "./wares";

export function formatGetFavorites(args: Awaited<ReturnType<typeof getFavorites>>["data"]): IAdListItem[] {
  return formatGetWares(args, { isFavoriteList: true });
}
