import axiosService from "@/lib/axios-service";
import {
  getMyProfileRes,
  getUserCreateTemplateRes,
  getUserRes,
  postUserReq,
  postUserSetAvatarRes,
  putMeReq,
  putMeRes,
} from "@/types/api";

export const getUser = async (args: { userId: string }) =>
  axiosService.proxyAlfacmsBackend.get<getUserRes>(`/open-users/${args.userId}`);

export const getMe = async () => axiosService.proxyAlfacmsBackend.get<getMyProfileRes>(`/users/me`);

export const putMe = async (args: putMeReq) => axiosService.proxyAlfacmsBackend.put<putMeRes>(`/users/me`, args);

export const postUserSetAvatar = async (args: { base64: string }) => {
  return axiosService.proxyAlfacmsBackend.post<postUserSetAvatarRes>(`/users/me/set-avatar`, {
    avatar: args.base64,
  });
};
export const userRemoveAvatar = async () =>
  axiosService.proxyAlfacmsBackend.get<postUserSetAvatarRes>(`/users/me/remove-avatar`);

export const putUserSetPassword = async (args: {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}) =>
  axiosService.proxyAlfacmsBackend.put(`/users/me/set-password`, {
    password: args.oldPassword,
    new_password: args.newPassword,
    new_password_confirmation: args.newPasswordConfirmation,
  });

export const getUserCreateTemplate = async () =>
  axiosService.proxyAlfacmsBackend.get<getUserCreateTemplateRes>(`/users/create`);

export const postUser = async (args: postUserReq) => axiosService.nextjsBackend.post(`/signup`, args);
