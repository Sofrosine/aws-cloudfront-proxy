import { create } from "zustand";

type ErrorState = {
  message: string;
};

type ErrorAction = {
  setMessage: (message: string) => void;
};
export type ErrorStoreTypes = ErrorState & ErrorAction;

export const useErrorStore = create<ErrorStoreTypes>((set) => ({
  message: "",
  setMessage: (message: string) => {
    set(() => ({
      message,
    }));
  },

  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
}));
