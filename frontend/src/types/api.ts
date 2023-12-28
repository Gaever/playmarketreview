export interface getWaresReq {
  city_id?: string | number;
  place_id?: string | number;
  lat?: string | number;
  accuracy?: number;
  lon?: string | number;
  price_from?: string | number;
  price_to?: string | number;
  name?: string;
  category_ids?: (string | number)[];
}

export interface getUserResData {
  id: number;
  name: string;
  email: string;
  email_is_public: boolean;
  avatar: string;
  phone: string;
  phone_is_public: boolean;
  trader_rating: number;
  customer_rating: number;
  trader_vote_up: number;
  trader_vote_down: number;
  customer_vote_up: number;
  customer_vote_down: number;
  birthdate: Date | null;
}
export interface getUserRes {
  data: getUserResData;
}

export interface getMyProfileRes {
  data: {
    id: number;
    name: string;
    email: string;
    email_is_public: boolean;
    avatar: string;
    phone: string;
    phone_is_public: boolean;
    trader_rating: number;
    customer_rating: number;
    trader_vote_up: number;
    trader_vote_down: number;
    customer_vote_up: number;
    customer_vote_down: number;
    birthdate: Date | null;
  };
}

export type getWaresResData = {
  id?: string | number;
  name: string;
  description: string;
  city_id?: number;
  place_id?: number;
  address?: string;
  city?: {
    id?: number;
    name?: string;
    lon?: number;
    lat?: number;
  };
  lat?: number;
  lon?: number;
  price: number;
  youtube_code?: string;
  categories?: {
    id: number;
    name: string;
    avatar: string;
    avatar_height: number;
    avatar_width: number;
  }[];
  images?: {
    id: number;
    name: string;
    avatar: string;
    image: string;
    avatar_width: number;
    avatar_height: number;
    width: number;
    height: number;
  }[];
  avatar?: string | null;
  avatar_width?: number | null;
  avatar_height?: number | null;
  view_count?: number;
  is_primary?: boolean;
  trader?: {
    id?: number;
    name?: string;
    avatar?: string;
    avatar_height: number;
    avatar_width: number;
    trader_rating: number;
    trader_vote_up: number;
    trader_vote_down: number;
  };
  seller_rating?: number;
  map_url?: string;
  status?: "draft" | "on" | "off" | "sold" | null;
}[];

export interface putMeReq extends Partial<getUserResData> {}
export interface putMeRes extends Pick<getMyProfileRes, "data"> {}
export interface postUserSetAvatarRes extends getUserRes {}

export interface postUserSetPasswordRes {}
export interface getUserCreateTemplateRes extends getUserRes {}

export interface postUserReq {
  name: string;
  email: string;
  email_is_public?: boolean;
  password: string;
  password_confirmation: string;
  phone?: string;
  phone_is_public?: boolean;
  birthdate?: Date | null;
}
export interface getFavoritesRes {
  data: any[];
}

export type getCitiesResData = {
  id: number;
  name: string;
  lat: number;
  lon: number;
}[];

export type getPlacesResData = {
  id: number;
  name: string;
  lat: number;
  lon: number;
}[];

export interface postWareClaimRes {
  data: {};
}
export interface postWareClaimReq {
  wares_id: string;
  message?: string;
}

export interface deleteWareReq {
  ware_id: string;
}

export interface postUserClaimReq {
  bastard_id: string;
  message?: string;
}
