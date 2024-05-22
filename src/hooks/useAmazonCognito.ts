import cognitoUser from "@/config/aws/cognitoUser";
import userpool from "@/config/aws/userpool";
import { LOCALSTORAGE_KEY } from "@/config/constants";
import useAuthStore from "@/store/authStore";
import useMfaStore from "@/store/mfaStore";
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import useLocalStorage from "./useLocalStorage";

const useAmazonCognito = () => {
  const { setItem, removeItem, getItem } = useLocalStorage();

  const { data: userData, setData } = useAuthStore();
  const { data: mfaData, setData: setMfaData } = useMfaStore() || {};

  const register = (values: any) => {
    const { username, password, email } = values || {};
    return new Promise((res, rej) => {
      const attributeList = [];

      const dataEmail = {
        Name: "email",
        Value: email,
      };

      // const dataPhoneUpdateTime = {
      //   Name: "custom:phone_update_time",
      //   Value: new Date().toISOString(),
      // };

      const dataPhoneCount = {
        Name: "custom:PhoneUpdateCount",
        Value: JSON.stringify([]),
      };

      const atrributeEmail = new CognitoUserAttribute(dataEmail);
      // const attributePhoneUpdateTime = new CognitoUserAttribute(
      //   dataPhoneUpdateTime
      // );
      const attributePhoneCount = new CognitoUserAttribute(dataPhoneCount);
      attributeList.push(atrributeEmail);
      // attributeList.push(attributePhoneUpdateTime);
      attributeList.push(attributePhoneCount);

      userpool.signUp(username, password, attributeList, [], (err, data) => {
        if (!err) {
          res(data);
        } else {
          rej(err);
        }
      });
    });
  };

  const verify = (values: { username: string; otp: string }) => {
    const { otp, username } = values;
    return new Promise((res, rej) => {
      cognitoUser(username).confirmRegistration(otp, true, (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });
  };

  const resendOtp = (values: { username: string }) => {
    const { username } = values;
    return new Promise((res, rej) => {
      cognitoUser(String(username)).resendConfirmationCode((err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });
  };

  const forgotPassword = (values: { username: string }) => {
    const { username } = values;
    return new Promise((res, rej) => {
      cognitoUser(String(username)).forgotPassword({
        onSuccess: (result) => {
          res(result);
        },
        onFailure: (err) => {
          rej(err);
        },
      });
    });
  };

  const confirmPassword = (values: {
    username: string;
    otp: string;
    new_password: string;
  }) => {
    const { username, new_password: newPassword, otp } = values;
    return new Promise((res, rej) => {
      cognitoUser(String(username)).confirmPassword(otp, newPassword, {
        onSuccess: (result) => {
          res(result);
        },
        onFailure: (err) => {
          rej(err);
        },
      });
    });
  };

  const login = (username: string, password: string) => {
    return new Promise((res, rej) => {
      const user = cognitoUser(username);
      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });
      user.authenticateUser(authDetails, {
        mfaSetup: () => {
          user.associateSoftwareToken({
            associateSecretCode: async (secretCode) => {
              const uri = `otpauth://totp/Global SSO Service - ${decodeURI(
                username + `@${new Date().getTime()}`
              )}?secret=${secretCode}`;

              res({
                uri,
                user,
              });
            },
            onFailure: (err) => {
              rej(err);
            },
          });
        },
        totpRequired: () => {
          res({ user });
        },
        newPasswordRequired(userAttr) {
          rej({
            // name: ChallengeNameType.NEW_PASSWORD_REQUIRED,
            message: "New Password Required",
            data: userAttr,
            user,
          });
        },
        onSuccess: async (data: CognitoUserSession) => {
          mfaLoggedHandler(data);
          res({ data, user });

          // user.associateSoftwareToken({
          //   associateSecretCode: async (secretCode) => {
          //     const uri = `otpauth://totp/Global SSO Service - ${
          //       username + `@${new Date().getTime()}`
          //     }?secret=${secretCode}`;
          //     res({ uri, user });
          //   },
          //   onFailure: (err) => {
          //     rej(err);
          //   },
          // });
        },
        onFailure: (err) => {
          rej(err);
        },
      });
    });
  };

  const mfaLoggedHandler = (data: CognitoUserSession) => {
    return new Promise((res, rej) => {
      {
        const unix = data.getAccessToken().getExpiration();

        setItem(
          LOCALSTORAGE_KEY.ACCESS_TOKEN,
          data.getAccessToken().getJwtToken()
        );
        setItem(LOCALSTORAGE_KEY.ID_TOKEN, data.getIdToken().getJwtToken());
        setItem(
          LOCALSTORAGE_KEY.REFRESH_TOKEN,
          data.getRefreshToken().getToken()
        );
        setItem(
          LOCALSTORAGE_KEY.ACCOUNT,
          data.getAccessToken().decodePayload()?.username
        );
        setItem(LOCALSTORAGE_KEY.EXPIRED_TIME, unix);

        setData(data);
        res(data);
      }
    });
  };

  // const verifyTotp = (totp: string) => {
  //   return new Promise((res, rej) => {
  //     mfaData?.cognitoUser?.verifySoftwareToken(totp, "My TOTP Device", {
  //       onSuccess: (session) => {
  //         mfaData?.cognitoUser?.setUserMfaPreference(
  //           null,
  //           {
  //             Enabled: true,
  //             PreferredMfa: true,
  //           },
  //           (error, success) => {
  //             if (error) {
  //               rej(error);
  //             } else {
  //               mfaLoggedHandler()
  //                 .then((data) => {
  //                   res(data);
  //                 })
  //                 .catch((err) => {
  //                   rej(err);
  //                 });
  //             }
  //           }
  //         );
  //       },
  //       onFailure: (err) => {
  //         rej(err);
  //       },
  //     });
  //   });
  // };

  // const sendMfaCode = (code: string) => {
  //   return new Promise((res, rej) => {
  //     mfaData?.cognitoUser?.sendMFACode(
  //       code,
  //       {
  //         onSuccess: (session) => {
  //           mfaLoggedHandler()
  //             .then((data) => {
  //               res(data);
  //             })
  //             .catch((err) => {
  //               rej(err);
  //             });
  //         },
  //         onFailure: (err) => {
  //           rej(err);
  //         },
  //       },
  //       "SOFTWARE_TOKEN_MFA"
  //     );
  //   });
  // };

  const resetMfa = () => {
    return new Promise((res, rej) => {
      cognitoUser()?.setUserMfaPreference(
        null,
        {
          Enabled: false,
          PreferredMfa: false,
        },
        (error, success) => {
          if (error) {
            rej(error);
          } else {
            res(success);
          }
        }
      );
    });
  };

  const getSession = async () => {
    return await new Promise((res, reject) => {
      const user = userpool.getCurrentUser();

      if (user) {
        user?.getSession((err: any, session: any) => {
          if (err) {
            reject();
          } else {
            res(session);
          }
        });
      } else {
        reject();
      }
    });
  };

  const refreshToken = async () => {
    return new Promise((res, rej) => {
      cognitoUser().getSession(
        (err: Error, session: CognitoUserSession | any) => {
          if (err) {
            rej(err);
          } else {
            if (session.isValid()) {
              res("");
            } else {
              const refresh = new CognitoRefreshToken({
                RefreshToken: session?.getRefreshToken()?.getToken(),
              });
              cognitoUser().refreshSession(
                refresh,
                (errRefresh, sessionRefresh) => {
                  if (errRefresh) {
                    logout();
                  } else {
                    setData(sessionRefresh);
                    res(sessionRefresh);
                  }
                }
              );
            }
          }
        }
      );
    });
  };

  const logout = () => {
    const user = cognitoUser().getSignInUserSession();

    const logoutFunc = () => {
      removeItem(LOCALSTORAGE_KEY.ACCESS_TOKEN);
      removeItem(LOCALSTORAGE_KEY.REFRESH_TOKEN);
      removeItem(LOCALSTORAGE_KEY.EXPIRED_TIME);
      removeItem(LOCALSTORAGE_KEY.ACCOUNT);
      removeItem(LOCALSTORAGE_KEY.ID_TOKEN);

      setData(null);
      setMfaData({
        cognitoUser: null,
        totpToken: "",
        username: "",
      });

      if (!window.location.href.includes("login")) {
        window.location.href = "/login";
      }
    };

    if (user) {
      cognitoUser().globalSignOut({
        onSuccess: (msg) => {
          //   toast(msg || "");
          logoutFunc();
        },
        onFailure: (err) => {
          //   toast(err?.message || "");
        },
      });
    } else {
      //   toast("Logout success");
      logoutFunc();
    }
  };

  return {
    register,
    verify,
    resendOtp,
    forgotPassword,
    confirmPassword,
    login,
    // sendMfaCode,
    resetMfa,
    // verifyTotp,
    getSession,
    refreshToken,
    logout,
  };
};

export default useAmazonCognito;
