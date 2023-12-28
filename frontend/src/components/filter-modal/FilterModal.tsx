import { Button, Col, Form, Modal, Row } from "@/ssr-compat/react-bootstrap";
import { WareFilters } from "@/types";
import { useForm } from "react-hook-form";
import AddressPicker, { AddressPickerProps } from "../address-picker/address-picker";
import { rnEvents } from "@/lib/rn-events";

type Filters = Pick<WareFilters, "cityId" | "placeId" | "priceFrom" | "priceTo" | "coordinates">;

export interface FilterModalProps {
  filters: Filters;
  isShown: boolean;
  AddressPickerProps: Pick<AddressPickerProps, "cities" | "places">;
  onFilterChange: (filters: Filters) => void;
  onClose: () => void;
}

function FilterModal(props: FilterModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FilterModalProps["filters"]>({
    defaultValues: props.filters,
  });

  const onCancel = () => {
    props.onClose();
  };

  return (
    <Modal
      show={props.isShown}
      onHide={onCancel}
      centered
      contentClassName="shadow-lg"
      backdropClassName="modal-backdrop"
    >
      <Modal.Header closeButton />
      <form
        onSubmit={handleSubmit((values) => {
          props.onFilterChange(values);
          props.onClose();
        })}
      >
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="minPrice">
                <Form.Label>Prix min (CFA)</Form.Label>
                <Form.Control type="number" {...register("priceFrom")} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="maxPrice">
                <Form.Label>Prix max (CFA)</Form.Label>
                <Form.Control type="number" {...register("priceTo")} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <AddressPicker
                cities={props.AddressPickerProps.cities}
                places={props.AddressPickerProps.places}
                pickedCityId={watch("cityId")}
                pickedPlaceId={watch("placeId")}
                pickedCoordinates={watch("coordinates")}
                onClearLocationPress={() => {
                  setValue("coordinates", undefined);
                  setValue("cityId", undefined);
                  setValue("placeId", undefined);
                }}
                onPickedLocationClick={() => {
                  rnEvents.openInMap({ location: watch("coordinates") });
                }}
                onSubmit={(value) => {
                  const address = value?.city || value?.place;
                  const coordinates = value?.location;
                  if (coordinates) {
                    setValue("coordinates", { lat: value?.location?.lat!, lon: value?.location?.lon! });
                    setValue("cityId", undefined);
                    setValue("placeId", undefined);
                    return;
                  } else {
                    setValue("coordinates", undefined);
                  }
                  if (address?.lat !== undefined && address?.lon !== undefined) {
                    setValue("coordinates", { lat: address.lat, lon: address.lon });
                  } else {
                    setValue("coordinates", undefined);
                  }
                  if (value.city?.id !== undefined) {
                    setValue("cityId", `${value?.city?.id}`);
                  } else {
                    setValue("cityId", undefined);
                  }
                  if (value.place?.id !== undefined) {
                    setValue("placeId", `${value?.place?.id}`);
                  } else {
                    setValue("placeId", undefined);
                  }
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            type="reset"
            onClick={() => {
              reset();
              handleSubmit(() => {
                props.onFilterChange({});
                props.onClose();
              })();
            }}
          >
            Réinitialiser
          </Button>
          <Button type="submit">Appliquer</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default FilterModal;
