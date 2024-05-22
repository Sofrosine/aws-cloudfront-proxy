import { CognitoUserSession } from "amazon-cognito-identity-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  data: any;
};

type AuthAction = {
  setData: (data: any) => void;
  logout: () => void;
};
export type AuthStoreTypes = AuthState & AuthAction;

const useAuthStore = create(
  persist<AuthStoreTypes>(
    (set) => ({
      data: null,
      setData: (data: any) => {
        set(() => ({
          data,
        }));
      },
      logout: () => {
        set(() => ({
          data: null,
        }));
      },
    }),
    {
      name: "@user_data",
    }
  )
);

export default useAuthStore;
