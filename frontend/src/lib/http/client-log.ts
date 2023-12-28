import axiosService from "@/lib/axios-service";

export const clientLog = async (params: { type?: "error"; message: string }) => {
  try {
    await axiosService.nextjsBackend.get("/client-log", { params });
  } catch {}
};
