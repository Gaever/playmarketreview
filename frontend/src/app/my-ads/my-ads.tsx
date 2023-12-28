"use client";

import Header from "@/components/header/header";
import MyAdList, { MyAdListProps } from "@/components/my-ad-list/my-ad-list";
import Link from "next/link";
import React from "react";
import style from "./page.module.css";
import { PlusCircle } from "react-bootstrap-icons";

export interface MyAdsProps {
  MyAdListProps: MyAdListProps;
  createAdHref: string;
}

const MyAds: React.FC<MyAdsProps> = (props) => {
  return (
    <div className="container h-100 d-flex flex-column pt-3">
      <Header
        rightButtons={
          <>
            {(props.MyAdListProps.items || []).length > 0 ? (
              <Link href={props.createAdHref}>
                <button className="btn btn-primary btn-sm pt-0 pb-0 fw-semibold d-flex align-items-center justify-content-center gap-1">
                  <PlusCircle />
                  Créer
                </button>
              </Link>
            ) : null}
          </>
        }
        showBack={false}
      />

      <div className={style["list-container"]}>
        <MyAdList {...props.MyAdListProps} />
      </div>
      {(props.MyAdListProps.items || []).length < 1 ? (
        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center fw-semibold fs-4">
          Créons une nouvelle annonce !
          <Link href={props.createAdHref}>
            <button className="btn btn-primary fw-semibold mt-2">Créer une nouvelle annonce</button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default MyAds;
