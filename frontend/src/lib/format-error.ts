import { AxiosError } from "axios";

export function fallbackError() {
  return "Unknown error";
}

export function formatPlainError(error: any): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (typeof error?.error === "string") {
    return error?.error;
  }
  if (Array.isArray(error) && typeof error?.[0] === "string") {
    return error[0];
  }
  if (typeof error === "string" && error.indexOf("<html") === 0) {
    return undefined;
  }
  return undefined;
}

export function formatAxiosError(error: AxiosError) {
  if (error?.isAxiosError && error?.response?.status === 404) {
    return formatPlainError(error?.message);
  }
  if (error?.isAxiosError && error?.response?.status !== 404) {
    return formatPlainError(error?.response?.data) || formatPlainError(error?.message);
  }
  return formatPlainError(error);
}

export default function formatError(error: any, options?: { noFallbackMessage?: boolean }): string | undefined {
  return (
    formatAxiosError(error) || formatPlainError(error) || (options?.noFallbackMessage ? undefined : fallbackError())
  );
}
