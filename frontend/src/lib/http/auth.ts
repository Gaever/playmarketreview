import axiosService from "@/lib/axios-service";

export const postSignIn = async (args: { login: string; password: string }) =>
  axiosService.nextjsBackend.post<{ token: string; gqlToken: string }>("/login", {
    login: args.login,
    password: args.password,
  });

export const postSignOut = async () => {
  return axiosService.nextjsBackend.post<{ token: string }>("/logout");
};
