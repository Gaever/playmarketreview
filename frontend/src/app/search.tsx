import AdList, { AdListProps } from "@/components/ad-list/ad-list";
import FilterModal, { FilterModalProps } from "@/components/filter-modal/FilterModal";
import CategoriesMenu, { CategoriesMenuProps } from "@/components/menu/CategoriesMenu";
import SearchHeader, { SearchHeaderProps } from "@/components/search-header/search-header";

export interface SearchProps {
  AdListProps: AdListProps;
  SearchHeaderProps: SearchHeaderProps;
  CategoriesMenuProps: CategoriesMenuProps;
  FilterModalProps: FilterModalProps;
}

const Search: React.FC<SearchProps> = (props) => {
  return (
    <div className="h-100 pt-5 pb-5">
      <div className="container">
        <SearchHeader {...props.SearchHeaderProps} />
      </div>

      <div className="mt-2">
        <CategoriesMenu {...props.CategoriesMenuProps} />
      </div>

      <div className="container h-100">
        <AdList {...props.AdListProps} />
        <div className="pb-5 mb-5"></div>
      </div>

      <FilterModal {...props.FilterModalProps} />
    </div>
  );
};

export default Search;
