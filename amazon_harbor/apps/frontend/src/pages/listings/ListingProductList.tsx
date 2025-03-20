import PageHeaderContainer from "@/components/container/page-header-Container";
import { listingProductColumns } from "@/components/data-table/columns/listing-product-columns";
import { DataTable } from "@/components/data-table/data-table";
import BrandSearchSelect from "@/components/search-select/brand-search-select";
import ProductStatusSearchSelect from "@/components/search-select/product-status-search-select";
import { defaultBrand, defaultProductStatus } from "@/contant/index.constant";
import useGetListingsProducts from "@/hooks/queries/useGetListingsProducts";
import { useSearchParams } from "react-router-dom";

function ListingProductList() {
  const [searchParams] = useSearchParams();
  const brand = searchParams.get("brand") ?? defaultBrand;
  const status = searchParams.get("status") ?? defaultProductStatus;

  const { data, isLoading } = useGetListingsProducts({
    brand,
    status,
  });

  return (
    <>
      <PageHeaderContainer>Listings - Product List</PageHeaderContainer>
      <div className="row">
        <div className="col-3">
          <BrandSearchSelect />
        </div>
        <div className="col-5">
          <ProductStatusSearchSelect />
        </div>
      </div>
      <div id="listing-brands">
        <DataTable
          data={data ?? []}
          columns={listingProductColumns}
          isLoading={isLoading}
          enableToolbar={false}
        />
      </div>
    </>
  );
}

export default ListingProductList;
