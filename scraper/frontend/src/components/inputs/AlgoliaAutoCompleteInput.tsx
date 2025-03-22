import { INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE } from "@/constant/algolia.constant";
import type { BaseItem } from "@algolia/autocomplete-core";
import { AutocompleteOptions, autocomplete } from "@algolia/autocomplete-js";
import {
  CreateQuerySuggestionsPluginParams,
  createQuerySuggestionsPlugin,
} from "@algolia/autocomplete-plugin-query-suggestions";
import { AutocompleteQuerySuggestionsHit } from "@algolia/autocomplete-plugin-query-suggestions/dist/esm/types";
import {
  CreateRecentSearchesLocalStorageOptions,
  createLocalStorageRecentSearchesPlugin,
} from "@algolia/autocomplete-plugin-recent-searches";
import { RecentSearchesItem } from "@algolia/autocomplete-plugin-recent-searches/dist/esm/types";
import { debounce } from "@algolia/autocomplete-shared";
import "@algolia/autocomplete-theme-classic";
import { SearchOptions } from "instantsearch.js/es/types";

import {
  Fragment,
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import { unmountComponentAtNode } from "react-dom";
import { Root, createRoot } from "react-dom/client";
import {
  useHierarchicalMenu,
  usePagination,
  useSearchBox,
} from "react-instantsearch-hooks-web";

export type SetInstantSearchUiStateOptions = {
  query: string;
  category?: string;
};

export type ComponentProps = Partial<AutocompleteOptions<BaseItem>> & {
  recentSearchesOptions: CreateRecentSearchesLocalStorageOptions<RecentSearchesItem>;
  suggestionOptions: CreateQuerySuggestionsPluginParams<AutocompleteQuerySuggestionsHit>;
};

const AlgoliaAutoCompleteInput: React.FC<ComponentProps> = ({
  recentSearchesOptions,
  suggestionOptions,
  ...autocompleteProps
}: ComponentProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRootRef = useRef<Root | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const { query, refine: setQuery } = useSearchBox();
  const { items: categories, refine: setCategory } = useHierarchicalMenu({
    attributes: [
      "hierarchicalCategories.lvl0",
      "hierarchicalCategories.lvl1",
      "hierarchicalCategories.lvl2",
    ],
  });
  const { refine: setPage } = usePagination();

  const [instantSearchUiState, setInstantSearchUiState] =
    useState<SetInstantSearchUiStateOptions>({ query });

  const debouncedSetInstantSearchUiState = debounce(
    setInstantSearchUiState,
    500
  );

  const currentCategory = useMemo(
    () => categories.find(({ isRefined }) => isRefined)?.value,
    [categories]
  );

  const plugins = useMemo(() => {
    const recentSearches = createLocalStorageRecentSearchesPlugin({
      ...recentSearchesOptions,
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }) {
            setInstantSearchUiState({
              query: item.label,
              category: item.category,
            });
          },
        };
      },
    });

    const querySuggestionsInCategory = createQuerySuggestionsPlugin({
      ...suggestionOptions,
      getSearchParams() {
        return recentSearches.data?.getAlgoliaSearchParams({
          hitsPerPage: 5,
          facetFilters: [
            `${recentSearchesOptions.key}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE}:-${currentCategory}`,
          ],
        }) as SearchOptions;
      },
      transformSource({ source }) {
        return {
          ...source,
          sourceId: "querySuggestionsInCategoryPlugin",
          onSelect({ item }) {
            setInstantSearchUiState({
              query: item.query,
              category: item.__autocomplete_qsCategory,
            });
          },
          getItems(params) {
            if (!currentCategory) {
              return [];
            }

            return source.getItems(params);
          },
          templates: {
            ...source.templates,
            header({ items }) {
              if (items.length === 0) {
                return <Fragment />;
              }

              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">
                    In {currentCategory}
                  </span>
                  <span className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
          },
        };
      },
    });

    const querySuggestions = createQuerySuggestionsPlugin({
      ...suggestionOptions,
      getSearchParams() {
        if (!currentCategory) {
          return recentSearches.data?.getAlgoliaSearchParams({
            hitsPerPage: 6,
          }) as SearchOptions;
        }

        return recentSearches.data?.getAlgoliaSearchParams({
          hitsPerPage: 5,
          facetFilters: [
            `${recentSearchesOptions.key}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE}:-${currentCategory}`,
          ],
        }) as SearchOptions;
      },
      categoryAttribute: [
        recentSearchesOptions.key,
        "facets",
        "exact_matches",
        INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE,
      ],
      transformSource({ source }) {
        return {
          ...source,
          sourceId: "querySuggestionsPlugin",
          onSelect({ item }) {
            setInstantSearchUiState({
              query: item.query,
              category: item.__autocomplete_qsCategory || "",
            });
          },
          getItems(params) {
            if (!params.state.query) {
              return [];
            }

            return source.getItems(params);
          },
          templates: {
            ...source.templates,
            header({ items }) {
              if (!currentCategory || items.length === 0) {
                return <Fragment />;
              }

              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">
                    In other categories
                  </span>
                  <span className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
          },
        };
      },
    });

    return [recentSearches, querySuggestionsInCategory, querySuggestions];
  }, [currentCategory, recentSearchesOptions, suggestionOptions]);

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    instantSearchUiState.category && setCategory(instantSearchUiState.category);
    setPage(0);
  }, [instantSearchUiState, setQuery, setCategory, setPage]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      container: containerRef.current,
      initialState: { query },
      insights: true,
      openOnFocus: true,
      plugins,
      classNames: {
        form: "algolia-search-form",
      },
      onReset() {
        setInstantSearchUiState({ query: "", category: currentCategory });
      },
      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
      },
      onStateChange({ prevState, state }) {
        if (prevState.query !== state.query) {
          debouncedSetInstantSearchUiState({
            query: state.query,
          });
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
    });

    return () => {
      autocompleteInstance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugins]);

  return <div ref={containerRef} />;
};
export default AlgoliaAutoCompleteInput;
