"use client";

import Header from "@/components/header/header";
import { useAuth } from "@/lib/services/auth/use-auth";
import { useProfile } from "@/lib/services/profile/use-profile";
import React from "react";
import Profile from "@/app/profile/profile";

export interface ProfileClientContainerProps {
  userId: string;
}

const ProfileClientContainer: React.FC<ProfileClientContainerProps> = (props) => {
  const { profileQuery, voteMutation } = useProfile({ userId: props.userId });
  const { withRedirectOnUnauthorized } = useAuth();

  return (
    <div className="container pt-5 h-100">
      <Header />
      <Profile
        profile={{
          avatarSrc: profileQuery.data?.avatarSrc || "",
          email: profileQuery.data?.email,
          phone: profileQuery.data?.phone,
          tarderRateUp: profileQuery.data?.traderRateUp || 0,
          tarderRateDown: profileQuery.data?.traderRateDown || 0,
          userId: profileQuery.data?.userId || "",
          userName: profileQuery.data?.userName || "",
        }}
        onVoteUpClick={() => {
          withRedirectOnUnauthorized(() => {
            voteMutation.mutate({ vote: "up" });
          });
        }}
        onVoteDownClick={() => {
          withRedirectOnUnauthorized(() => {
            voteMutation.mutate({ vote: "down" });
          });
        }}
      />
    </div>
  );
};

export default ProfileClientContainer;
