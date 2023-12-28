"use client";

import { QUERY_KEY_CITIES } from "@/lib/consts";
import { formatGetCities } from "@/lib/formatters/cities";
import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

export function useCities() {
  const citiesQuery = useQuery({
    queryKey: [QUERY_KEY_CITIES],
    queryFn: async () => formatGetCities(await http.cities.getCities()),
  });

  return {
    citiesQuery,
  };
}
