import BottomTabs from "@/components/bottom-tabs/bottom-tabs";
import axiosService from "@/lib/axios-service";
import { COOKIE_AUTH_TOKEN, X_CSRF_TOKEN } from "@/lib/consts";
import Providers from "@/lib/providers";
import { AuthProvider } from "@/lib/services/auth/use-auth";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/lib/theme/bootstrap-theme.scss";
import style from "./page.module.css";
import { AppProgressBar } from "@/components/app-progress-bar";
import RnAppMounted from "@/components/rn-app-mounted";
import "./globals.css";
import moment from "moment";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mon Business",
  description: "buy and sell wares in Mali",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nextjsToken = cookies().get(COOKIE_AUTH_TOKEN)?.value;
  const csrfToken = headers().get(X_CSRF_TOKEN)!;
  axiosService.setNextjsToken(nextjsToken);

  return (
    <html lang="en" className={style.html}>
      <body className={`${inter.className} ${style.body}`}>
        <AppProgressBar />
        <AuthProvider token={nextjsToken}>
          <Providers csrfToken={csrfToken}>
            {children}
            <div className={style["bottom-tabs-padding"]} />
            <BottomTabs />
          </Providers>
        </AuthProvider>
        <ToastContainer hideProgressBar position="top-center" autoClose={5000} />
        <RnAppMounted />
      </body>
    </html>
  );
}
