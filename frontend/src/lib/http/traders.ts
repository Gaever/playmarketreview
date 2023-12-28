import axiosService from "@/lib/axios-service";
import { postUserClaimReq } from "@/types/api";

export const voteTrader = async (args: { traderId: string; vote: "up" | "down" | "remove" }) =>
  axiosService.proxyAlfacmsBackend.get(`/traders/${args.traderId}/vote/${args.vote}`);
export const postUserClaim = async (args: postUserClaimReq) =>
  axiosService.proxyAlfacmsBackend.post<postUserClaimReq>(`/complaints/user`, args);
