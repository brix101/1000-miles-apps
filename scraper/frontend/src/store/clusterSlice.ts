import { ClusterEntity } from "@/schema/cluster.schema";
import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface InitialState {
  cluster: {
    isCreateOpen: boolean;
    toRemove?: ClusterEntity;
    toUpdate?: ClusterEntity;
  };
}

interface Actions {
  cluster: {
    setCreateOpen: (isCreateOpen: boolean) => void;
    setToRemove: (toRemove?: ClusterEntity) => void;
    setToUpdate: (toUpdate?: ClusterEntity) => void;
  };
}

export type ClusterSlice = InitialState & Actions;

const initialState: InitialState = {
  cluster: {
    isCreateOpen: false,
  },
};

const clusterSlice: StateCreator<StoreState, [], [], ClusterSlice> = (set) => ({
  cluster: {
    ...initialState.cluster,
    setCreateOpen: (isCreateOpen) =>
      set(({ cluster }) => ({
        cluster: { ...cluster, isCreateOpen },
      })),
    setToRemove: (toRemove) =>
      set(({ cluster }) => ({
        cluster: { ...cluster, toRemove },
      })),
    setToUpdate: (toUpdate) =>
      set(({ cluster }) => ({
        cluster: { ...cluster, toUpdate },
      })),
  },
});

export default clusterSlice;
