import { MyProfileProps } from "@/app/profile/my-profile";
import { getMe, getUser } from "../http/users";

export function formatGetMe(args: Awaited<ReturnType<typeof getMe>>): MyProfileProps["profile"] {
  return {
    avatarSrc: args.data.data?.avatar,
    userName: args.data.data?.name,
    userId: `${args.data.data?.id}`,
    customerRate: args.data.data?.customer_rating,
    traderRate: args.data.data?.trader_rating,
    email: args.data.data?.email,
    phone: args.data.data?.phone,
    isEmailPublic: !!args.data?.data?.email_is_public,
    isPhonePublic: !!args.data?.data?.phone_is_public,
    customerRateDown: args.data?.data?.customer_vote_down,
    customerRateUp: args.data?.data?.customer_vote_up,
    traderRateDown: args.data?.data?.trader_vote_down,
    traderRateUp: args.data?.data?.trader_vote_up,
  };
}

export function formatUser(args: Awaited<ReturnType<typeof getUser>>): MyProfileProps["profile"] {
  return {
    avatarSrc: args.data.data?.avatar,
    userName: args.data.data?.name,
    userId: `${args.data.data?.id}`,
    customerRate: args.data.data?.customer_rating || 0,
    traderRate: args.data.data?.trader_rating || 0,
    email: args.data.data?.email,
    phone: args.data.data?.phone,
    isEmailPublic: !!args.data?.data?.email_is_public,
    isPhonePublic: !!args.data?.data?.phone_is_public,
    customerRateDown: args.data?.data?.customer_vote_down,
    customerRateUp: args.data?.data?.customer_vote_up,
    traderRateDown: args.data?.data?.trader_vote_down,
    traderRateUp: args.data?.data?.trader_vote_up,
  };
}
