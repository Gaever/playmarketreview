"use client";

import React from "react";
import { Heart, HeartFill } from "react-bootstrap-icons";
import styles from "./style.module.css";
import Link from "next/link";
import { IAdListItem } from "@/types";
import moment from "moment";
import { useFavoritesIds } from "@/lib/services/favorites/favorites-provider";
import Image from "next/image";
import colors from "@/lib/theme/colors.module.scss";

export interface AdListItemProps extends IAdListItem {
  href: string;
  onFavoriteClick: () => void;
}

const AdListItem: React.FC<AdListItemProps> = (props) => {
  const { favoritedIds } = useFavoritesIds();
  const isFavorited = favoritedIds.has(`${props.id}`);

  return (
    <div key={props.id} className={styles.item}>
      <Link href={props.href}>
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={props.photos?.[0].url || ""}
            alt="Item"
            width={props.photos?.[0].width}
            height={props.photos?.[0].height}
          />
        </div>
      </Link>
      <div className={styles.details}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{props.title}</div>
          {isFavorited ? (
            <HeartFill
              className={styles.heartIcon}
              color={colors.like}
              onClick={() => {
                props.onFavoriteClick();
              }}
            />
          ) : (
            <Heart
              className={styles.heartIcon}
              onClick={() => {
                props.onFavoriteClick();
              }}
            />
          )}
        </div>
        <div className={styles.price}>
          $<span className={styles.bold}>{props.price}</span>
        </div>
        <div className={styles.address}>
          {props.address?.slice?.(0, 25)}
          {props.address?.length > 25 && "..."}
        </div>
        <div className={styles.creationDate}>{moment(props.created_at).format("DD.MM.YYYY")}</div>
      </div>
    </div>
  );
};

export default AdListItem;
