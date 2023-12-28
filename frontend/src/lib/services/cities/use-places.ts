"use client";

import { QUERY_KEY_PLACES } from "@/lib/consts";
import { formatGetPlaces } from "@/lib/formatters/places";
import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

export function usePlaces() {
  const placesQuery = useQuery({
    queryKey: [QUERY_KEY_PLACES],
    queryFn: async () => formatGetPlaces(await http.places.getPlaces()),
  });

  return {
    placesQuery,
  };
}
