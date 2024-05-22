import { CognitoUser } from "amazon-cognito-identity-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TotpData = {
  totpToken: string;
  username: string;
  cognitoUser: CognitoUser | null;
  type?: "default" | "new-password";
};

type TotpState = {
  data: TotpData;
};

type TotpAction = {
  setData: (data: TotpData) => void;
};
export type MfaStoreTypes = TotpState & TotpAction;

const useMfaStore = create(
  persist<MfaStoreTypes>(
    (set) => ({
      data: {
        totpToken: "",
        username: "",
        cognitoUser: null,
        type: "default",
      },
      setData: async (data: TotpData) => {
        set(() => ({
          data: {
            type: "default"!,
            ...data,
          },
        }));
      },
    }),
    { name: "@mfa_data" }
  )
);

export default useMfaStore;
