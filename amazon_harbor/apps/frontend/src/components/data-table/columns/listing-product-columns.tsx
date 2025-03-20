import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ProductItemModalContainer } from "@/components/forms/ProductItemModal";
import useGetZuluAssortment from "@/hooks/queries/useGetZuluAssortment";
import { getDimensionStringConverted, getImages, getWeight } from "@/lib/utils";
import { ListingProductSummary } from "@repo/schema";
import { ColumnDef } from "@tanstack/react-table";

export const listingProductColumns: ColumnDef<ListingProductSummary>[] = [
  {
    accessorKey: "images",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const image = getImages(product)[0];

      return (
        <ProductItemModalContainer item={product}>
          <div className="avatar avatar-xl">
            <img src={image?.link} alt={"mmaries.marketplaceId"} />
          </div>
        </ProductItemModalContainer>
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
      return <span>{product.asin}</span>;
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
      const original = row.original;
      return (
        <span className="text-nowrap">
          {original.inventory?.sellerSku || original.sellerSku}
        </span>
      );
    },
  },
  {
    id: "fnsku",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="FNSKU" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return <span>{original.inventory?.fnSku}</span>;
    },
  },
  {
    id: "totAMZInventory",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="m-w-100"
        title="Total Amazon Inventory"
      />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return <span>{original.inventory?.totalQuantity}</span>;
    },
  },
  {
    accessorKey: "packageSize",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="m-w-100"
        title="Package Size"
      />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const modelNumber = product.attributes.model_number?.[0];
      const assort = modelNumber?.value ?? "";
      const { data, isLoading } = useGetZuluAssortment(assort);

      return (
        <div className="placeholder-glow">
          {isLoading ? (
            <span
              className="placeholder w-100 rounded-2"
              style={{ height: "20px" }}
            />
          ) : (
            <>{data?.amz_packaging_size}</>
          )}
        </div>
      );
    },
  },
  {
    id: "itemSizeIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item Size (in)" />
    ),
    cell: ({ row }) => {
      const attributes = row.original.attributes;
      const itemPackageDimensions =
        (attributes.item_package_dimensions &&
          attributes.item_package_dimensions[0]) ??
        null;

      const dimensions = getDimensionStringConverted(
        itemPackageDimensions,
        "in"
      );
      return <span>{dimensions}</span>;
    },
  },

  {
    id: "itemSizeCM",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item Size (cm)" />
    ),
    cell: ({ row }) => {
      const attributes = row.original.attributes;
      const itemPackageDimensions =
        (attributes.item_package_dimensions &&
          attributes.item_package_dimensions[0]) ??
        null;

      const dimensions = getDimensionStringConverted(
        itemPackageDimensions,
        "cm"
      );
      return <span>{dimensions}</span>;
    },
  },
  {
    accessorKey: "weight",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Weight" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      const weight = getWeight(product);
      return <span>{`${weight.value.toFixed(2)} ${weight.unit}`}</span>;
    },
  },
  {
    accessorKey: "price",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return <span>$ {product.price.toFixed(2)}</span>;
    },
  },
];
