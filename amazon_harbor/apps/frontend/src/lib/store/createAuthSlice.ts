import { StoreState } from "@/lib/store";
import { User } from "@repo/schema";
import { StateCreator } from "zustand";

export interface State {
  accessToken?: string;
  user?: User;
}

export type AuthSlice = {
  auth: State;
} & {
  setAuthUser: (state: State) => void;
  setAccessToken: (newToken: string) => void;
  resetState: () => void;
};

const intitialState: State = {
  accessToken: undefined,
  user: undefined,
};

const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set,
  get
) => ({
  auth: intitialState,
  setAuthUser: (state) => set(() => ({ auth: state })),
  setAccessToken: (newToken) =>
    set(() => ({ auth: { ...get().auth, accessToken: newToken } })),
  resetState: () => set(() => ({ auth: intitialState })),
});

export default createAuthSlice;
