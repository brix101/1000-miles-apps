import PageHeaderContainer from "@/components/container/page-header-Container";
import { companyColumns } from "@/components/data-table/columns/company-columns";
import { DataTable } from "@/components/data-table/data-table";
import useGetCompanies from "@/hooks/queries/useGetCompanies";

function Companies() {
  const { data, isLoading } = useGetCompanies();

  return (
    <>
      <PageHeaderContainer>Settings - Companies</PageHeaderContainer>
      <div id="members">
        <DataTable
          data={data ?? []}
          columns={companyColumns}
          isLoading={isLoading}
          searchPlaceHolder="Search Company..."
        />
      </div>
    </>
  );
}

export default Companies;
