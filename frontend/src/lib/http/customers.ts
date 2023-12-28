import axiosService from "@/lib/axios-service";

export const voteCustomer = async (args: { customerId: string; vote: "up" | "down" | "remove" }) =>
  axiosService.proxyAlfacmsBackend.get(`/customers/${args.customerId}/vote/${args.vote}`);
