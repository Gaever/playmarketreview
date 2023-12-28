import { AdDetails, Coordinates, IAdListItem } from "@/types";
import { getMyCreatedWares, getWare, getWares } from "../http/wares";
import { getWaresResData } from "@/types/api";
import { formatGetCities } from "./cities";
import { formatGetPlaces } from "./places";

export function formatGetWares(
  args: Awaited<ReturnType<typeof getWares>>["data"],
  options: { isFavoriteList?: boolean; favoriteIds?: Record<string, string> }
): IAdListItem[] {
  return (args?.data || []).map((item) => ({
    id: `${item.id || ""}`,
    address: item?.address || "",
    created_at: null,
    photos: [{ url: item?.avatar!, height: item?.avatar_height! || 300, width: item?.avatar_width! || 300 }],
    price: item.price,
    title: item.name,
    is_favorite: options?.isFavoriteList || !!options?.favoriteIds?.[item?.id!],
    status: item?.status,
  }));
}

export function formatGetMyWares(args: Awaited<ReturnType<typeof getMyCreatedWares>>["data"]): IAdListItem[] {
  return (args?.data || []).map((item) => ({
    id: `${item.id || ""}`,
    address: item?.address || "",
    created_at: null,
    photos: [{ url: item?.avatar!, height: item?.avatar_height! || 300, width: item?.avatar_width! || 300 }],
    price: item.price,
    title: item.name,
    is_favorite: false,
    status: item.status,
  }));
}

export function formatGetWare(
  args: Awaited<ReturnType<typeof getWare>>["data"],
  options?: { favoriteIds?: Record<string, string> }
): AdDetails {
  let titleImageIndex = args.data?.images?.findIndex((item) => args.data?.avatar === item.avatar) ?? 0;
  titleImageIndex = titleImageIndex < 0 ? 0 : titleImageIndex;

  return {
    id: `${args?.data?.id || ""}`,
    address: args.data.address || "",
    lat: args?.data?.lat || args.data?.city?.lat,
    lon: args?.data?.lon || args.data?.city?.lon,
    city_id: args.data.city_id || args.data?.city?.id,
    place_id: args.data.place_id,
    created_at: new Date(),
    photos: args.data.images || [],
    price: args.data.price,
    title: args.data.name,
    characteristics: [],
    description: args.data.description,
    categories: args.data?.categories || [],
    rating: 0,
    titleImageIndex,
    seller: {
      id: `${args.data?.trader?.id || ""}`,
      name: args.data?.trader?.name || "",
      avatar: args.data?.trader?.avatar || "",
      ratingUp: args.data?.trader?.trader_vote_up || 0,
      ratingDown: args.data?.trader?.trader_vote_down || 0,
    },

    mapUrl: args.data?.map_url,
    status: args.data?.status,
    isFavorited: !!options?.favoriteIds?.[args?.data?.id?.toString() || ""],
  };
}

export const statusToLabel: Record<NonNullable<getWaresResData[number]["status"]>, string> = {
  draft: "Brouillon",
  off: "Non publié",
  on: "Publié",
  sold: "Vendu",
};

export const getWareLocation = (args: {
  adDeatails?: AdDetails;
  cities?: ReturnType<typeof formatGetCities>;
  places?: ReturnType<typeof formatGetPlaces>;
}): (Coordinates & { title?: string }) | undefined => {
  if (args.adDeatails?.place_id) {
    const item = args.places?.find((item) => item.id === args.adDeatails?.place_id);

    return {
      lat: item?.lat!,
      lon: item?.lon!,
      title: item?.name,
    };
  }

  if (args.adDeatails?.city_id) {
    const item = args.cities?.find((item) => item.id === args.adDeatails?.place_id);

    return {
      lat: item?.lat!,
      lon: item?.lon!,
      title: item?.name,
    };
  }

  if (args.adDeatails?.lat && args?.adDeatails?.lon) {
    return {
      lat: args.adDeatails?.lat!,
      lon: args.adDeatails?.lon!,
    };
  }

  return;
};
