import axiosService from "@/lib/axios-service";
import { AlfacmsBackendListReq } from "@/types";
import { deleteWareReq, getWaresReq, getWaresResData, postWareClaimReq, postWareClaimRes } from "@/types/api";
import { getWithNextPage } from "../get-with-next-page";

export const getWares = async (args?: AlfacmsBackendListReq & getWaresReq) =>
  getWithNextPage<getWaresResData>("/open-wares", args);

export const getMyCreatedWares = async (args?: AlfacmsBackendListReq) =>
  getWithNextPage<getWaresResData>("/wares?is_my=true", args);

export const getWare = async (args: { wareId: string }) =>
  axiosService.proxyAlfacmsBackend.get<{
    data: getWaresResData[number];
  }>(`/open-wares/${args.wareId}`);

export const getMyWare = async (args: { wareId: string }) =>
  axiosService.proxyAlfacmsBackend.get<{
    data: getWaresResData[number];
  }>(`/wares/${args.wareId}`);

export const postWareUploadImage = async (args: { wareId: string; title?: string; base64: string }) =>
  axiosService.proxyAlfacmsBackend.post<{
    data: NonNullable<getWaresResData[number]["images"]>[number];
  }>(`/wares/${args.wareId}/upload-image`, { name: args.title, image: args.base64 });

export const deleteWareImage = async (args: { wareId: string | number; imageId: string | number }) =>
  axiosService.proxyAlfacmsBackend.delete<{
    status: "ok";
  }>(`/wares/${args.wareId}/remove-image/${args.imageId}`);

export const postWare = async (args: getWaresResData[number] & { category_ids: (number | string)[] }) =>
  axiosService.proxyAlfacmsBackend.post<{
    data: getWaresResData[number];
  }>(`/wares`, args);

export const putWare = async (args: { wareId: string; form: getWaresResData[number] }) => {
  axiosService.proxyAlfacmsBackend.put<{
    data: getWaresResData[number];
  }>(`/wares/${args.wareId}`, args.form);
};

export const getWareMakeMainImage = async (args: { wareId: string; imageId: string }) =>
  axiosService.proxyAlfacmsBackend.get<{
    data: {
      status: "ok";
    };
  }>(`/wares/${args.wareId}/make-main-image/${args.imageId}`);

export const favoriteWare = async (args: { wareId: string }) =>
  axiosService.proxyAlfacmsBackend.get(`/wares/${args.wareId}/favorites/add`);

export const unfavoriteWare = async (args: { wareId: string }) =>
  axiosService.proxyAlfacmsBackend.get(`/wares/${args.wareId}/favorites/remove`);

export const postWareClaim = async (args: postWareClaimReq) =>
  axiosService.proxyAlfacmsBackend.post<postWareClaimRes>(`/complaints/ware`, args);

export const deleteWare = async (args: deleteWareReq) =>
  axiosService.proxyAlfacmsBackend.delete<postWareClaimRes>(`/wares/${args.ware_id}`);
