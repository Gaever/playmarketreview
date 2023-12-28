import formatError from "@/lib/format-error";
import { loggerOptions } from "@/lib/logger";
import useAuthentication, { useBackendAuthentication } from "@/lib/middleware/use-authentication";
import { Ctx, CustomNextApiRequest } from "@/types";
import { AxiosError } from "axios";
import expressWinston from "express-winston";
import { createEdgeRouter, expressWrapper } from "next-connect";
import { NextFetchEvent, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import winston from "winston";

export function getCtx(req: CustomNextApiRequest): Ctx {
  return {
    log: req.log,
  };
}

export const createHandler = <TReq extends CustomNextApiRequest = CustomNextApiRequest>(args: {
  disableResLog?: boolean;
  disableReqLog?: boolean;
  loggerTag?: string;
  useBackendAuthentication?: boolean;
  useAuthentication?: boolean;
}) => {
  const router = createEdgeRouter<TReq, NextFetchEvent>()
    .use((req, _res, next) => {
      req.id = uuid();
      return next();
    })
    .use((req, res, next) => {
      if (args.useAuthentication) {
        return useAuthentication(req, res, next);
      }
      if (args.useBackendAuthentication) {
        return useBackendAuthentication(req, res, next);
      }
      return next();
    })
    .use((req, _res, next) => {
      const log = winston.createLogger({
        ...loggerOptions,
        defaultMeta: {
          d: {
            endpoint: args?.loggerTag,
            reqId: req.id,
            userId: req?.user?.id,
          },
        },
      });

      req.log = log;

      log.info("[REQ START]");

      return next();
    })
    .use((req, res, next) => {
      return expressWrapper<any, any>(
        expressWinston.logger({
          winstonInstance: req.log,
          requestWhitelist: ["body"],
          responseWhitelist: ["body", "statusCode"],

          ignoreRoute: () => !!(args.disableReqLog || args.disableResLog),
        })
      )(req, res, next);
    });

  const onError = (err: unknown, req: CustomNextApiRequest) => {
    const isAxiosError = (err as AxiosError)?.isAxiosError;

    if (isAxiosError) {
      const axiosError = err as AxiosError;
      const message = axiosError?.response?.data || axiosError?.message;
      req.log.error("http error", {
        res: { message, headers: axiosError?.response?.headers },
        req: {
          data: axiosError.config?.data,
          headers: axiosError.config?.headers,
        },
      });
    } else {
      console.error(err, {
        reqId: req?.log?.defaultMeta?.d?.reqId,
        message: formatError(err),
      });
    }
    const errorString = formatError(err);
    return NextResponse.json({ message: errorString }, { status: 400 });
  };

  return { router, onError };
};
