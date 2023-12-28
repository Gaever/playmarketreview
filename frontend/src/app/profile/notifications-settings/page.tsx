import React from "react";
import EditProfile from "./edit-profile-ssr";

export interface PageProps {}

const Page = (props: PageProps) => {
  return (
    <EditProfile
      initialData={{
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0nFgdZmo0H3IlFQNmfim7HWVkhEk0HAgVGYV64_E&s",
        email: "",
        phoneNumber: "",
      }}
    />
  );
};

export default Page;
