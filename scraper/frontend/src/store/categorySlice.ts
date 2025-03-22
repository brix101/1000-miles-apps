import { NestedCategoryEntity } from "@/schema/category.schema";
import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface InitialState {
  category: {
    isAddOpen: boolean;
    toRemove?: NestedCategoryEntity;
    toUpdate?: NestedCategoryEntity;
    toUpdateParent?: NestedCategoryEntity;
  };
}

interface Actions {
  category: {
    setAddOpen: (isAddOpen: boolean) => void;
    setToRemove: (toRemove?: NestedCategoryEntity) => void;
    setToUpdate: (toUpdate?: NestedCategoryEntity) => void;
    setToUpdateParent: (toUpdateParent?: NestedCategoryEntity) => void;
  };
}

export type CategorySlice = InitialState & Actions;

const initialState: InitialState = {
  category: {
    isAddOpen: false,
  },
};

const categorySlice: StateCreator<StoreState, [], [], CategorySlice> = (
  set
) => ({
  category: {
    ...initialState.category,
    setAddOpen: (isAddOpen) =>
      set(({ category }) => ({
        category: { ...category, isAddOpen },
      })),
    setToRemove: (toRemove) =>
      set(({ category }) => ({
        category: { ...category, toRemove },
      })),
    setToUpdate: (toUpdate) =>
      set(({ category }) => ({
        category: { ...category, toUpdate },
      })),
    setToUpdateParent: (toUpdateParent) =>
      set(({ category }) => ({
        category: { ...category, toUpdateParent: toUpdateParent },
      })),
  },
});

export default categorySlice;
