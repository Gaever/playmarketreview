"use client";

import Avatar from "@/components/avatar/Avatar";
import React, { useState } from "react";
import { Button, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Camera } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";

export interface EditProfileFormData {
  name: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  avatar: File | null;
  isShallClearAvatar?: boolean;
  isPhonePublic?: boolean;
  isEmailPublic?: boolean;
}

export interface UpdatePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EditProfileProps {
  profile: Omit<EditProfileFormData, "avatar"> & {
    avatar: string | undefined;
  };
  onSubmit: (data: EditProfileFormData) => Promise<void>;
  onUpdatePaswordSubmit: (data: UpdatePasswordFormData) => Promise<void>;
}

const EditProfile: React.FC<EditProfileProps> = (props) => {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const updateProfileForm = useForm<EditProfileFormData>({
    defaultValues: { ...props.profile, avatar: null, isShallClearAvatar: false },
  });
  const updatePasswordForm = useForm<UpdatePasswordFormData>();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      updateProfileForm.setValue("isShallClearAvatar", false);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      updateProfileForm.setValue("avatar", file);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(undefined);
    }
  };

  const isSubmitting = updateProfileForm.formState.isSubmitting || updatePasswordForm.formState.isSubmitting;

  return (
    <div className="p-2">
      <div className="fs-4 fw-semibold mb-3">Mettre à jour les données personnelles</div>
      <form onSubmit={updateProfileForm.handleSubmit(props.onSubmit)}>
        <ul className="list-group mb-3">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <label htmlFor="avatar-input" className="d-flex align-items-center justify-content-center w-100 my-2">
              <div className="d-flex flex-column align-items-center justify-content-center w-100">
                {!updateProfileForm.watch("isShallClearAvatar") && (avatarPreview || props.profile?.avatar) ? (
                  <>
                    <Avatar round src={avatarPreview || props.profile.avatar} />
                    <Button
                      onClick={() => {
                        updateProfileForm.setValue("avatar", null);
                        updateProfileForm.setValue("isShallClearAvatar", true);
                      }}
                      variant="outline-primary"
                      className="w-100 my-2"
                    >
                      Supprimer l&lsquo;avatar
                    </Button>
                  </>
                ) : (
                  <Camera size={24} />
                )}
              </div>
              <input
                disabled={isSubmitting}
                type="file"
                id="avatar-input"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </label>
          </li>
          <li className="list-group-item">
            <FormGroup controlId="email-input">
              <FormLabel>Nom</FormLabel>
              <FormControl
                disabled={isSubmitting}
                required
                type="text"
                placeholder="Entrez le nom"
                {...updateProfileForm.register("name")}
              />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <FormGroup controlId="email-input" className="mb-2">
              <FormLabel>E-mail</FormLabel>
              <FormControl
                disabled={isSubmitting}
                type="email"
                required
                placeholder="Saisissez l'email"
                {...updateProfileForm.register("email")}
              />
            </FormGroup>
            <FormGroup controlId="is-email-public-input">
              <Form.Check
                label="Montrer l'e-mail au public"
                disabled={isSubmitting}
                {...updateProfileForm.register("isEmailPublic")}
              />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <FormGroup controlId="phone-input" className="mb-2">
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl
                disabled={isSubmitting}
                type="tel"
                placeholder="Entrez le numéro de téléphone"
                {...updateProfileForm.register("phoneNumber")}
              />
            </FormGroup>
            <FormGroup controlId="is-phone-public-input">
              <Form.Check
                label="Montrer le numéro de téléphone au public"
                disabled={isSubmitting}
                {...updateProfileForm.register("isPhonePublic")}
              />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <Button type="submit" className="w-100 my-2">
              Sauvegarder
            </Button>
          </li>
        </ul>
      </form>
      <div className="fs-4 fw-semibold mb-3">Mettre à jour le mot de passe</div>
      <form onSubmit={updatePasswordForm.handleSubmit(props.onUpdatePaswordSubmit)}>
        <ul className="list-group mb-3">
          <li className="list-group-item">
            <FormGroup controlId="oldPassword">
              <FormLabel>Ancien mot de passe</FormLabel>
              <FormControl
                required
                disabled={isSubmitting}
                type="password"
                {...updatePasswordForm.register("oldPassword")}
              />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <FormGroup controlId="newPassword">
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl
                required
                disabled={isSubmitting}
                type="password"
                {...updatePasswordForm.register("newPassword")}
              />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <FormGroup controlId="confirmPassword">
              <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
              <FormControl
                disabled={isSubmitting}
                required
                type="password"
                {...updatePasswordForm.register("confirmPassword")}
              />
            </FormGroup>
          </li>
          <li className="list-group-item">
            <Button type="submit" className="w-100 my-2">
              Mettre à jour le mot de passe
            </Button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default EditProfile;
