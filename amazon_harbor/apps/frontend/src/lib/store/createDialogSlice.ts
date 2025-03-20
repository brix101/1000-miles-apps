import { StoreState } from "@/lib/store";
import { ReactNode } from "react";
import { StateCreator } from "zustand";

export interface State {
  item?: ReactNode;
  size?: "sm" | "lg" | "xl";
}

export type DialogSlice = {
  dialog: State;
} & {
  setDialogItem: (state: State) => void;
  closeDialog: () => void;
};

const intitialState: State = {
  item: undefined,
  size: "sm",
};

const createDialogSlice: StateCreator<StoreState, [], [], DialogSlice> = (
  set,
  get
) => ({
  dialog: intitialState,
  setDialogItem: (state) => set(() => ({ ...get(), dialog: state })),
  closeDialog: () => set(() => ({ ...get(), dialog: intitialState })),
});

export default createDialogSlice;
