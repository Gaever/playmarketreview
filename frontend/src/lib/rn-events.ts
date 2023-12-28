"use client";

import { Coordinates } from "@/types";

export const RN_ENEVT = "rn-event";
export const RN_WEBVIEW_EVENT = "rn-webview-event";

const dispatchEvent = (action: string, data?: any) => {
  document.dispatchEvent(
    new CustomEvent(RN_ENEVT, {
      detail: JSON.stringify({ action, ...data }),
    })
  );
};

const openInMap = (args: { location: Coordinates | undefined }) => {
  if (!args.location) {
    return;
  }
  dispatchEvent("map", { location: args.location, zoom: 15 });
};

const appMounted = () => {
  dispatchEvent("app-mounted");
};

const getLocation = () => {
  dispatchEvent("get-location");
};

const signin = (args: { cookies: any }) => {
  dispatchEvent("signin", { cookies: args.cookies });
};

const logout = () => {
  dispatchEvent("logout");
};

export const rnEvents = {
  openInMap,
  appMounted,
  getLocation,
  signin,
  logout,
};
