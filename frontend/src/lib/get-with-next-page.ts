import { AlfacmsBackendListReq, AlfacmsBackendListRes } from "@/types";
import axiosService from "./axios-service";

export const getWithNextPage = <R, T extends AlfacmsBackendListReq = AlfacmsBackendListReq>(
  endpoint: string,
  args?: T
) => {
  if (args?.nextPageUrl) {
    const url = new URL(args.nextPageUrl);
    const newUrl = `${url.pathname.replaceAll("/api", "")}${url.search}`;
    return axiosService.proxyAlfacmsBackend.get<AlfacmsBackendListRes<R>>(newUrl);
  }

  return axiosService.proxyAlfacmsBackend.get<AlfacmsBackendListRes<R>>(endpoint, { params: args });
};
