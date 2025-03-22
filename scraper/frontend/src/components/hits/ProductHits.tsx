import ProductGridView from "@/components/ProductGirdView";
import ProductModal from "@/components/modals/ProductModal";
import ProductsTable from "@/components/tables/ProductsTable";
import { ExludedWordEntity } from "@/schema/exludedWord.schema";
import { ProductEntity } from "@/schema/product.schema";
import { useQueryExcludedWords } from "@/services/exludedWord.service";
import { useBoundStore } from "@/store";
import { RefinementListRenderState } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { createContext } from "react";
import { useHits, useRefinementList } from "react-instantsearch-hooks-web";

// Define the type for the context value
type ProductHitsContextType = {
  tagsRefinement?: RefinementListRenderState;
  categoriesRefinement?: RefinementListRenderState;
  scrapercategoriesRefinement?: RefinementListRenderState;
  products: AlgoliaHit<ProductEntity>[];
  excludedWords: ExludedWordEntity[];
};

// Create the context for tagsRefinement
export const ProductHitsContext = createContext<ProductHitsContextType>({
  tagsRefinement: undefined,
  categoriesRefinement: undefined,
  scrapercategoriesRefinement: undefined,
  products: [],
  excludedWords: [],
});

function ProductHits() {
  const { hits } = useHits<ProductEntity>();
  const tagsRefinement = useRefinementList({
    attribute: "tags",
  });
  const categoriesRefinement = useRefinementList({
    attribute: "categories.name",
  });

  const scrapercategoriesRefinement = useRefinementList({
    attribute: "scraper_categories.name",
  });

  const { data: wordsData } = useQueryExcludedWords();

  const {
    product: { viewStyle },
  } = useBoundStore();

  // Create the context value object
  const contextValue: ProductHitsContextType = {
    tagsRefinement,
    categoriesRefinement,
    scrapercategoriesRefinement,
    products: hits,
    excludedWords: wordsData?.words ?? [],
  };

  return (
    <ProductHitsContext.Provider value={{ ...contextValue }}>
      <>
        {viewStyle === "list" ? <ProductsTable /> : <ProductGridView />}

        <ProductModal />
      </>
    </ProductHitsContext.Provider>
  );
}

export default ProductHits;
