"use client";

import { IAdListItem } from "@/types";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { Heart, HeartFill } from "react-bootstrap-icons";
import styles from "./style.module.css";
import Image from "next/image";

export interface AdListItemProps extends IAdListItem {
  href: string;
  onFavoriteClick: () => void;
}

const AdListItem: React.FC<AdListItemProps> = (props) => {
  const isFavorited = props.is_favorite;

  return (
    <div key={props.id} className={styles.item}>
      <Link href={props.href}>
        <div className={styles.imageContainer}>
          <Image
            alt=""
            className={styles.image}
            src={props.photos?.[0]?.url || "/logo-gray.png"}
            width={props.photos?.[0]?.width}
            height={props.photos?.[0]?.height}
          />
        </div>
      </Link>
      <div className={styles.details}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{props.title}</div>
          {isFavorited ? (
            <HeartFill
              className={styles.heartIcon}
              color="#F04438"
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
          <span className={styles.bold}>{props.price} CFA</span>
        </div>
        <div className={styles.address}>
          {props.address?.slice?.(0, 25)}
          {props.address?.length > 25 && "..."}
        </div>
        {props.created_at ? (
          <div className={styles.creationDate}>{moment(props.created_at).format("DD.MM.YYYY")}</div>
        ) : null}
      </div>
    </div>
  );
};

export default AdListItem;
