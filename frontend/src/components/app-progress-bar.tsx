"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import colors from "@/lib/theme/colors.module.scss";

export function AppProgressBar() {
  return <ProgressBar height="3px" color={colors.primary} options={{ showSpinner: false }} shallowRouting />;
}
