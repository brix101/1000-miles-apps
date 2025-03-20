import PageHeaderContainer from "@/components/container/page-header-Container";
import { marketplaceColumns } from "@/components/data-table/columns/marketplace-columns";
import { DataTable } from "@/components/data-table/data-table";
import useGetMarketplacesParticipations from "@/hooks/queries/useGetMarketplacesParticipations";

function Marketplaces() {
  const { data, isLoading } = useGetMarketplacesParticipations();

  return (
    <>
      <PageHeaderContainer>Settings - Marketplaces</PageHeaderContainer>
      <div id="marketplaces">
        <DataTable
          data={data ?? []}
          columns={marketplaceColumns}
          isLoading={isLoading}
          enableToolbar={false}
        />
      </div>
    </>
  );
}

export default Marketplaces;
