import jwt, { decode, JwtPayload, SignOptions, verify } from "jsonwebtoken";

const unescapeCertEnv = (str: string) => str.replaceAll("\\n", "\n");

export const verifyJwt = (jwt: string, cert: string) => {
  try {
    verify(jwt, cert);
    return true;
  } catch (error) {
    return false;
  }
};

export const createRefreshJwt = (userId: string, roles: string[] = ["user", "anonymous"]) => {
  const signOptions: SignOptions = {
    subject: userId,
    expiresIn: "7d",
    algorithm: "RS512",
    audience: ["web"],
  };

  const claim = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": roles,
      "x-hasura-default-role": "user",
      "x-hasura-user-id": userId,
    },
  };

  const token = jwt.sign(claim, unescapeCertEnv(process.env.REFRESH_JWT_RSA512_PRIVATE_KEY!), signOptions);
  verifyRefreshJwt(token);
  return token;
};

export const verifyRefreshJwt = (jwt: string) =>
  verifyJwt(jwt, unescapeCertEnv(process.env.REFRESH_JWT_RSA512_PUBLIC_KEY!));

export const createAuthJwt = (args: { userId: string; roles?: string[]; claim?: Record<string, string | object> }) => {
  const signOptions: SignOptions = {
    subject: args.userId,
    expiresIn: "1 year",
    algorithm: "HS256",
    audience: ["web"],
  };

  const claim = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": args.roles || ["user", "anonymous"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": args.userId,
    },
    ...args.claim,
  };

  const token = jwt.sign(claim, process.env.AUTH_JWT_HS256!, signOptions);
  verifyAuthJwt(token);
  return token;
};

export const verifyAuthJwt = (jwt: string) => verifyJwt(jwt, process.env.AUTH_JWT_HS256!);

export const createRecoveryJwt = (userId: string) => {
  const signOptions: SignOptions = {
    subject: userId,
    expiresIn: "1 years",
    algorithm: "HS256",
    audience: ["web"],
  };

  const claim = {
    id: userId,
  };

  const token = jwt.sign(claim, unescapeCertEnv(process.env.AUTH_JWT_RSA512_PRIVATE_KEY!), signOptions);

  verifyRecoveryJwt(token);

  return token;
};

export const verifyRecoveryJwt = (jwt: string) =>
  verifyJwt(jwt, unescapeCertEnv(process.env.AUTH_JWT_RSA512_PUBLIC_KEY!));

export const createResetCredentialsJwt = (userId: string) => {
  const signOptions: SignOptions = {
    subject: userId,
    expiresIn: "15m",
    algorithm: "HS256",
    audience: ["web"],
  };

  const claim = {
    id: userId,
  };

  const token = jwt.sign(claim, unescapeCertEnv(process.env.AUTH_JWT_RSA512_PRIVATE_KEY!), signOptions);

  verifyResetCredentialsJwt(token);

  return token;
};

export const verifyResetCredentialsJwt = (jwt: string) =>
  verifyJwt(jwt, unescapeCertEnv(process.env.AUTH_JWT_RSA512_PUBLIC_KEY!));

export const jwtToUserId = (jwt: string) => {
  if (!jwt) return "";
  const payload = decode(jwt) as JwtPayload;
  return payload?.sub;
};
