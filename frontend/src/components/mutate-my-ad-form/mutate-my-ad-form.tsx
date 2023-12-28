"use client";

import { ReactHookFormDropzoneField } from "@/components/react-hook-form-dropzone/react-hook-form-dropzone";
import { getWaresResData } from "@/types/api";
import React, { useCallback, useEffect, useState } from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";
import AddressPicker, { AddressPickerProps } from "../address-picker/address-picker";
import { statusToLabel } from "@/lib/formatters/wares";
import { Trash } from "react-bootstrap-icons";
import { rnEvents } from "@/lib/rn-events";

export type adForm = Pick<
  getWaresResData[number],
  | "name"
  | "description"
  | "city_id"
  | "place_id"
  | "address"
  | "lat"
  | "lon"
  | "price"
  | "youtube_code"
  | "status"
  | "id"
> & {
  titlePhotoIndex?: number;
  photos?: string[];
  category_ids?: (string | number)[];
  newPhotos?:
    | (File & {
        preview: string;
      })[]
    | undefined;
};

export interface MutateMyAdFormProps {
  form: adForm | undefined;
  categories?: getWaresResData[number]["categories"];
  AddressPickerProps: Pick<AddressPickerProps, "cities" | "places">;
  onSubmit: (values: adForm, doNotRedirect?: boolean) => Promise<any>;
  onDeleteClick: () => Promise<void>;
}

export interface AddressPickerFormItemProps {
  form: UseFormReturn<adForm>;
  isDisabled?: boolean;
  AddressPickerProps: Pick<AddressPickerProps, "cities" | "places">;
}

function AddressPickerFormItem(props: AddressPickerFormItemProps) {
  const geo = {
    id: props.form.watch("city_id")! || props.form.watch("place_id")!,
    lat: props.form.watch("lat")!,
    lon: props.form.watch("lon")!,
    name: props.form.watch("address")!,
  };

  const coordinates = geo.lat && geo.lon ? { lat: geo.lat, lon: geo.lon } : undefined;

  return (
    <AddressPicker
      onClearLocationPress={() => {
        props.form.setValue("lat", undefined);
        props.form.setValue("lon", undefined);
        props.form.setValue("city_id", undefined);
        props.form.setValue("place_id", undefined);
      }}
      pickedCoordinates={coordinates}
      onPickedLocationClick={() => {
        rnEvents.openInMap({ location: { lat: props.form.getValues("lat")!, lon: props.form.getValues("lon")! } });
      }}
      isDisabled={props.isDisabled}
      pickedCityId={props.form.getValues("city_id")}
      pickedPlaceId={props.form.getValues("place_id")}
      cities={props.AddressPickerProps.cities}
      places={props.AddressPickerProps.places}
      onSubmit={(value) => {
        const address = value?.city || value?.place;
        const coordinates = value?.location;
        if (coordinates) {
          props.form.setValue("lat", +coordinates.lat!);
          props.form.setValue("lon", +coordinates.lon!);
          props.form.setValue("city_id", undefined);
          props.form.setValue("place_id", undefined);
          return;
        }

        props.form.setValue("lat", address?.lat);
        props.form.setValue("lon", address?.lon);

        if (value.city !== undefined) {
          props.form.setValue("city_id", value?.city?.id);
        } else {
          props.form.setValue("city_id", undefined);
        }

        if (value.place !== undefined) {
          props.form.setValue("place_id", value?.place?.id);
        } else {
          props.form.setValue("place_id", undefined);
        }

        props.form.setValue("address", address?.name);
      }}
    />
  );
}

