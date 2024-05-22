import useLocalStorage from "@/hooks/useLocalStorage";
import userpool from "@/config/aws/userpool";
import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserSession,
  CookieStorage,
} from "amazon-cognito-identity-js";
import { LOCALSTORAGE_KEY } from "../constants";

const cognitoUser = (username?: string): CognitoUser => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getItem } = useLocalStorage();
  const cognitoUserVar = new CognitoUser({
    Username: username || getItem("account") || "",
    Pool: userpool,
    Storage: new CookieStorage({
      domain: process.env.NEXT_PUBLIC_DOMAIN
        ? process.env.NEXT_PUBLIC_DOMAIN
        : "http://localhost:3001",
      secure: true,
    }),
  });


  const session = new CognitoUserSession({
    AccessToken: new CognitoAccessToken({
      AccessToken: getItem(LOCALSTORAGE_KEY.ACCESS_TOKEN) || "",
    }),
    IdToken: new CognitoIdToken({
      IdToken: getItem(LOCALSTORAGE_KEY.ID_TOKEN) || "",
    }),
    RefreshToken: new CognitoRefreshToken({
      RefreshToken: getItem(LOCALSTORAGE_KEY.REFRESH_TOKEN) || "",
    }),
  });

  if (session.isValid()) {
    if (
      session.getAccessToken().getExpiration() < Math.floor(Date.now() / 1000)
    ) {
      return cognitoUserVar;
    }
    cognitoUserVar.setSignInUserSession(session);
  }

  console.log("COGNITO",cognitoUserVar)


  return cognitoUserVar;
};

export default cognitoUser;
