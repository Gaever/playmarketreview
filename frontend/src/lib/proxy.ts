import httpProxy from "http-proxy";
import { NextApiRequest, NextApiResponse } from "next";

const proxy = httpProxy.createProxyServer<NextApiRequest, NextApiResponse>({
  target: process.env.PROXY_SERVICE_URL,
  autoRewrite: false,
});

export default proxy;
