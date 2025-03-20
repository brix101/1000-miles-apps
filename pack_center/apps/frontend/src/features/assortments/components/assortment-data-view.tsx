import { ConditionalShell } from '@/components/conditional-shell';
import { DataTable } from '@/components/data-table/data-table';
import { FilterInput } from '@/components/filter-input';
import { LoadMoreButton } from '@/components/load-more-button';
import { ViewStyleButton } from '@/components/view-style-button';
import { useTypedSearchParams } from '@/hooks/useTypedSearchParams';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Assortment, assortmentTableColumns } from '..';
import { useGetInfiniteAssortment } from '../api/getAssortments';
import { AssortmentCard } from './assortment-card';
import { AssortmentStatusFilter } from './assortment-status-filter';
import { AssortmentTablePagination } from './assortment-table-pagination';

interface AssortmentDataViewProps {
  dataQuery: ReturnType<typeof useGetInfiniteAssortment>;
}

export function AssortmentDataView({ dataQuery }: AssortmentDataViewProps) {
  const { t } = useTranslation();

  const { params, setParams } = useTypedSearchParams();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
  } = dataQuery;

  const { allItems, pageCount, statusCount } = React.useMemo(() => {
    const allItems = data?.pages.flatMap((page) => page.items) || [];
    const pageCount = data?.pages?.[0]?.totalPages || 1;
    const statusCount = data?.pages?.[0]?.statusCount || {};
    return { allItems, pageCount, statusCount };
  }, [data]);

  const items = React.useMemo(() => {
    if (params.status === 'all') {
      return allItems;
    } else {
      return allItems.filter((item) => item.status === params.status);
    }
  }, [allItems, params.status]);

  return (
    <>
      <div className="row mb-4">
        <div className="col-8 d-flex">
          <div className="col-6">
            <FilterInput placeholder={t('keyPlaceholder_search')} />
          </div>
          <div className="col-4 d-flex align-items-center">
            <AssortmentStatusFilter statusCounts={statusCount} />
          </div>
        </div>
        <div className="col-4 d-flex justify-content-end">
          <ViewStyleButton />
        </div>
      </div>

      <div id="assortments">
        <ConditionalShell condition={params.view_style === 'grid'}>
          <AssortmentGridView
            items={items}
            loadMoreProps={{
              fetchNextPage,
              hasNextPage,
              isFetchingNextPage,
            }}
          />
        </ConditionalShell>
        <ConditionalShell condition={params.view_style === 'list'}>
          <DataTable
            data={items}
            enableToolbar={false}
            enablePagination={false}
            columns={assortmentTableColumns}
            isLoading={isFetchingNextPage || isLoading}
            pagination={{
              pageIndex: 0,
              pageSize: params.per_page,
            }}
            customPagination={
              <AssortmentTablePagination
                searchParams={{ params, setParams }}
                pageCount={pageCount}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
              />
            }
          />
        </ConditionalShell>
      </div>
    </>
  );
}

interface AssortmentGridProps {
  items: Assortment[];
  loadMoreProps: React.ComponentProps<typeof LoadMoreButton>;
}

function AssortmentGridView({ items, loadMoreProps }: AssortmentGridProps) {
  return (
    <>
      <div className="mx-n4 px-4 mx-lg-n6 px-lg-6 position-relative top-1 products-grid-container pb-5">
        {items.map((item) => (
          <AssortmentCard key={item._id} assortment={item} />
        ))}
      </div>
      <div className="w-100 d-flex justify-content-center">
        <LoadMoreButton {...loadMoreProps} />
      </div>
    </>
  );
}
