import { QUERY_EXCLUDED_WORDS_KEY } from "@/constant/query.constant";
import {
  AddExcludedWordInput,
  ExludedWordsEntity,
  excludedWordsSchema,
} from "@/schema/exludedWord.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const getExcludedWords = async () => {
  const res = await v1ApiClient.get("/excluded-words");
  return excludedWordsSchema.parse({ words: res.data });
};

export const useQueryExcludedWords = (
  options?: UseQueryOptions<
    ExludedWordsEntity,
    AxiosError,
    ExludedWordsEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_EXCLUDED_WORDS_KEY],
    queryFn: getExcludedWords,
    ...options,
  });
};

export function addExludedWordMutation({ words }: AddExcludedWordInput) {
  return v1ApiClient.post("/excluded-words", JSON.stringify({ words }), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

export function deleteExcludedWordMutation(id: string) {
  return v1ApiClient.delete(`/excluded-words/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
}
