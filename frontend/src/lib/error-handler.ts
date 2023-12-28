"use client";

import { toast } from "react-toastify";
import formatError from "./format-error";

const ignoreMessages = ["Missing queryFn for queryKey"];

function errorHandler(error: any) {
  if (typeof error === "string" && ignoreMessages.find((item) => error.indexOf(item) !== -1)) {
    return;
  }

  toast(formatError(error), { type: "error" });
}

export default errorHandler;
