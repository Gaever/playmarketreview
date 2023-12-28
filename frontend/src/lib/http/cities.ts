import axiosService from "@/lib/axios-service";
import { AlfacmsBackendListReq, AlfacmsBackendListRes } from "@/types";
import { getCitiesResData } from "@/types/api";

export const getCities = async (args?: AlfacmsBackendListReq) =>
  axiosService.proxyAlfacmsBackend.get<AlfacmsBackendListRes<getCitiesResData>>(`/cities`, { params: args });

export const getCity = async (args: { cityId: string }) =>
  axiosService.proxyAlfacmsBackend.get<{
    data: getCitiesResData;
  }>(`/cities/${args.cityId}`);
