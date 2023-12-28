"use client";

import { GoogleMap as ReactGoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { XLg } from "react-bootstrap-icons";

export interface GoogleMapProps {
  initialCenter?: google.maps.LatLngLiteral;
  onChange: (value: google.maps.LatLngLiteral | undefined) => void;
  onClose: () => void;
}

function GoogleMap(_props: GoogleMapProps) {
  return null;
}

export function GoogleMapBak(props: GoogleMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const onChange = () => {
    if (!map) return;

    const newPosition = map.getCenter();
    if (!newPosition) {
      return;
    }
    const newCenter = {
      lat: +newPosition.lat()?.toFixed(10),
      lng: +newPosition.lng()?.toFixed(10),
    };
    props.onChange(newCenter);
  };

  useEffect(() => {
    if (map && !isMounted) {
      onChange();
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [isMounted, map]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="position-relative h-100 w-100">
      <div className={`${styles.close} position-absolute`}>
        <XLg size="25px" onClick={props.onClose} />
      </div>
      <div
        className={`${styles.circle} position-absolute`}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div
          className={`${styles.dot} position-absolute`}
          onClick={(e) => {
            e.preventDefault();
          }}
        ></div>
      </div>
      <ReactGoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        options={{
          disableDefaultUI: true,
          fullscreenControl: false,
          gestureHandling: "greedy",
          styles: [
            {
              featureType: "all",
              elementType: "labels.text",
              stylers: [
                {
                  color: "#878787",
                },
              ],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [
                {
                  color: "#f9f5ed",
                },
              ],
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [
                {
                  color: "#f5f5f5",
                },
              ],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#c9c9c9",
                },
              ],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [
                {
                  color: "#aee0f4",
                },
              ],
            },
          ],
        }}
        zoom={17}
        center={props.initialCenter}
        onDragEnd={() => {
          onChange();
        }}
        onLoad={(map) => {
          const bounds = new window.google.maps.LatLngBounds(props.initialCenter);
          map.fitBounds(bounds);
          setMap(map);
        }}
        onUnmount={() => {
          setMap(null);
        }}
      >
        <></>
      </ReactGoogleMap>
    </div>
  );
}

export default GoogleMap;
