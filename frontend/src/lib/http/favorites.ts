import { AlfacmsBackendListReq } from "@/types";
import { getWithNextPage } from "@/lib/get-with-next-page";
import { getWaresResData } from "@/types/api";

export const getFavorites = async (args?: AlfacmsBackendListReq) =>
  getWithNextPage<getWaresResData>("/favorites", args);
