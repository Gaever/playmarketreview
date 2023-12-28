"use client";

import React, { useState } from "react";
import { Button, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Camera } from "react-bootstrap-icons";
import Avatar from "@/components/avatar/Avatar";

export interface EditProfileFormData {
  email: string;
  phoneNumber: string;
  avatar: File | null;
}

export interface EditProfileProps {
  initialData: Omit<EditProfileFormData, "avatar"> & {
    avatar: string | undefined;
  };
  onSubmit: (data: EditProfileFormData) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ initialData, onSubmit }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const { register, handleSubmit } = useForm<EditProfileFormData>({
    defaultValues: { ...initialData, avatar: null },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(undefined);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <label htmlFor="avatar-input" className="d-flex align-items-center justify-content-center w-100 my-2">
              <div>
                {avatarPreview || initialData.avatar ? (
                  <Avatar round src={avatarPreview || initialData.avatar} />
                ) : (
                  <Camera size={24} />
                )}
              </div>
              <input type="file" id="avatar-input" style={{ display: "none" }} onChange={handleAvatarChange} />
            </label>
          </li>
          <li className="list-group-item">
            <FormGroup controlId="email-input">
              <FormLabel>Email</FormLabel>
              <FormControl type="email" placeholder="Enter email" {...register("email")} />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <FormGroup controlId="phone-input">
              <FormLabel>Phone Number</FormLabel>
              <FormControl type="tel" placeholder="Enter phone number" {...register("phoneNumber")} />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <Button variant="primary" type="submit" className="w-100">
              City
            </Button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default EditProfile;
