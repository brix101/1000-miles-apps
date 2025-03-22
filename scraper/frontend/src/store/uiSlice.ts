import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface InitialState {
  ui: {
    isSideBarCollapse: boolean;
    isTopBarCollapse: boolean;
  };
}

interface Actions {
  setSideBarCollapse: (isSideBarCollapse: boolean) => void;
  setTopBarCollapse: (isTopBarCollapse: boolean) => void;
}

export type UISlice = InitialState & Actions;

const initialState: InitialState = {
  ui: {
    isSideBarCollapse: false,
    isTopBarCollapse: false,
  },
};

const uiSlice: StateCreator<StoreState, [], [], UISlice> = (set) => ({
  ...initialState,
  setSideBarCollapse: (isSideBarCollapse) =>
    set(({ ui }) => ({
      ui: { ...ui, isSideBarCollapse },
    })),
  setTopBarCollapse: (isTopBarCollapse) =>
    set(({ ui }) => ({
      ui: { ...ui, isTopBarCollapse },
    })),
});

export default uiSlice;
