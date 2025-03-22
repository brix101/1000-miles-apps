import { CustomerEntity } from "@/schema/customer.schema";
import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface InitialState {
  customer: {
    toDeactivate?: CustomerEntity;
  };
}

interface Actions {
  customer: {
    setToDeactivate: (toDeactivate?: CustomerEntity) => void;
  };
}

export type CustomerSlice = InitialState & Actions;

const initialState: InitialState = {
  customer: {
    toDeactivate: undefined,
  },
};

const customerSlice: StateCreator<StoreState, [], [], CustomerSlice> = (
  set
) => ({
  ...initialState,
  customer: {
    setToDeactivate: (toDeactivate) =>
      set(({ customer }) => ({
        customer: { ...customer, toDeactivate },
      })),
  },
});

export default customerSlice;
