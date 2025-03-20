import PageHeaderContainer from "@/components/container/page-header-Container";
import { listingBrandColumns } from "@/components/data-table/columns/listing-brand-columns";
import { DataTable } from "@/components/data-table/data-table";
import useGetBrandsMarketplaces from "@/hooks/queries/useGetBrandsMarketplaces";

function Brands() {
  const { data, isLoading } = useGetBrandsMarketplaces();

  return (
    <>
      <PageHeaderContainer>Brands</PageHeaderContainer>
      <div id="listing-brands">
        <DataTable
          data={data ?? []}
          columns={listingBrandColumns}
          isLoading={isLoading}
          enableToolbar={false}
          enableTablePagination={false}
        />
      </div>
    </>
  );
}

export default Brands;
