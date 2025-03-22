import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface State {
  user: { selectedUser: Array<string>; toDeactivate: Array<string> };
}

interface Actions {
  addToSelectedUser: (ids: Array<string>) => void;
  removeToSelectedUser: (ids: Array<string>) => void;
  resetSelectedUser: () => void;
  addToDeactivateUser: (ids: Array<string>) => void;
  resetToDeactivateUser: () => void;
}

export type UserSlice = State & Actions;

const initialState: State = {
  user: { selectedUser: [], toDeactivate: [] },
};

const userSlice: StateCreator<StoreState, [], [], UserSlice> = (set) => ({
  ...initialState,
  addToSelectedUser: (ids) =>
    set(({ user }) => ({
      user: { ...user, selectedUser: user.selectedUser.concat(ids) },
    })),
  removeToSelectedUser: (ids) =>
    set(({ user }) => ({
      user: {
        ...user,
        selectedUser: user.selectedUser.filter((id) => !ids.includes(id)),
      },
    })),
  resetSelectedUser: () =>
    set(({ user }) => ({
      user: { ...user, selectedUser: [] },
    })),
  addToDeactivateUser: (ids) =>
    set(({ user }) => ({
      user: { ...user, toDeactivate: user.toDeactivate.concat(ids) },
    })),
  resetToDeactivateUser: () =>
    set(({ user }) => ({
      user: { ...user, toDeactivate: [] },
    })),
});

export default userSlice;
