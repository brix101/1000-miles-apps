import { Icons } from "@/assets/icons";
import LoadingContent from "@/components/loader/LoadingContent";
import { QUERY_EXCLUDED_WORDS_KEY } from "@/constant/query.constant";
import { ResponseError } from "@/schema/error.schema";
import {
  AddExcludedWordInput,
  ExludedWordEntity,
  ExludedWordsEntity,
  addExludedWordSchema,
  excludedWordsSchema,
} from "@/schema/exludedWord.schema";
import {
  addExludedWordMutation,
  deleteExcludedWordMutation,
  useQueryExcludedWords,
} from "@/services/exludedWord.service";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

function ExcludedWords() {
  const { data, isLoading, error } = useQueryExcludedWords();

  if (error && error.code?.includes("ERR_NETWORK")) {
    throw error;
  }

  const words = data?.words?.map((word, index) => (
    <WordBadge key={index} word={word} />
  ));

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Excluded Tags</h3>
        </div>
      </div>
      {isLoading ? (
        <LoadingContent />
      ) : (
        <div className="row">
          <div className="col-12 col-lg-6">
            <AddExludedWords />
            <div className="card-body pb-2">
              {/* <label className="fw-2 fw-black text-uppercase">Synonyms</label> */}
              <div
                className="form-control bg-white"
                style={{
                  height: "80vh",
                }}
              >
                {words}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function WordBadge({ word }: { word: ExludedWordEntity }) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteExcludedWordMutation,
    onSuccess: () => {
      queryClient.setQueriesData(
        [QUERY_EXCLUDED_WORDS_KEY],
        (prev: unknown) => {
          const { words } = prev as ExludedWordsEntity;
          const upatedWords = words.filter((item) => item.id !== word.id);

          return { words: upatedWords };
        }
      );
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function handleRemoveClick() {
    mutate(word.id ?? "");
  }

  return (
    <div className="badge badge-tag-custom me-1 mb-1">
      <span className="m-1">{word.word}</span>
      <button
        className="btn-icon-custom"
        onClick={handleRemoveClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm text-dark"
            style={{ height: 10, width: 10 }}
          ></span>
        ) : (
          <Icons.UMultiply height={12} width={12} />
        )}
      </button>
    </div>
  );
}

function AddExludedWords() {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddExcludedWordInput>({
    resolver: zodResolver(addExludedWordSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addExludedWordMutation,
    onSuccess: (response) => {
      const data = excludedWordsSchema.parse({ words: response.data });
      queryClient.setQueriesData(
        [QUERY_EXCLUDED_WORDS_KEY],
        (prev: unknown) => {
          const { words } = prev as ExludedWordsEntity;
          const updatedWords = words.concat(data.words);

          return { words: updatedWords };
        }
      );

      reset();
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function onSubmit(values: AddExcludedWordInput) {
    mutate(values);
  }

  return (
    <form className="card-body row" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-9">
        <div className="text-start w-100">
          <input
            className={`form-control ${errors.words ? "is-invalid" : ""}`}
            type="text"
            placeholder="Input words here..."
            {...register("words")}
          />
          <div className="p-1">
            <ErrorMessage
              errors={errors}
              name="words"
              render={({ message }) => (
                <div className="invalid-input">{message}</div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="col-3">
        <button
          className="btn btn-primary float-end w-full white-space-nowrap w-full"
          type="submit"
          disabled={isLoading}
        >
          Exlude Tags
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm text-dark"
              style={{ height: 16, width: 16 }}
            ></span>
          ) : (
            <></>
          )}
        </button>
      </div>
    </form>
  );
}

export default ExcludedWords;
