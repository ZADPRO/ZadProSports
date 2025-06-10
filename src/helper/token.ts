import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";

import { request } from "http";
import { ResponseToolkit } from "@hapi/hapi";
import { encrypt } from "./encrypt";

dotenv.config();

if (!process.env.ACCESS_TOKEN) {
  throw new Error("ACCESS_TOKEN not found in .env file");
}

const TOKEN_EXPIRATION = "5d";

// WITH TOKEN EXPIRATION
function generateTokenWithExpire(
  tokenData: object,
  action: boolean
): string | object {
  if (action) {
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN as string, {
      expiresIn: TOKEN_EXPIRATION,
    });
    return token;
  } else {
    return tokenData;
  }
}

const FIVE_MINUTES_EXPIRATION = "5m";

export function generateTokenWith5MExpire(
  tokenData: object,
  action: boolean
): string | object {
  if (action) {
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN as string, {
      expiresIn: FIVE_MINUTES_EXPIRATION,
    });
    return token;
  } else {
    return tokenData;
  }
}

// WITHOUT TOKEN EXPIRATION
function generateTokenWithoutExpire(
  tokenData: object,
  action: boolean
): string | object {
  if (action) {
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN as string, {});
    return token;
  } else {
    return tokenData;
  }
}

// DECODE TOKEN

function decodeToken(token: string): JwtPayload | { error: string } {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string);
    if (typeof decoded === "string") {
      return {
        error: "Invalid token format",
      };
    }
    return decoded;
  } catch (error) {
    return {
      error: "Invalid or expired token",
    };
  }
}

// VALIDATE TOKEN

// function validateToken(request: any, h: ResponseToolkit) {
//   console.log("request", request);
//   const authHeader = request.headers.authorization;
//   console.log("authHeader line ----- 66  \n \n", authHeader);

//   if (!authHeader) {
//     return h.response({ error: "Token missing" }).code(401).takeover();
//   }
//   const token = authHeader.split(" ")[1];
//   console.log("token", token);
//   const decodedToken = decodeToken(token);
//   console.log("decodedToken", decodedToken);

//   if ("error" in decodeToken) {
//     return h
//       .response(
//         encrypt(
//           {
//             token: false,
//             message: decodedToken.error,
//           },
//           true
//         )
//       )
//       .code(200)
//       .takeover();
//   }

//   request.plugins.token = decodedToken;
//   console.log("request.plugins.token", request.plugins.token);

//   return h.continue;
// }

function validateToken(request: any, h: ResponseToolkit) {

  const authHeader = request.headers.authorization;
  console.log("authHeader line ----- 66  \n \n", authHeader);

  if (!authHeader) {
    return h.response({ error: "Token missing" }).code(401).takeover();
  }

  const token = authHeader.split(" ")[1];
  console.log("token", token);

  const decodedToken = decodeToken(token);
  console.log("decodedToken", decodedToken);

  // Check for error in decoded token
  if (
    !decodedToken ||
    typeof decodedToken !== "object" ||
    "error" in decodedToken
  ) {
    const errorMessage =
      typeof decodedToken === "object" && decodedToken?.error
        ? decodedToken.error
        : "Invalid or expired token";

    return h
      .response(
        encrypt(
          {
            token: false,
            message: errorMessage,
          },
          true
        )
      )
      .code(200)
      .takeover();
  }

  // Assign decoded token only if it's valid
  request.plugins.token = decodedToken;
  console.log("request.plugins.token", request.plugins.token);

  return h.continue;
}

function validateTokenwithRole(request: any, h: ResponseToolkit) {
  const authHeader = request.headers.authorization;
  console.log("authHeader line ----- 66  \n \n", authHeader);

  if (!authHeader) {
    return h.response({ error: "Token missing" }).code(401).takeover();
  }

  const token = authHeader.split(" ")[1];
  console.log("token", token);

  const decodedToken = decodeToken(token);
  console.log("decodedToken", decodedToken);

  // Check the decoded token result, not the decodeToken function itself
  if ("error" in decodedToken) {
    return h
      .response(
        encrypt(
          {
            token: false,
            message: decodedToken.error,
          },
          true
        )
      )
      .code(200)
      .takeover();
  }

  // Now set the decoded token payload to plugins.token,
  // this should contain id and roleId if token was generated correctly
  request.plugins.token = decodedToken;
  console.log("request.plugins.token", request.plugins.token);

  return h.continue;
}

export {
  decodeToken,
  generateTokenWithExpire,
  validateToken,
  generateTokenWithoutExpire,
  validateTokenwithRole,
};

const TOKEN_EXPIRATION_OTP = "2m";

function generateTokenOtp(tokenData: object, action: boolean): string | object {
  console.log("action", action);
  if (action) {
    console.log("tokenData", tokenData);
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN as string, {
      expiresIn: TOKEN_EXPIRATION_OTP,
    });
    console.log("token", token);
    return token;
  } else {
    return tokenData;
  }
}

function decodeTokenOtp(token: string): JwtPayload | { error: string } {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string);
    if (typeof decoded === "string") {
      return { error: "Invalid token format" };
    }
    return decoded;
  } catch (error) {
    return { error: "Invalid or expired OTP" };
  }
}

export { generateTokenOtp, decodeTokenOtp };
