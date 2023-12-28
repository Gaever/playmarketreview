import AdList, { AdListProps } from "@/components/ad-list/ad-list";

export interface FavoritesProps {
  AdListProps: AdListProps;
}

const Favorites: React.FC<FavoritesProps> = (props) => {
  return (
    <div className="container pb-5 h-100 overflow-scroll">
      {props.AdListProps.items.length < 1 ? (
        <p className="h-100 w-100 d-flex align-items-center justify-content-center fw-semibold fs-4">
          Here will be favorited items
        </p>
      ) : null}
      <AdList {...props.AdListProps} />
    </div>
  );
};

export default Favorites;
