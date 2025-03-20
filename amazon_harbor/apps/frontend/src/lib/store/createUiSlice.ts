import { StoreState } from "@/lib/store";
import { StateCreator } from "zustand";

interface State {
  isSideBarCollapse: boolean;
  isSideBarShow: boolean;
}

export type UISlice = {
  ui: State;
} & {
  toggleSideBar: () => void;
  toggleSideBarShow: (state?: boolean) => void;
};

const initialState: State = {
  isSideBarCollapse: false,
  isSideBarShow: false,
};

const createUiSlice: StateCreator<StoreState, [], [], UISlice> = (
  set,
  get
) => ({
  ui: initialState,
  toggleSideBar: () =>
    set(({ ui }) => ({
      ui: { ...ui, isSideBarCollapse: !get().ui.isSideBarCollapse },
    })),
  toggleSideBarShow: (state) =>
    set(({ ui }) => ({
      ui: { ...ui, isSideBarShow: state ?? !get().ui.isSideBarShow },
    })),
});

export default createUiSlice;
