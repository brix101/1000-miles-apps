import jwt from "jsonwebtoken";
import { env } from "../env";

export function signJwt(
  object: object,
  keyName: keyof typeof env,
  options?: jwt.SignOptions | undefined
) {
  const key = env[keyName] as string;
  const signingKey = Buffer.from(key, "base64").toString("ascii");

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string, keyName: keyof typeof env) {
  const key = env[keyName] as string;

  const publicKey = Buffer.from(key, "base64").toString("ascii");

  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
