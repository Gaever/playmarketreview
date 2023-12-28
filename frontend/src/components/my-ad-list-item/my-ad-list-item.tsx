"use client";

import { IMyAdListItem } from "@/types";
// import { observer } from "mobx-react-lite";
import moment from "moment";
import Link from "next/link";
import React from "react";
import styles from "./style.module.css";
import { Badge } from "react-bootstrap";
import { statusToLabel } from "@/lib/formatters/wares";
import Image from "next/image";

export interface MyAdListItemProps extends IMyAdListItem {
  href: string;
  showStatus?: boolean;
}

const MyAdListItem: React.FC<MyAdListItemProps> = (props) => {
  return (
    <div key={props.id} className={`${styles.item}`}>
      <Link href={props.href}>
        <div className={`${styles.imageContainer} position-relative`}>
          {props.showStatus && props.status ? (
            <Badge
              className={`position-absolute m-1 ${styles.badge} ${props.status === "on" ? "bg-primary" : "bg-dark"}`}
            >
              {statusToLabel[props.status]}
            </Badge>
          ) : null}
          <Image
            alt={props.title}
            className={styles.image}
            src={props.photos?.[0].url || ""}
            width={props.photos?.[0].width}
            height={props.photos?.[0].height}
          />
        </div>
      </Link>
      <div className={styles.details}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{props.title}</div>
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

export default MyAdListItem;
