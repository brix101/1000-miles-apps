import { INSTANT_SEARCH_PRODUCTS } from "@/constant/algolia.constant";
import searchClient from "@/utils/searchClient";
import { ReactNode } from "react";
import { InstantSearch } from "react-instantsearch-hooks";

interface Props {
  children: ReactNode;
}

function ProductInstasearchContainer({ children }: Props) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={INSTANT_SEARCH_PRODUCTS}
      routing
      insights={{
        insightsInitParams: {
          useCookie: true,
        },
      }}
    >
      {children}
    </InstantSearch>
  );
}

export default ProductInstasearchContainer;
