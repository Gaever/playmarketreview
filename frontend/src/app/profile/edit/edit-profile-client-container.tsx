"use client";

import { useProfile } from "@/lib/services/profile/use-profile";
import React from "react";
import EditProfile from "./edit-profile";
import errorHandler from "@/lib/error-handler";

const EditProfileClientContainer: React.FC = () => {
  const { profileQuery, updatePasswordMutation, updateProfileMutation } = useProfile();
  return (
    <EditProfile
      profile={{
        name: profileQuery.data?.userName,
        avatar: profileQuery.data?.avatarSrc,
        email: profileQuery.data?.email || "",
        phoneNumber: profileQuery.data?.phone || "",
        isPhonePublic: !!profileQuery.data?.isPhonePublic,
        isEmailPublic: !!profileQuery.data?.isEmailPublic,
      }}
      onUpdatePaswordSubmit={async (values) => {
        try {
          await updatePasswordMutation.mutateAsync(values);
        } catch (error) {
          errorHandler(error);
        }
      }}
      onSubmit={async (values) => {
        try {
          await updateProfileMutation.mutateAsync(values);
        } catch (error) {
          errorHandler(error);
        }
      }}
    />
  );
};

export default EditProfileClientContainer;
