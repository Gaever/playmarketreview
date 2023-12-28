"use client";

import SignIn from "@/components/sign-in/signin";
import { useAuth } from "@/lib/services/auth/use-auth";
import { usePathname, useSearchParams } from "next/navigation";

export interface AuthorizedLayoutProps extends React.PropsWithChildren {}

function AuthorizedLayout(props: AuthorizedLayoutProps) {
  const { token } = useAuth();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedSearchPrams = searchParams.toString();

  if (!token) {
    return <SignIn redirectTo={`${pathname}${serializedSearchPrams ? `?${serializedSearchPrams}` : ""}`} />;
  }

  return <>{props.children}</>;
}

export default AuthorizedLayout;
