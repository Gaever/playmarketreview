"use client";

import { useCategories } from "@/lib/services/categories/use-categories";
import { useFavorites } from "@/lib/services/favorites/use-favorites";
import { useWares } from "@/lib/services/wares/use-wares";
import { WareFilters } from "@/types";
import { useState } from "react";
import Search from "./search";
import { useCities } from "@/lib/services/cities/use-cities";
import { wareDetailsHref } from "@/lib/compose-href";
import { usePlaces } from "@/lib/services/cities/use-places";
// import { usePlaces } from "@/lib/services/cities/use-places";

export interface ClientContainerProps {}

const ClientContainer: React.FC<ClientContainerProps> = () => {
  const { citiesQuery } = useCities();
  const { placesQuery } = usePlaces();
  const [filters, setFilters] = useState<WareFilters>({});
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchStr, setSearchStr] = useState<string>("");

  const [isFiltersModalShown, setIsFilterModalShown] = useState(false);

  const { favoriteIds, onFavoriteClick } = useFavorites();
  const { waresInfiniteQuery, waresList } = useWares({
    filters,
    searchStr,
    favoriteIds,
  });
  const { categoriesQuery } = useCategories();

  return (
    <Search
      AdListProps={{
        items: waresList,
        isLastPage: !waresInfiniteQuery.hasNextPage,
        onScrolledToBottom: waresInfiniteQuery.fetchNextPage,
        composeHref: (item) => wareDetailsHref({ itemId: item.id }),
        onFavoriteClick,
      }}
      CategoriesMenuProps={{
        categories: categoriesQuery.data || [],
        pickedCategoriesIds: filters.categoryIds || [],
        onClick: (categoryId) => {
          if (filters.categoryIds?.includes(categoryId)) {
            setFilters((prev) => ({
              ...prev,
              categoryIds: (prev.categoryIds || []).filter((item) => item !== categoryId),
            }));
          } else {
            setFilters((prev) => ({ ...prev, categoryIds: [categoryId] }));
          }
        },
      }}
      SearchHeaderProps={{
        onChange: (event) => {
          setSearchInput(event.target.value);
        },
        onFilterClick: () => {
          setIsFilterModalShown(true);
        },
        onSearchSubmit: () => {
          setSearchStr(searchInput);
        },
      }}
      FilterModalProps={{
        filters,
        isShown: isFiltersModalShown,
        AddressPickerProps: {
          cities: citiesQuery.data || [],
          places: placesQuery.data || [],
        },
        onFilterChange: (value) => {
          setFilters((prev) => ({ categoryIds: prev.categoryIds, search: prev.search, ...value }));
        },
        onClose: () => {
          setIsFilterModalShown(false);
        },
      }}
    />
  );
};

export default ClientContainer;
