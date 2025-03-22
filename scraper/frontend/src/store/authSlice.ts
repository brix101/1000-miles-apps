import { SignInResponseSchema } from "@/schema/auth.schema";
import { UserEntity } from "@/schema/user.schema";
import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface State {
  auth: { accessToken?: string; user?: UserEntity };
}

interface Actions {
  setAuthTokenUser: (signInResponse: SignInResponseSchema) => void;
  setAuthUser: (user?: UserEntity) => void;
  logout: () => void;
}

export type AuthSlice = State & Actions;

const initialState: State = {
  auth: { accessToken: undefined, user: undefined },
};

const authSlice: StateCreator<StoreState, [], [], AuthSlice> = (set) => ({
  ...initialState,
  setAuthTokenUser: (signInReponse) =>
    set(() => ({
      auth: {
        accessToken: signInReponse.access_token,
        user: signInReponse.user,
      },
    })),
  setAuthUser: (user) => set(({ auth }) => ({ auth: { ...auth, user } })),
  logout: () => set(() => ({ ...initialState })),
});

export default authSlice;
