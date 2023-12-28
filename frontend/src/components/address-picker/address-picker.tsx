"use client";

import errorHandler from "@/lib/error-handler";
import { RN_WEBVIEW_EVENT, rnEvents } from "@/lib/rn-events";
import { InputGroupText } from "@/ssr-compat/react-bootstrap";
import { Coordinates } from "@/types";
import { getCitiesResData, getPlacesResData } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, FormControl, InputGroup, ListGroup, Modal, Spinner } from "react-bootstrap";
import { Geo, GlobeEuropeAfrica as MapIcon, Search as SearchIcon, XLg } from "react-bootstrap-icons";
import GoogleMap from "../google-map/GoogleMap";
import styles from "./style.module.scss";

export interface AddressPickerProps {
  cities: getCitiesResData;
  places: getPlacesResData;
  isDisabled?: boolean;
  pickedAddress?: string | undefined;
  pickedCoordinates?: Coordinates;
  pickedCityId?: number | string;
  pickedPlaceId?: number | string;
  onClearLocationPress: () => void;
  onPickedLocationClick: () => void;
  onSubmit: (args: {
    location?: Coordinates;
    city?: getCitiesResData[number];
    place?: getPlacesResData[number];
  }) => void;
}

async function requestRnLocation() {
  return new Promise<Coordinates>((resolve, reject) => {
    const timeoutHandler = setTimeout(() => {
      clearTimeout(timeoutHandler);
      reject("Took to much time to get position");
    }, 30000);

    const unsubscribe = () => {
      document.removeEventListener(RN_WEBVIEW_EVENT, listener);
      clearTimeout(timeoutHandler);
    };

    const listener = (event: Event) => {
      try {
        const payload: { action: string; data?: any; error?: string } | null =
          // @ts-expect-error
          event?.detail || null;

        if (payload?.action !== "get-location") {
          return;
        }

        if (payload?.error) {
          unsubscribe();
          reject(payload.error);
          return;
        }

        if (!payload?.data?.latitude || !payload?.data?.longitude) {
          unsubscribe();
          reject("Failed to get position");
          return;
        }

        unsubscribe();
        resolve({ lat: payload?.data?.latitude, lon: payload?.data?.longitude });
      } catch (error) {
        unsubscribe();
        reject(error);
      }
    };

    document.addEventListener(RN_WEBVIEW_EVENT, listener);
    rnEvents.getLocation();
  });
}

export interface OpenInMapsButtonProps {
  onClick: () => void;
}

export function OpenInMapsButton(props: OpenInMapsButtonProps) {
  return (
    <Button
      variant="outline-dark"
      onClick={props.onClick}
      className="w-100 d-flex align-items-center justify-content-center gap-1"
    >
      <MapIcon />
      Ouvrir dans l&lsquo;app de cartes
    </Button>
  );
}

