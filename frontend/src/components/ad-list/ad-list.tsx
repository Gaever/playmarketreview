"use client";

import { IAdListItem } from "@/types";
import React, { useEffect } from "react";
import AdListItem from "@/components/ad-list-item/ad-list-item";
import styles from "./style.module.css";
import { useInView } from "react-intersection-observer";

export interface AdListProps {
  items: IAdListItem[];
  isLastPage: boolean;
  isShowPlaceholder?: boolean;
  composeHref: (item: IAdListItem) => string;
  onFavoriteClick: (item: IAdListItem) => void;
  onScrolledToBottom: () => void;
}

const AdList: React.FC<AdListProps> = (props) => {
  const [bottomRef, inView] = useInView();

  useEffect(() => {
    if (inView) {
      props.onScrolledToBottom();
    }
    // eslint-disable-next-line
  }, [inView]);

  if ((props.isShowPlaceholder ?? true) && (props.items || []).length < 1) {
    return (
      <div className="d-flex h-100 w-100 flex-column align-items-center justify-content-center">
        <p className="fw-semibold fs-4 text-center">Aucun article trouvé</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>
        {(props.items || []).map((item) => (
          <AdListItem
            key={item.id}
            {...item}
            href={props.composeHref(item)}
            onFavoriteClick={() => {
              props.onFavoriteClick(item);
            }}
          />
        ))}
      </div>
      <div ref={bottomRef} />
      {!props.isLastPage ? (
        <div className={`w-100 d-flex align-items-center justify-content-center py-4`}>
          <div className="spinner-border" role="status"></div>
        </div>
      ) : null}
    </div>
  );
};

export default AdList;
