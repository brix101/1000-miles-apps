import PageHeaderContainer from "@/components/container/page-header-Container";
import { procurementProductColumns } from "@/components/data-table/columns/procurement-product-columns";
import { DataTable } from "@/components/data-table/data-table";
import ReportInventoryButton from "@/components/report-inventory-button";
import BrandSearchSelect from "@/components/search-select/brand-search-select";
import MarketplaceSearchSelect from "@/components/search-select/marketplaces-search-select";
import ProductStatusSearchSelect from "@/components/search-select/product-status-search-select";
import {
  defaultBrand,
  defaultMarketplace,
  defaultProductStatus,
} from "@/contant/index.constant";
import useGetProcurementProducts from "@/hooks/queries/useGetProcurementProducts";
import { IProcurementProductsQuery } from "@/services/procurement.service";
import { useSearchParams } from "react-router-dom";

function ProcurementProductList() {
  const [searchParams] = useSearchParams();
  const brand = searchParams.get("brand") ?? defaultBrand;
  const marketplace = searchParams.get("marketplace") ?? defaultMarketplace;
  const status = searchParams.get("status") ?? defaultProductStatus;

  const query: IProcurementProductsQuery = {
    brand,
    marketplace,
    status,
  };
  const { data, isLoading, isFetching } = useGetProcurementProducts(query);

  return (
    <>
      <div className="d-flex justify-content-between">
        <PageHeaderContainer>Procurement - Product List</PageHeaderContainer>
        <div>
          <ReportInventoryButton query={query} />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <BrandSearchSelect />
        </div>
        <div className="col-4">
          <MarketplaceSearchSelect />
        </div>
        <div className="col-5">
          <ProductStatusSearchSelect />
        </div>
      </div>
      <div id="procurement-products">
        <DataTable
          data={data ?? []}
          columns={procurementProductColumns}
          isLoading={isLoading || isFetching}
          enableToolbar={false}
        />
      </div>
      {/* <DummyProductList /> */}
    </>
  );
}

export default ProcurementProductList;
