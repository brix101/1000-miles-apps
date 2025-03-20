import { create } from "zustand";
import { DevtoolsOptions, devtools, persist } from "zustand/middleware";

import { StoreState } from "@/lib/store";
import createAuthSlice from "@/lib/store/createAuthSlice";
import createDialogSlice from "@/lib/store/createDialogSlice";
import createUiSlice from "@/lib/store/createUiSlice";

const devtoolsOptions: DevtoolsOptions = { name: "Amazon Harbor" };

const useBoundStore = create<StoreState>()(
  devtools(
    persist(
      (...args) => ({
        ...createUiSlice(...args),
        ...createAuthSlice(...args),
        ...createDialogSlice(...args),
      }),
      {
        name: "amazon-harbor",
        partialize: ({ ui, auth: { accessToken } }) => ({
          ui,
          auth: { accessToken },
        }),
      }
    ),
    devtoolsOptions
  )
);

export default useBoundStore;
