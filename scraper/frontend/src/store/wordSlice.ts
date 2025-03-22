import { WordEntity } from "@/schema/word.schema";
import { StoreState } from "@/store";
import { StateCreator } from "zustand";

interface InitialState {
  word: {
    wordToModal?: WordEntity;
  };
}

interface Actions {
  setWordToModal: (wordToModal?: WordEntity) => void;
}

export type WordSlice = InitialState & Actions;

const initialState: InitialState = {
  word: {
    wordToModal: undefined,
  },
};

const wordSlice: StateCreator<StoreState, [], [], WordSlice> = (set) => ({
  ...initialState,
  setWordToModal: (wordToModal) =>
    set(({ word }) => ({
      word: { ...word, wordToModal },
    })),
});

export default wordSlice;
