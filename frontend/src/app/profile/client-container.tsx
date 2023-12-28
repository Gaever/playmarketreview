"use client";

import { useSignOut } from "@/lib/services/auth/use-auth";
import React from "react";
import MyProfile, { MyProfileProps } from "./my-profile";
import { useProfile } from "@/lib/services/profile/use-profile";

export interface ClientContainerProps extends Pick<MyProfileProps, "routes"> {}

const ClientContainer: React.FC<ClientContainerProps> = (props) => {
  const { profileQuery } = useProfile();
  const { logoutHref, onSignOutPress } = useSignOut({ redirectTo: "/profile" });

  return (
    <MyProfile
      profile={profileQuery.data}
      routes={props.routes}
      logoutHref={logoutHref}
      onLogoutClick={onSignOutPress}
    />
  );
};

export default ClientContainer;
