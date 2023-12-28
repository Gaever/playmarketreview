"use client";

import axiosService from "@/lib/axios-service";
import { EVENT_SIGNOUT } from "@/lib/consts";
import errorHandler from "@/lib/error-handler";
import { http } from "@/lib/http";
import { postSignIn } from "@/lib/http/auth";
import { jwtToUserId } from "@/lib/jwt";
import { AuthContext } from "@/types";
import { useMutation } from "@tanstack/react-query";
import noop from "lodash/noop";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const authContext = createContext<AuthContext>({
  token: undefined,
  setToken: noop,
});

export const AuthProvider: React.FC<
  React.PropsWithChildren<{
    token: string | undefined;
  }>
> = (props) => {
  const [token, setToken] = useState<string | undefined>(props.token);

  return <authContext.Provider value={{ token, setToken }}>{props.children}</authContext.Provider>;
};

export const useAuth = () => {
  const { token } = useContext(authContext);
  const userId = jwtToUserId(token || "");
  const router = useRouter();

  const withRedirectOnUnauthorized = async (callback?: () => void | Promise<void>) => {
    if (!token) {
      router.replace("/profile");
      return;
    }
    await callback?.();
  };

  return {
    token,
    userId,
    withRedirectOnUnauthorized,
  };
};

export function useAuthSetup() {
  const { token, setToken } = useContext(authContext);

  useEffect(() => {
    const signOutHandler = () => {
      setToken("");
    };

    document.addEventListener(EVENT_SIGNOUT, signOutHandler);
    return () => {
      document.removeEventListener(EVENT_SIGNOUT, signOutHandler);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axiosService.setNextjsToken(token);
    // eslint-disable-next-line
  }, [token]);
}

export function useSignIn(props: { redirectTo?: string; onSignUp?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const signInMutation = useMutation({
    mutationFn: (args: Parameters<typeof postSignIn>[0]) => {
      NProgress.start();
      setIsLoading(true);
      return postSignIn(args);
    },
    onSuccess: (data) => {
      const token = data.data.token;

      if (token) {
        window.location.href = `${process.env.NEXT_PUBLIC_NEXTJS_URL}/api/v1/signin?redirect_to=${props.redirectTo}&token=${token}`;
      }
    },
    onError: (error) => {
      NProgress.done();
      setIsLoading(false);
      errorHandler(error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (args: Parameters<typeof http.user.postUser>[0]) => {
      NProgress.start();
      return http.user.postUser(args);
    },
    onSuccess: () => {
      props.onSignUp?.();
    },
    onError: (error) => {
      errorHandler(error);
    },
    onSettled: () => {
      NProgress.done();
    },
  });

  return { signInMutation, signUpMutation, isLoading: isLoading || signUpMutation.isLoading };
}

export function useSignOut(props?: { redirectTo?: string }) {
  const onSignOutPress = useCallback(() => {
    NProgress.start();
  }, []);

  return {
    onSignOutPress,
    logoutHref: `/api/v1/logout${props?.redirectTo ? `?redirect_to=${props.redirectTo}` : ""}`,
  };
}
