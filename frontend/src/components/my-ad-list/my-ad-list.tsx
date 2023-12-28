import { IMyAdListItem } from "@/types";
import React from "react";
import MyAdListItem from "../my-ad-list-item/my-ad-list-item";
import styles from "./style.module.css";

export interface MyAdListProps {
  items: IMyAdListItem[];
  composeHref: (item: IMyAdListItem) => string;
}

const MyAdList: React.FC<MyAdListProps> = (props) => {
  return (
    <div className={styles.container}>
      {(props.items || []).map((item) => (
        <MyAdListItem key={item.id} {...item} href={props.composeHref(item)} showStatus />
      ))}
    </div>
  );
};

export default MyAdList;
