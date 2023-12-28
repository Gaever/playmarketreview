import type { NextRequest } from "next/server";
import { Dispatch, SetStateAction } from "react";
import { Logger } from "winston";
import { getCitiesResData, getWaresResData } from "./api";

export interface Photo {
  id?: string;
  src: string | undefined;
  width?: number | string;
  height?: number | string;
}

export interface AdCharacteristic {
  type: string;
  label: string;
}

export interface AdDetails {
  id: string;
  categories?: {
    id: number;
    name: string;
    avatar: string;
    avatar_height: number;
    avatar_width: number;
  }[];

  created_at: Date;
  title: string;
  description: string;
  address: string;
  city_id?: number;
  place_id?: number;
  lat?: number;
  lon?: number;
  photos: getWaresResData[number]["images"];
  characteristics: AdCharacteristic[];
  titleImageIndex: number | undefined;
  seller: {
    id: string;
    name: string;
    ratingUp: number;
    ratingDown: number;
    avatar?: string;
  };
  rating: number;
  mapUrl?: string;
  price: number;
  status?: "draft" | "on" | "off" | "sold" | null;
  isFavorited: boolean;
}

export interface CreateAdForm {
  title: string;
  description: string;
  address: getCitiesResData[number];
  photos: Photo[];
  price: number;
  // characteristics: AdCharacteristic[]
}

export interface IAdListItem {
  id: string;
  photos: { url: string; width: number; height: number }[];
  title: string;
  price: number;
  address: string;
  created_at: Date | null;
  is_favorite?: boolean;
  status?: AdDetails["status"];
}

export interface IMyAdListItem extends Omit<IAdListItem, "is_favorite"> {}

export interface AuthContext {
  token: string | undefined;
  setToken: Dispatch<SetStateAction<string | undefined>>;
}

export interface Category {
  id: string;
  label: string;
}

export interface NextSsrReq {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export enum CHAT_ROOM_STATUS {
  request = "request",
  open = "open",
  closed = "closed",
  "closed-hidden" = "closed-hidden",
  "closed-claimed" = "closed-claimed",
}

export enum CHAT_MESSAGE_VARIANT {
  like = "like",
  message = "message",
}

export interface SchemaUser {
  id: string;
}

export interface CustomNextApiRequest extends NextRequest {
  id: string;
  log: Logger;
  user?: SchemaUser;
}

export interface Ctx {
  log: Logger;
}

export interface AlfacmsBackendListRes<T = any> {
  data: T;
  links: {
    self: string;
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  "meta-filters": {
    name: string;
    lat: string;
    lon: string;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string; label: string; active: boolean }[];
  };
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface AlfacmsBackendListReq {
  page?: number;
  nextPageUrl?: string;
}

export interface Coordinates {
  lat: number | string;
  lon: number | string;
}

export type WareFilters = {
  search?: string;
  categoryIds?: string[];
  cityId?: string;
  placeId?: string;
  coordinates?: Coordinates;
  priceFrom?: number;
  priceTo?: number;
};
