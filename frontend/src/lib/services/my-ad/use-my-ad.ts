"use client";

import { adForm } from "@/components/mutate-my-ad-form/mutate-my-ad-form";
import { QUERY_KEY_MY_ADS, QUERY_KEY_WARE, QUERY_KEY_WARES } from "@/lib/consts";
import { fileToBase64 } from "@/lib/file-to-base64";
import { formatGetWare } from "@/lib/formatters/wares";
import { http } from "@/lib/http";
import { useAuth } from "@/lib/services/auth/use-auth";
import { useParentPathname } from "@/lib/use-parent-pathname";
import { getWaresResData } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useCallback } from "react";
import { toast } from "react-toastify";

type UploadedImage = Awaited<ReturnType<typeof http.wares.postWareUploadImage>>["data"]["data"];

export function useMyAd() {
  const searchParams = useParams();
  const adId = searchParams["id"] as string;
  const { parentPathname } = useParentPathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback((args?: { isInvalidationAfterWareDelete?: boolean }) => {
    queryClient.invalidateQueries([QUERY_KEY_WARES], { refetchType: "inactive" });
    queryClient.invalidateQueries([QUERY_KEY_WARE, adId], { refetchType: "inactive" });
    queryClient.invalidateQueries([QUERY_KEY_MY_ADS], { exact: args?.isInvalidationAfterWareDelete });
    // eslint-disable-next-line
  }, []);

  const { token } = useAuth();
  const myAdQuery = useQuery({
    queryKey: [QUERY_KEY_MY_ADS, adId],
    enabled: !!token && !!adId,
    queryFn: async () => formatGetWare((await http.wares.getMyWare({ wareId: adId }))?.data),
  });

  const uploadPhotosMutation = useMutation({
    mutationFn: async (args: { form: adForm; wareId: string }) => {
      const images: UploadedImage[] = [];
      for (const file of args?.form?.newPhotos || []) {
        const base64 = await fileToBase64(file);

        const image = await http.wares.postWareUploadImage({
          wareId: args.wareId,
          base64,
        });

        images.push(image.data.data);
      }

      return images;
    },
  });

  const deletePhotosMutation = useMutation({
    mutationFn: async (args: { wareId: string | number; imageIds: (number | string)[] }) => {
      for (const imageId of args?.imageIds || []) {
        await http.wares.deleteWareImage({
          wareId: args.wareId,
          imageId,
        });
      }
    },
  });

  const createAdMutation = useMutation({
    mutationFn: async (form: adForm) => {
      const { newPhotos, photos, category_ids, ...rest } = form;

      return http.wares.postWare({ category_ids: category_ids!, ...rest });
    },
  });

  const updateAdMutation = useMutation({
    mutationFn: async (args: { form: adForm }) => {
      const { newPhotos, photos, category_ids, ...rest } = args.form;
      const id = adId || args.form?.id?.toString();

      return http.wares.putWare({ wareId: id!, form: rest });
    },
  });

  const updateMainImageMutation = useMutation({
    mutationFn: async (args: { uploadedImages: UploadedImage[]; wareId: string; titleImageIndex: number }) => {
      if ((args.uploadedImages?.length ?? 0) < 1) {
        return;
      }

      const imageId = args.uploadedImages?.find((_, index) => index === args.titleImageIndex)?.id?.toString?.() || "";

      return http.wares.getWareMakeMainImage({ wareId: args.wareId, imageId });
    },
  });

  const onCreateAdFormSubmit = useMutation({
    mutationFn: async (form: adForm) => {
      NProgress.start();
      const postWareRes = await createAdMutation.mutateAsync(form);
      const createdAdId = postWareRes.data?.data?.id?.toString()!;
      await uploadPhotosMutation.mutateAsync({ form, wareId: createdAdId });
      const ware = formatGetWare((await http.wares.getMyWare({ wareId: createdAdId }))?.data);

      await updateMainImageMutation.mutateAsync({
        titleImageIndex: form.titlePhotoIndex || 0,
        uploadedImages: ware.photos || [],
        wareId: createdAdId,
      });
      return postWareRes;
    },
    onSettled: () => {
      NProgress.done();
    },
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const onUpdateAdFormSubmit = useMutation({
    mutationFn: async (form: adForm & { doNotRedirect?: boolean }) => {
      NProgress.start();
      const wareId = adId || form?.id?.toString()!;
      const titleImageIndex = form.titlePhotoIndex ?? 0;
      await uploadPhotosMutation.mutateAsync({ form, wareId });

      const imageIdsToDelete = (myAdQuery.data?.photos || [])
        .filter((item) => !form.photos?.includes(item.image))
        ?.map((item) => item.id);

      await deletePhotosMutation.mutateAsync({ imageIds: imageIdsToDelete, wareId });

      const putWareRes = await updateAdMutation.mutateAsync({ form });
      const ware = formatGetWare((await http.wares.getMyWare({ wareId }))?.data);

      await updateMainImageMutation.mutateAsync({
        titleImageIndex,
        uploadedImages: ware.photos || [],
        wareId,
      });

      return putWareRes;
    },
    onSuccess: (_, variables) => {
      invalidateQueries();
      toast("Article mis à jour", { type: "success" });
      if (!variables?.doNotRedirect) {
        router.push(parentPathname);
      }
    },
    onSettled: () => {
      NProgress.done();
    },
  });

  const deleteWareMutation = useMutation({
    mutationFn: async () => {
      NProgress.start();
      return http.wares.deleteWare({ ware_id: adId });
    },
    onSettled: () => {
      NProgress.done();
    },
    onSuccess: () => {
      invalidateQueries({ isInvalidationAfterWareDelete: true });
      toast("Article supprimé", { type: "success" });
      router.replace(parentPathname);
    },
  });

  return {
    myAdQuery,
    onCreateAdFormSubmit,
    onUpdateAdFormSubmit,
    createAdMutation,
    uploadPhotosMutation,
    deleteWareMutation,
  };
}
