import { Icons } from "@/assets/icons";
import { QUERY_WORDS_KEY } from "@/constant/query.constant";
import { ResponseError } from "@/schema/error.schema";
import {
  AddPluralsInput,
  AddSynonymsInput,
  WordEntity,
  WordsEntity,
  addPluralsSchema,
  addSynonymsSchema,
  wordSchema,
} from "@/schema/word.schema";
import {
  addPluralMutation,
  addSynonymMutation,
  deletePluralMutation,
  deleteSynonymMutation,
} from "@/services/word.service";
import { useBoundStore } from "@/store";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

function WordModal({ words }: { words: WordEntity[] }) {
  const {
    word: { wordToModal },
    setWordToModal,
  } = useBoundStore();
  const show = Boolean(wordToModal);

  const currentIndex = wordToModal
    ? words.findIndex((item) => item.id === wordToModal.id)
    : -1;

  function handlePrevClick() {
    if (currentIndex >= 0) {
      setWordToModal(words[currentIndex - 1]);
    }
  }

  function handleNextClick() {
    if (currentIndex >= 0) {
      setWordToModal(words[currentIndex + 1]);
    }
  }

  const itemSynonyms = wordToModal?.synonyms.map((synonym, index) => (
    <SynonymBadge key={index} id={wordToModal.id ?? ""} synonym={synonym} />
  ));

  const itemPlurals = wordToModal?.plural?.map((plural, index) => (
    <PluralBadge key={index} id={wordToModal.id ?? ""} plural={plural} />
  ));

  return (
    <Modal
      show={show}
      onHide={() => setWordToModal(undefined)}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body
        as="div"
        className="row py-5 px-7 position-relative d-flex justify-content-center align-items-start"
        style={{ minHeight: "40rem" }}
      >
        <button
          className="btn-close border"
          style={{
            position: "absolute",
            top: "20px",
            right: "40px",
          }}
          onClick={() => setWordToModal(undefined)}
        />
        {/* Prev Button */}
        <button
          className="btn-gallery-custom btn-link"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateX(-100%)",
            left: 0,
          }}
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
        >
          <Icons.FiChevronLeft width={40} height={40} />
        </button>
        {/* Next Button */}
        <button
          className="btn-gallery-custom btn-link"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateX(100%)",
            right: 0,
          }}
          onClick={handleNextClick}
          disabled={currentIndex === words.length - 1}
        >
          <Icons.FiChevronRight width={40} height={40} />
        </button>
        <div className="" style={{ height: 45 }}>
          <h3 className="row text-uppercase">{wordToModal?.word}</h3>
          <h6 className="row text-capitalize">{wordToModal?.language.name}</h6>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6 pb-10">
            <div className="card-body pb-2">
              <label className="fw-2 fw-black text-uppercase">Synonyms</label>
              <div
                className="form-control"
                style={{
                  backgroundColor: "var(--phoenix-body-bg)",
                  height: "25rem",
                }}
              >
                {itemSynonyms}
              </div>
            </div>
            <AddSynonym id={wordToModal?.id ?? ""} />
          </div>
          <div className="col-12 col-lg-6 ">
            <div className="card-body pb-2">
              <label className="fw-2 fw-black text-uppercase">PLURALS</label>
              <div
                className="form-control"
                style={{
                  backgroundColor: "var(--phoenix-body-bg)",
                  height: "25rem",
                }}
              >
                {itemPlurals}
              </div>
            </div>
            <AddPlural id={wordToModal?.id ?? ""} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function SynonymBadge({ id, synonym }: { id: string; synonym: string }) {
  const { setWordToModal } = useBoundStore();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteSynonymMutation,
    onSuccess: (response) => {
      const word = wordSchema.parse(response.data);
      setWordToModal(word);
      queryClient.setQueriesData([QUERY_WORDS_KEY], (prev: unknown) => {
        const { words } = prev as WordsEntity;
        const upatedWords = words.map((item) => {
          if (item.id === id) {
            return word;
          }
          return item;
        });

        return { words: upatedWords };
      });
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function handleRemoveClick() {
    mutate({ id, words: [synonym] });
  }

  return (
    <div className="badge badge-tag-custom me-1 mb-1">
      <span className="m-1">{synonym}</span>
      <button
        className="btn-icon-custom"
        onClick={handleRemoveClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm text-dark"
            style={{ height: 16, width: 16 }}
          ></span>
        ) : (
          <Icons.UMultiply height={12} width={12} />
        )}
      </button>
    </div>
  );
}

