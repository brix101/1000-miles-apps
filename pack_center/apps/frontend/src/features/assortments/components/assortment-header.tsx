import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '@/utils/getStatusVariant';
import { Assortment } from '..';

interface AssortmentHeaderProps<T extends Assortment> {
  assortment?: T;
  isLoading?: boolean;
}

export function AssortmentHeader<T extends Assortment>({
  assortment,
  isLoading,
}: AssortmentHeaderProps<T>) {
  return (
    <PageHeader isLoading={isLoading}>
      <div className="d-flex align-items-center">
        <span className="me-4">
          {assortment?.customerItemNo} - {assortment?.itemNo}
        </span>
        <Badge
          className="text-uppercase"
          variant={getStatusVariant(assortment?.status)}
        >
          {assortment?.status}
        </Badge>
      </div>
    </PageHeader>
  );
}