const AddressPicker: React.FC<AddressPickerProps> = (props) => {
  const [isShown, setIsShown] = useState(false);
  const [isMapShown, setIsMapShown] = useState(false);
  const [initialCenter, setInitialCenter] = useState<google.maps.LatLngLiteral | undefined>();
  const [location, setLocation] = useState<google.maps.LatLngLiteral | undefined>();

  const onNearMePressMutation = useMutation({
    mutationKey: ["location"],
    mutationFn: requestRnLocation,
    onError: errorHandler,
  });

  const pickedAddress =
    props.pickedAddress ||
    (props.pickedCityId !== undefined && props.cities.find((item) => `${item.id}` === `${props.pickedCityId}`)?.name) ||
    (props.pickedPlaceId !== undefined && props.places.find((item) => `${item.id}` === `${props.pickedPlaceId}`)?.name);

  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const closeModal = () => {
    setIsShown(false);
    setIsMapShown(false);
  };

  const filter = (item: (typeof props.cities)[number] | (typeof props.places)[number]) =>
    item?.name?.toLowerCase?.()?.includes?.(searchTerm.toLowerCase());

  return (
    <>
      <Modal show={isShown} onHide={closeModal} fullscreen>
        <Modal.Header closeButton>
          <InputGroup className="flex-1 bg-light rounded-2 me-1">
            <InputGroupText className="border-0 bg-transparent">
              <SearchIcon />
            </InputGroupText>
            <FormControl
              className="me-2 border-0 bg-transparent"
              type="text"
              placeholder="Rechercher..."
              enterKeyHint="search"
              value={searchTerm}
              onChange={handleInputChange}
            />
            {searchTerm ? (
              <InputGroupText className="border-0 bg-transparent">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                  }}
                  size="sm"
                  className="p-0 px-2"
                >
                  Effacer
                </Button>
              </InputGroupText>
            ) : null}
          </InputGroup>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            {!searchTerm ? (
              <ListGroup>
                {/* <ListGroup.Item
                  onClick={() => {
                    props.onSubmit({});
                    closeModal();
                  }}
                  className="fst-italic"
                >
                  None
                </ListGroup.Item> */}
                <ListGroup.Item
                  onClick={async () => {
                    try {
                      const location = await onNearMePressMutation.mutateAsync();
                      setInitialCenter({ lat: +location.lat, lng: +location.lon });
                      props.onSubmit({ location: { lat: +location.lat, lon: +location.lon } });
                      closeModal();
                      // setIsMapShown(true);
                    } catch (error) {
                      console.log(`[address-picker] error: ${JSON.stringify(error, null, 2)}`);
                      // setIsMapShown(true);
                    }
                  }}
                  className="fw-semibold d-flex justify-content-between align-items-center"
                >
                  <div>
                    Près de moi
                    <Geo />
                  </div>
                  {onNearMePressMutation.isLoading ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                  ) : null}
                </ListGroup.Item>
              </ListGroup>
            ) : null}
            <ListGroup>
              {props.cities.filter(filter).map((city) => (
                <ListGroup.Item
                  key={`city-${city?.id}`}
                  onClick={() => {
                    props.onSubmit({ city });
                    closeModal();
                  }}
                >
                  {city?.name}
                </ListGroup.Item>
              ))}
              {props.places.filter(filter).map((place) => (
                <ListGroup.Item
                  key={`place-${place?.id}`}
                  onClick={() => {
                    props.onSubmit({ place });
                    closeModal();
                  }}
                >
                  {place?.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={isMapShown} onHide={closeModal} fullscreen className={styles.gmap}>
        <GoogleMap
          onChange={(loc) => {
            setLocation(loc);
          }}
          onClose={() => {
            setIsMapShown(false);
          }}
          initialCenter={initialCenter}
        />
        <Button
          className="m-3"
          onClick={() => {
            if (location?.lat && location?.lng) {
              props.onSubmit({ location: { lat: location?.lat, lon: location?.lng } });
            } else {
              props.onSubmit({});
            }
            closeModal();
          }}
        >
          Choisir l&lsquo;emplacement
        </Button>
      </Modal>
      <div className="d-flex align-items-center gap-2 flex-column">
        <div className="d-flex align-items-center gap-2 flex-row w-100">
          <Button
            disabled={props.isDisabled}
            variant="outline-dark"
            className="w-100"
            onClick={() => {
              setIsShown(true);
            }}
          >
            <div className="d-flex justify-content-center align-items-center">
              <span>Emplacement</span>
              {!pickedAddress && props.pickedCoordinates ? (
                <>
                  :
                  <div className="d-flex flex-column align-items-start ms-2">
                    <div className={styles["button-coordinates"]}>{props.pickedCoordinates.lat}</div>
                    <div className={styles["button-coordinates"]}>{props.pickedCoordinates.lon}</div>
                  </div>
                </>
              ) : null}
              {pickedAddress ? <div>: {pickedAddress}</div> : null}
            </div>
          </Button>
          <Button variant="outline-dark" onClick={props.onClearLocationPress}>
            <XLg />
          </Button>
        </div>
        <div className="d-flex align-items-end gap-2 flex-row w-100">
          {pickedAddress || props.pickedCoordinates ? (
            <div className="d-flex align-items-center justify-content-center w-100 flex-column">
              <OpenInMapsButton onClick={props.onPickedLocationClick} />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AddressPicker;
