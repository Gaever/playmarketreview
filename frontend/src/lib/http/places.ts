import axiosService from "@/lib/axios-service";
import { AlfacmsBackendListReq, AlfacmsBackendListRes } from "@/types";

export const getPlaces = async (args?: AlfacmsBackendListReq) =>
  axiosService.proxyAlfacmsBackend.get<
    AlfacmsBackendListRes<
      {
        id: number;
        name: string;
        lat: number;
        lon: number;
      }[]
    >
  >(`/places`, { params: args });

export const getPlace = async (args: { placeId: string }) =>
  axiosService.proxyAlfacmsBackend.get<{
    data: { id: number; name: string; lat: number; lon: number };
  }>(`/places/${args.placeId}`);
