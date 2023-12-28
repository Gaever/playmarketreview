"use client";

import React from "react";
import EditProfile, { EditProfileProps } from "./edit-profile";

const EditProfileSsr: React.FC<Pick<EditProfileProps, "initialData">> = (props) => {
  return <EditProfile {...props} onSubmit={() => {}} />;
};

export default EditProfileSsr;
