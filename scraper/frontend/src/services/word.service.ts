import { QUERY_WORDS_KEY } from "@/constant/query.constant";
import {
  AddPluralsInput,
  AddSynonymsInput,
  RemoveWordsInput,
  WordsEntity,
  wordsSchema,
} from "@/schema/word.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryWords = (
  options?: UseQueryOptions<
    WordsEntity,
    AxiosError,
    WordsEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_WORDS_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/synonym-plural");
      return wordsSchema.parse({ words: res.data });
    },
    ...options,
  });
};

export function addSynonymMutation({ id, synonyms }: AddSynonymsInput) {
  return v1ApiClient.post(
    `/synonym-plural/synonyms/${id}`,
    JSON.stringify({ synonyms }),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
}

export function addPluralMutation({ id, plural }: AddPluralsInput) {
  return v1ApiClient.post(
    `/synonym-plural/plurals/${id}`,
    JSON.stringify({ plural }),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
}

export function deleteSynonymMutation({ id, words }: RemoveWordsInput) {
  return v1ApiClient.delete(`/synonym-plural/synonyms/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ words }),
  });
}

export function deletePluralMutation({ id, words }: RemoveWordsInput) {
  return v1ApiClient.delete(`/synonym-plural/plurals/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ words }),
  });
}
