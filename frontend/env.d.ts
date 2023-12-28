declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    BACKEND_BASE_URL: string;
    NEXT_PUBLIC_HASURA_WS_URL: string;
    NEXT_PUBLIC_HASURA_HTTP_URL: string;
    NEXT_PUBLIC_NEXTJS_URL: string;
    NEXT_PUBLIC_ALFACMS_BASE_URL: string;
    NEXT_PUBLIC_REACT_QUERY_DEVTOOLS?: string;
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  }
}
