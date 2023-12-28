"use client";

import { QUERY_KEY_PROFILE } from "@/lib/consts";
import { http } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/use-auth";
import { formatGetMe, formatUser } from "@/lib/formatters/user";
import { EditProfileFormData, UpdatePasswordFormData } from "@/app/profile/edit/edit-profile";
import { fileToBase64 } from "@/lib/file-to-base64";
import NProgress from "nprogress";
import { toast } from "react-toastify";
import errorHandler from "@/lib/error-handler";

export function useProfile(props?: { userId?: string }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: [QUERY_KEY_PROFILE, props?.userId],
    queryFn: async () =>
      (props?.userId && formatUser(await http.user.getUser({ userId: props.userId }))) ||
      (token && formatGetMe(await http.user.getMe())) ||
      null,
    enabled: props?.userId ? true : !!token,
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) =>
      http.user.postUserSetAvatar({
        base64: await fileToBase64(file),
      }),
  });

  const updateProfileMutation = useMutation({
    mutationKey: ["put-profile"],
    mutationFn: async (args: EditProfileFormData) => {
      NProgress.start();
      const putMeRes = await http.user.putMe({
        phone: args.phoneNumber,
        email: args.email,
        name: args.name,
        email_is_public: args.isEmailPublic,
        phone_is_public: args.isPhonePublic,
      });
      if (args.avatar) {
        await uploadAvatarMutation.mutateAsync(args.avatar);
      }

      if (args.isShallClearAvatar) {
        await http.user.userRemoveAvatar();
      }

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PROFILE] });
      return putMeRes;
    },
    onSettled: () => {
      NProgress.done();
    },
    onSuccess: () => {
      toast("Succès!", { type: "success" });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationKey: ["update-password"],
    mutationFn: async (args: UpdatePasswordFormData) => {
      NProgress.start();
      return http.user.putUserSetPassword({
        oldPassword: args.oldPassword,
        newPassword: args.newPassword,
        newPasswordConfirmation: args.confirmPassword,
      });
    },
    onSettled: () => {
      NProgress.done();
    },
    onSuccess: () => {
      toast("Succès!", { type: "success" });
    },
  });

  const voteMutation = useMutation({
    mutationKey: ["vote", props?.userId],
    mutationFn: async (args: Pick<Parameters<typeof http.customers.voteCustomer>[0], "vote">) => {
      NProgress.start();
      return http.traders.voteTrader({
        traderId: props?.userId!,
        vote: args.vote,
      });
    },
    onError: errorHandler,
    onSettled: () => {
      NProgress.done();
    },
    onSuccess: () => {
      toast("Succès!", { type: "success" });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PROFILE, props?.userId] });
    },
  });

  const claimWareMutation = useMutation(
    async (args: Parameters<typeof http.traders.postUserClaim>[0]) => {
      NProgress.start();
      return http.traders.postUserClaim(args);
    },
    {
      onSettled: () => {
        NProgress.done();
      },
    }
  );

  return {
    profileQuery,
    updateProfileMutation,
    uploadAvatarMutation,
    updatePasswordMutation,
    claimWareMutation,
    voteMutation,
  };
}
