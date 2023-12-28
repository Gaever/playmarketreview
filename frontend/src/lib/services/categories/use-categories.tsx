"use client";

import { QUERY_KEY_CATEGORIES } from "@/lib/consts";
import { formatGetCategories } from "@/lib/formatters/categories";
import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import {
  Bag,
  CarFront,
  Code,
  Grid3x3,
  Headphones,
  House,
  HouseHeart,
  Laptop,
  Phone,
  Plug,
  Printer,
} from "react-bootstrap-icons";

export const categoryToIcon: Record<string, React.ReactElement> = {
  "ordinateurs portables": <Laptop size={30} color="black" />,
  "imprimante et scanner": <Printer size={30} color="black" />,
  logiciels: <Code size={30} color="black" />,
  accessoires: <Bag size={30} color="black" />,
  supermarche: <Grid3x3 size={30} color="black" />,
  "maison et bureau": <House size={30} color="black" />,
  "telephones et tablettes": <Phone size={30} color="black" />,
  electromenager: <Plug size={30} color="black" />,
  "accessoires telephonie": <Headphones size={30} color="black" />,
  "gros electromenager": <HouseHeart size={30} color="black" />,
  vehicules: <CarFront size={30} color="black" />,
};

export function useCategories() {
  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEY_CATEGORIES],
    queryFn: async () => formatGetCategories(await http.categories.getCategories()),
  });

  return {
    categoriesQuery,
  };
}
