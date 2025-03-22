import { ProductEntity } from "@/schema/product.schema";
import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface InitialState {
  product: {
    productToModal?: ProductEntity;
    viewStyle: "list" | "grid";
  };
}

interface Actions {
  setProductToModal: (productToModal?: ProductEntity) => void;
  setViewState: (state: "list" | "grid") => void;
}

export type ProductSlice = InitialState & Actions;

const initialState: InitialState = {
  product: {
    productToModal: undefined,
    viewStyle: "list",
  },
};

const productSlice: StateCreator<StoreState, [], [], ProductSlice> = (set) => ({
  ...initialState,
  setProductToModal: (productToModal) =>
    set(({ product }) => ({
      product: { ...product, productToModal },
    })),
  setViewState: (viewState) =>
    set(({ product }) => ({
      product: { ...product, viewStyle: viewState },
    })),
});

export default productSlice;