function PluralBadge({ id, plural }: { id: string; plural: string }) {
  const { setWordToModal } = useBoundStore();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: deletePluralMutation,
    onSuccess: (response) => {
      const word = wordSchema.parse(response.data);
      setWordToModal(word);
      queryClient.setQueriesData([QUERY_WORDS_KEY], (prev: unknown) => {
        const { words } = prev as WordsEntity;
        const upatedWords = words.map((item) => {
          if (item.id === id) {
            return word;
          }
          return item;
        });

        return { words: upatedWords };
      });
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function handleRemoveClick() {
    mutate({ id, words: [plural] });
  }

  return (
    <div className="badge badge-tag-custom me-1 mb-1">
      <span className="m-1">{plural}</span>
      <button
        className="btn-icon-custom"
        onClick={handleRemoveClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm text-dark"
            style={{ height: 16, width: 16 }}
          ></span>
        ) : (
          <Icons.UMultiply height={12} width={12} />
        )}
      </button>
    </div>
  );
}

function AddSynonym({ id }: { id: string }) {
  const { setWordToModal } = useBoundStore();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<AddSynonymsInput>({
    resolver: zodResolver(addSynonymsSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addSynonymMutation,
    onSuccess: (response) => {
      const word = wordSchema.parse(response.data);
      setWordToModal(word);
      queryClient.setQueriesData([QUERY_WORDS_KEY], (prev: unknown) => {
        const { words } = prev as WordsEntity;
        const upatedWords = words.map((item) => {
          if (item.id === id) {
            return word;
          }
          return item;
        });

        return { words: upatedWords };
      });

      reset();
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function onSubmit(values: AddSynonymsInput) {
    mutate(values);
  }

  useEffect(() => {
    clearErrors();
    reset({ id });
  }, [id, clearErrors, reset]);

  return (
    <form className="card-body row" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-9">
        <div className="text-start">
          <input
            className={`form-control ${errors.synonyms ? "is-invalid" : ""}`}
            type="text"
            placeholder="Input synonyms here..."
            {...register("synonyms")}
          />
          <div className="p-1">
            <ErrorMessage
              errors={errors}
              name="synonyms"
              render={({ message }) => (
                <div className="invalid-input">{message}</div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="col-3">
        <button
          className="btn btn-primary ms-auto float-end"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm text-dark"
              style={{ height: 16, width: 16 }}
            ></span>
          ) : (
            <>Add</>
          )}
        </button>
      </div>
    </form>
  );
}

function AddPlural({ id }: { id: string }) {
  const { setWordToModal } = useBoundStore();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<AddPluralsInput>({
    resolver: zodResolver(addPluralsSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addPluralMutation,
    onSuccess: (response) => {
      const word = wordSchema.parse(response.data);
      console.log({ response: word.id });
      console.log(word);
      setWordToModal(word);
      queryClient.setQueriesData([QUERY_WORDS_KEY], (prev: unknown) => {
        const { words } = prev as WordsEntity;
        const upatedWords = words.map((item) => {
          if (item.id === id) {
            return word;
          }
          return item;
        });

        return { words: upatedWords };
      });

      reset();
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function onSubmit(values: AddPluralsInput) {
    mutate(values);
  }

  useEffect(() => {
    clearErrors();
    reset({ id });
  }, [id, clearErrors, reset]);

  return (
    <form className="card-body row" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-9">
        <div className="text-start">
          <input
            className={`form-control ${errors.plural ? "is-invalid" : ""}`}
            type="text"
            placeholder="Input plurals here..."
            {...register("plural")}
          />
          <div className="p-1">
            <ErrorMessage
              errors={errors}
              name="plural"
              render={({ message }) => (
                <div className="invalid-input">{message}</div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="col-3">
        <button
          className="btn btn-primary ms-auto float-end"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm text-dark"
              style={{ height: 16, width: 16 }}
            ></span>
          ) : (
            <>Add</>
          )}
        </button>
      </div>
    </form>
  );
}

export default WordModal;
