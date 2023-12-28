"use client";

import Avatar from "@/components/avatar/Avatar";
import VoteIndicator from "@/components/vote-indicator/VoteIndicator";
import React from "react";
import { Button } from "react-bootstrap";
import { HandThumbsDownFill, HandThumbsUpFill } from "react-bootstrap-icons";
import style from "./page.module.css";

export interface ProfileProps {
  profile:
    | {
        avatarSrc: string;
        userName: string;
        userId: string;
        tarderRateUp: number;
        tarderRateDown: number;
        email: string | undefined;
        phone: string | undefined;
      }
    | undefined;

  onVoteUpClick: () => void;
  onVoteDownClick: () => void;
}

const Profile: React.FC<ProfileProps> = (props) => {
  return (
    <div>
      <ul className="list-group mb-2">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-semibold">{props.profile?.userName}</h3>
            <div>
              <div>id{props.profile?.userId}</div>
              {props.profile?.email?.trim() ? <div>E-mail: {props.profile?.email}</div> : null}
              {props.profile?.phone ? <div>Téléphone: {props.profile?.phone}</div> : null}
            </div>
            {/* Rate:&nbsp;<span className="fw-semibold">{props.profile?.tarderRateUp}</span> */}
            <div className="d-flex align-items-center">
              <div className={`${style.rate} mt-2`}>
                <VoteIndicator
                  downVotes={props.profile?.tarderRateDown || 0}
                  upVotes={props.profile?.tarderRateUp || 0}
                />
                {/* <StarRatings
                  rating={props.profile?.tarderRate}
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="5px"
                /> */}
              </div>
            </div>
          </div>
          <div>
            <Avatar name={props.profile?.userName} round src={props.profile?.avatarSrc} />
          </div>
        </li>
      </ul>
      <div className="d-flex gap-2">
        <Button
          className="d-flex flex-row align-items-center justify-content-center gap-1"
          size="sm"
          variant="outline-primary w-100"
          onClick={props.onVoteUpClick}
        >
          <HandThumbsUpFill />
          Voter pour
        </Button>
        <Button
          className="d-flex flex-row align-items-center justify-content-center gap-1"
          size="sm"
          variant="outline-primary w-100"
          onClick={props.onVoteDownClick}
        >
          <HandThumbsDownFill />
          Voter contre
        </Button>
      </div>
    </div>
  );
};

export default Profile;