const MutateMyAdForm: React.FC<MutateMyAdFormProps> = (props) => {
  const form = useForm<adForm>({
    defaultValues: props.form,
    mode: "onTouched",
    reValidateMode: "onSubmit",
  });

  const [isShowConfirmIsSold, setIsShowConfirmIsSold] = useState(false);
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  const isEmptyForm = props.form === undefined;

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = form;

  const onSubmit = useCallback(
    async (status: adForm["status"], doNotRedirect?: boolean) => {
      await handleSubmit((values) => props.onSubmit({ ...values, status }, doNotRedirect))();
    },
    // eslint-disable-next-line
    [props.form]
  );

  useEffect(() => {
    form.setValue("status", props.form?.status);
  }, [props.form?.status, form]);

  const status = form.watch("status");
  const titlePhotoIndex = form.watch("titlePhotoIndex") || 0;

  return (
    <FormProvider {...form}>
      {(props.categories?.length ?? 0) > 0 ? (
        <div className="mb-2">Catégorie: {props.categories?.map((item) => item.name).join(", ")}</div>
      ) : null}
      <Form>
        <Form.Group className="mb-3" controlId="ad-title">
          <Form.Label>Titre</Form.Label>
          <Form.Control disabled={isSubmitting} placeholder="Titre" {...register("name", { required: true })} />
          {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="ad-description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            disabled={isSubmitting}
            placeholder="Description"
            {...register("description")}
          />
          {errors.address && <Form.Text className="text-danger">{errors.address.message}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="ad-price">
          <Form.Label>Prix (CFA)</Form.Label>
          <Form.Control disabled={isSubmitting} placeholder="Prix" {...register("price")} />
          {errors.price && <Form.Text className="text-danger">{errors.price.message}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="ad-price">
          <AddressPickerFormItem isDisabled={isSubmitting} AddressPickerProps={props.AddressPickerProps} form={form} />
        </Form.Group>

        <Form.Group controlId="ad-photos">
          <Form.Label>Photos</Form.Label>
          <ReactHookFormDropzoneField
            onTitlePhotoChange={(index) => {
              form.setValue("titlePhotoIndex", index);
            }}
            titlePhotoIndex={titlePhotoIndex}
            existPhotos={props.form?.photos || []}
            onRemoveExistPhoto={(existItem) => {
              form.setValue("photos", (form.getValues("photos") || [])?.filter((item) => item !== existItem));
            }}
            disabled={isSubmitting}
            name="newPhotos"
          />
        </Form.Group>

        {status ? (
          <div className="mb-3 mt-4">
            Statut: <Badge>{statusToLabel[status]}</Badge>
          </div>
        ) : null}

        {!status || status === "draft" ? (
          <Button
            onClick={() => {
              onSubmit("draft", true);
            }}
            disabled={isSubmitting}
            variant="outline-primary"
            className="w-100 mb-2 fw-semibold"
          >
            Sauvegarder le brouillon
          </Button>
        ) : null}

        {status && ["on", "off"].includes(status) ? (
          <Button
            onClick={() => {
              onSubmit(status, true);
            }}
            disabled={isSubmitting}
            variant={status === "on" ? "primary" : "outline-primary"}
            className={`w-100 mb-2 ${status === "on" ? "fw-semibold" : ""}`}
          >
            Statut{status === "on" ? " and publish" : ""}
            {status === "off" ? " changes" : ""}
          </Button>
        ) : null}

        {status && ["draft", "off"].includes(status) ? (
          <Button
            disabled={isSubmitting}
            variant="primary"
            onClick={() => {
              onSubmit("on", true);
            }}
            className={`w-100 mb-2 ${status === "off" ? "fw-semibold" : ""}`}
          >
            Publier
          </Button>
        ) : null}

        {status === "on" ? (
          <Button
            disabled={isSubmitting}
            variant="outline-primary"
            onClick={() => {
              onSubmit("off", true);
            }}
            className="w-100 mb-2"
          >
            Retirer de la publication
          </Button>
        ) : null}

        {!isEmptyForm && status && !["sold", "draft"].includes(status) ? (
          <Button
            onClick={() => {
              setIsShowConfirmIsSold(true);
            }}
            disabled={isSubmitting}
            variant="outline-primary"
            className="w-100 mb-2"
          >
            Article vendu
          </Button>
        ) : null}

        {!isEmptyForm ? (
          <Button
            onClick={() => {
              setIsShowConfirmDelete(true);
            }}
            disabled={isSubmitting}
            variant="outline-dark"
            className="w-100 mb-2 align-items-center justify-content-center d-flex gap-1"
          >
            <Trash /> Supprimer
          </Button>
        ) : null}
      </Form>

      <Modal
        show={isShowConfirmIsSold}
        onHide={() => {
          setIsShowConfirmIsSold(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Marquer comme vendu ?</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button
            onClick={() => {
              setIsShowConfirmIsSold(false);
            }}
            variant="outline-primary"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              onSubmit("sold");
              setIsShowConfirmIsSold(false);
            }}
            variant="primary"
          >
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isShowConfirmDelete}
        onHide={() => {
          setIsShowConfirmDelete(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Supprimer l&lsquo;article ?</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button
            onClick={() => {
              setIsShowConfirmDelete(false);
            }}
            variant="outline-primary"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              props.onDeleteClick();
              setIsShowConfirmDelete(false);
            }}
            variant="primary"
          >
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </FormProvider>
  );
};

export default MutateMyAdForm;
