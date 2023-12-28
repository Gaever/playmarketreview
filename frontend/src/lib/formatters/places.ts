import { getPlacesResData } from "@/types/api";
import { getPlaces } from "../http/places";

export function formatGetPlaces(args: Awaited<ReturnType<typeof getPlaces>>): getPlacesResData {
  return args?.data?.data || [];
}
