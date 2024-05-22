import { CognitoUserPool, CookieStorage } from "amazon-cognito-identity-js";

const userpool: CognitoUserPool = new CognitoUserPool({
  //   UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
  //   ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
  // UserPoolId: "ap-southeast-1_CRIa8jQBd",
  // ClientId: "ft7svjc7ja9sosqif2dc8reh9",
  UserPoolId: "ap-southeast-1_uBiKCKVxa",
  ClientId: "5r1u2dqt5rk325jrlqq7n8njcg",
  Storage: new CookieStorage({
    domain: process.env.NEXT_PUBLIC_DOMAIN
      ? process.env.NEXT_PUBLIC_DOMAIN
      : "http://localhost:3001",
    secure: true,
  }),
  // endpoint: "https://d2vkh90i5l7koe.cloudfront.net",
  endpoint: "https://d1ol21vzi1f6ah.cloudfront.net",
});

export default userpool;
