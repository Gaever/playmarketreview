"use client";

import Avatar from "@/components/avatar/Avatar";
import VoteIndicator from "@/components/vote-indicator/VoteIndicator";
import Link from "next/link";
import React from "react";
import style from "./page.module.css";

export interface MyProfileProps {
  profile:
    | {
        avatarSrc: string | undefined;
        userName: string | undefined;
        userId: string | undefined;
        customerRate: number | undefined;
        traderRate: number | undefined;
        customerRateUp: number | undefined;
        traderRateUp: number | undefined;
        customerRateDown: number | undefined;
        traderRateDown: number | undefined;
        email: string | undefined;
        phone: string | undefined;
        isPhonePublic?: boolean | undefined;
        isEmailPublic?: boolean | undefined;
      }
    | null
    | undefined;
  logoutHref: string;
  routes: {
    edit: string;
    notificationsSettings: string;
    transactions: string;
  };
  onLogoutClick: () => void;
}

const MyProfile: React.FC<MyProfileProps> = (props) => {
  return (
    <div className="p-2">
      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-semibold">{props.profile?.userName}</h3>
            <div>
              <div>id{props.profile?.userId}</div>
              {props.profile?.email ? <div>E-mail: {props.profile?.email}</div> : null}
              {props.profile?.phone ? <div>Téléphone: {props.profile?.phone}</div> : null}
            </div>
            <div className="d-flex align-items-center">
              {/* Rate:&nbsp;<span className="fw-semibold">{props.profile?.traderRate}</span> */}
              <div className={`${style.rate} mt-2`}>
                {/* <StarRatings
                  rating={props.profile?.traderRate}
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="5px"
                /> */}
                <VoteIndicator
                  downVotes={props.profile?.traderRateDown || 0}
                  upVotes={props.profile?.traderRateUp || 0}
                />
              </div>
            </div>
          </div>
          <div>
            <Avatar name={props.profile?.userName} className="" round src={props.profile?.avatarSrc} />
          </div>
        </li>
        <li className="list-group-item">
          <Link href={props.routes.edit}>
            <button className="btn btn-primary w-100">Modifier le profil</button>
          </Link>
        </li>
        {/* <li className="list-group-item">
          <Link href={props.routes.transactions}>
            <button className="btn btn-primary w-100">Transactions</button>
          </Link>
        </li> */}
        <li className="list-group-item">
          <a className="btn btn-outline-primary w-100" onClick={props.onLogoutClick} href={props.logoutHref}>
            Se déconnecter
          </a>
        </li>
      </ul>
      <div className={`text-center mt-2 ${style["conditions"]}`}>
        Contactez-nous par email:
        <br /> mail@monbusiness.com
      </div>
    </div>
  );
};

export default MyProfile;
