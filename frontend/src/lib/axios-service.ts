import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import { EVENT_SIGNOUT, X_CSRF_TOKEN } from "./consts";
import { JwtPayload, decode } from "jsonwebtoken";
import qs from "qs";
import formatError from "./format-error";

class AxiosService {
  readonly instance: AxiosService;

  protected readonly baseURL: string;
  public alfacmsBackend: AxiosInstance;
  public proxyAlfacmsBackend: AxiosInstance;
  public nextjsBackend: AxiosInstance;

  private csrfToken: string;
  private backendToken: string | undefined;

  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;
    this.baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL!;

    const axiosConfig: CreateAxiosDefaults = {
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "comma" }),
    };

    this.proxyAlfacmsBackend = axios.create(axiosConfig);
    this.alfacmsBackend = axios.create({
      ...axiosConfig,
      baseURL: process.env.NEXT_PUBLIC_ALFACMS_BASE_URL,
    });
    this.nextjsBackend = axios.create({
      ...axiosConfig,
      baseURL: "/api/v1",
      paramsSerializer: (params) => qs.stringify(params),
    });

    this.initInterceptors();
  }

  public async setCsrfToken(value: string) {
    this.csrfToken = value;
  }

  public async setNextjsToken(value: string | undefined) {
    if (value) {
      const payload = decode(value) as JwtPayload;
      this.backendToken = payload["backendToken"];
    } else {
      this.backendToken = undefined;
    }
  }

  initInterceptors() {
    const reqInterceptor = (request: InternalAxiosRequestConfig<any>) => {
      if (this.csrfToken) {
        request.headers.set(X_CSRF_TOKEN, this.csrfToken);
      }

      if (this.backendToken) {
        request.headers.set("Authorization", `Bearer ${this.backendToken}`);
      }

      return request;
    };

    const resInterceptor = (response: AxiosResponse<any, any>) => response;
    const resInterceptorError = (error: AxiosError) => {
      return new Promise((_resolve, reject) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
          document.dispatchEvent(new Event(EVENT_SIGNOUT));
        }

        reject({
          error: formatError(error),
          code: error.response?.status,
          requestUrl: `${error.response?.config?.baseURL}${error.response?.config?.url}`,
          resHeaders: error?.response?.headers,
          reqHeaders: error?.response?.config?.headers,
        });
      });
    };

    this.proxyAlfacmsBackend.interceptors.request.use((request) => {
      if (this.backendToken) {
        request.headers.set("Authorization", `Bearer ${this.backendToken}`);
      }

      return request;
    });
    this.proxyAlfacmsBackend.interceptors.request.use(reqInterceptor);
    this.nextjsBackend.interceptors.request.use(reqInterceptor);

    this.alfacmsBackend.interceptors.response.use(resInterceptor, resInterceptorError);
    this.proxyAlfacmsBackend.interceptors.response.use(resInterceptor, resInterceptorError);
    this.nextjsBackend.interceptors.response.use(resInterceptor, resInterceptorError);
  }
}

const axiosService = new AxiosService();

export default axiosService;
