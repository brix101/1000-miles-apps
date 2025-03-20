import ProductGraphModal from "@/components/forms/ProductGraphModal";
import { ProductItemModalContainer } from "@/components/forms/ProductItemModal";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetProduct from "@/hooks/queries/useGetProduct";
import useBoundStore from "@/hooks/useBoundStore";
import { cn, getImages } from "@/lib/utils";
import { ProcurementProduct } from "@/types/procurement-product";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const procurementProductColumns: ColumnDef<ProcurementProduct>[] = [
  {
    accessorKey: "images",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const hasNotes = product.notes && product.notes.length > 0;
      const image = getImages(product)[0];

      return (
        <div className="d-flex align-items-center">
          <div className={cn(hasNotes ? "visible" : "invisible")}>
            <Popover>
              <PopoverTrigger asChild>
                <button className="btn btn-icon">
                  <Icons.UInfoCircle className="text-danger" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="card">
                {product.notes?.map((item) => item.message).join(", ")}
                <PopoverArrow className="PopoverArrow" />
              </PopoverContent>
            </Popover>
          </div>
          <ProductItemModalContainer item={product} isShowDetails={true}>
            <div className="avatar avatar-xl">
              <img src={image?.link} alt={"mmaries.marketplaceId"} />
            </div>
          </ProductItemModalContainer>
        </div>
      );
    },
  },
  {
    accessorKey: "itemName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      return (
        <ProductItemModalContainer
          item={product}
          className="product-listing-text fw-bold text-1100"
          isShowDetails={true}
        >
          {product.itemName}
        </ProductItemModalContainer>
      );
    },
  },
  {
    accessorKey: "brand",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      return <span className="text-nowrap">{product.brand}</span>;
    },
  },
  {
    accessorKey: "asin",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ASIN" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return <span className="text-nowrap">{product.asin}</span>;
    },
  },
  {
    id: "graph",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      const original = row.original;
      return <></>;
      return <ViewGraphButton product={original} />;
    },
  },
  {
    id: "sku",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <span className="text-nowrap">
          {product.inventory?.sellerSku || product.sellerSku}
        </span>
      );
    },
  },
  {
    id: "reservedInventory",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reserved Inventory" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      const totalReservedQuantity =
        product.inventory?.inventoryDetails?.reservedQuantity
          ?.totalReservedQuantity || 0;

      return <span>{totalReservedQuantity}</span>;
    },
  },
  {
    accessorKey: "availableInvetory",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Inventory" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const fulfillableQuantity =
        product.inventory?.inventoryDetails?.fulfillableQuantity || 0;

      return <span>{fulfillableQuantity}</span>;
    },
  },
  {
    id: "inboundToAmazon",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inbound to Amazon" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      const inboundShippedQuantity =
        product.inventory?.inventoryDetails?.inboundShippedQuantity || 0;
      return <span>{inboundShippedQuantity}</span>;
    },
  },
  {
    id: "researching",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Researching" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <span>
          {
            product.inventory?.inventoryDetails?.researchingQuantity
              ?.totalResearchingQuantity
          }
        </span>
      );
    },
  },
  {
    id: "totAmazonInventory",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amazon Inventory" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return <span>{product.inventory?.totalQuantity}</span>;
    },
  },
  {
    id: "yiwuWarehouseInventory",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="YIWU Warehouse Inventory" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const { data, isLoading } = useGetProduct(product.asin);

      return (
        <div className="placeholder-glow">
          {isLoading ? (
            <span
              className="placeholder w-100 rounded-2"
              style={{ height: "20px" }}
            />
          ) : (
            <>{data?.yiwuWarehouseInventory ?? 0}</>
          )}
        </div>
      );
    },
  },
  {
    id: "poQuantity",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO Quantity" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const { data, isLoading } = useGetProduct(product.asin);

      return (
        <div className="placeholder-glow">
          {isLoading ? (
            <span
              className="placeholder w-100 rounded-2"
              style={{ height: "20px" }}
            />
          ) : (
            <>{data?.poQuantity ?? 0}</>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "amazonInventoryStatus",
  //   enableHiding: false,
  //   enableSorting: false,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Amazon Inventory Status" />
  //   ),
  //   cell: ({ row }) => {
  //     return <span></span>;
  //   },
  // },
  // {
  //   accessorKey: "amazonInventorySufficientUntil",
  //   enableHiding: false,
  //   enableSorting: false,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Amazon Inventory Sufficient Until"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const product = row.original;
  //     return <span>{product.amazonInventorySufficientUntil}</span>;
  //   },
  // },
  // {
  //   accessorKey: "nextShipmentDate",
  //   enableHiding: false,
  //   enableSorting: false,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Next Shipment Date" />
  //   ),
  //   cell: ({ row }) => {
  //     const product = row.original;
  //     return <span>{product.nextShipmentDate}</span>;
  //   },
  // },
];

function ViewGraphButton({ product }: { product: ProcurementProduct }) {
  const setDialogItem = useBoundStore((state) => state.setDialogItem);

  return (
    <Button
      variant="link"
      size="icon"
      onClick={() =>
        setDialogItem({
          item: <ProductGraphModal product={product} />,
          size: "lg",
        })
      }
    >
      <Icons.UChartLine />
    </Button>
  );
}
