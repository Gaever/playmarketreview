import axiosService from "@/lib/axios-service";
import { AlfacmsBackendListReq } from "@/types";
import { getWithNextPage } from "../get-with-next-page";

export const getCategories = async (args?: AlfacmsBackendListReq) =>
  getWithNextPage<
    {
      id: number;
      name: string;
      avatar: string;
      parent: string | null;
    }[]
  >("/categories", args);

export const getCategory = async (args: { categoryId: string }) =>
  axiosService.proxyAlfacmsBackend.get<{
    data: {
      id: number;
      name: string;
      avatar: string;
    };
  }>(`/categories/${args.categoryId}`);
