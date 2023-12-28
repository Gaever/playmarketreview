import { getCitiesResData } from "@/types/api";
import { getCities } from "../http/cities";

export function formatGetCities(args: Awaited<ReturnType<typeof getCities>>): getCitiesResData {
  return args?.data?.data || [];
}
