import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import authSlice, { AuthSlice } from "./authSlice";
import categorySlice, { CategorySlice } from "./categorySlice";
import clusterSlice, { ClusterSlice } from "./clusterSlice";
import customerSlice, { CustomerSlice } from "./customerSlice";
import productSlice, { ProductSlice } from "./productSlice";
import uiSlice, { UISlice } from "./uiSlice";
import userSlice, { UserSlice } from "./userSlice";
import wordSlice, { WordSlice } from "./wordSlice";

type UnionToIntersection<U> = (
  U extends infer T ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type StoreState = UnionToIntersection<
  | AuthSlice
  | CustomerSlice
  | ProductSlice
  | UISlice
  | UserSlice
  | WordSlice
  | CategorySlice
  | ClusterSlice
>;

const useBoundStore = create<StoreState>()(
  devtools(
    persist(
      (...args) => ({
        ...authSlice(...args),
        ...customerSlice(...args),
        ...productSlice(...args),
        ...uiSlice(...args),
        ...userSlice(...args),
        ...wordSlice(...args),
        ...categorySlice(...args),
        ...clusterSlice(...args),
      }),
      {
        name: "scraper",
        partialize: ({
          product: { viewStyle },
          ui: { isSideBarCollapse, isTopBarCollapse },
          auth: { accessToken },
        }) => ({
          product: { viewStyle },
          ui: { isSideBarCollapse, isTopBarCollapse },
          auth: { accessToken },
        }),
      }
    )
  )
);
export { useBoundStore };
