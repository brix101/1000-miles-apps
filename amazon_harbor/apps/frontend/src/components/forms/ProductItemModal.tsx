import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProductEditMutation from "@/hooks/mutations/useProductEditMutation";
import useGetProduct from "@/hooks/queries/useGetProduct";
import useGetShipmentStatuses from "@/hooks/queries/useGetShipmentStatuses";
import useGetShipments from "@/hooks/queries/useGetShipments";
import useGetZuluAssortment from "@/hooks/queries/useGetZuluAssortment";
import useBoundStore from "@/hooks/useBoundStore";
import { cn, getDimensionString, getImages, getWeight } from "@/lib/utils";
import { ProductData } from "@/services/product.service";
import { ListingProductSummary } from "@repo/schema";
import React, { Fragment, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Input } from "../ui/input";

interface ProductItemModalContainerProps<T extends ListingProductSummary>
  extends React.HTMLProps<HTMLDivElement> {
  item: T;
  isShowDetails?: boolean;
}

export const ProductItemModalContainer: React.FC<
  ProductItemModalContainerProps<ListingProductSummary>
> = ({ item, isShowDetails, ...props }) => {
  const setDialogItem = useBoundStore((state) => state.setDialogItem);

  return (
    <div
      onClick={() => {
        setDialogItem({
          item: <ProductItemModal item={item} isShowDetails={isShowDetails} />,
          size: "xl",
        });
      }}
      {...props}
    />
  );
};

interface GenericItemModalProps<T extends ListingProductSummary> {
  item: T;
}

interface ProductItemModalProps<T extends ListingProductSummary>
  extends GenericItemModalProps<T> {
  isShowDetails?: boolean;
}

function ProductItemModal<T extends ListingProductSummary>({
  item,
  isShowDetails = true,
}: ProductItemModalProps<T>) {
  const views = [
    {
      key: "amazonDetails",
      label: "Amazon Details",
      component: <AmazonDetail item={item} />,
    },
    {
      key: "zuluInfo",
      label: "Zulu Info",
      component: <ZuluInfo item={item} />,
    },
    {
      key: "shipments",
      label: "Shipments",
      component: <Shipments item={item} />,
    },
  ];

  const [activeView, setActiveView] = useState(views[0].key);

  const attributes = item.attributes;
  const salesRanks = item.salesRanks[0];
  const image = getImages(item)[0];
  const weight = getWeight(item);

  const itemPackageDimensions =
    (attributes.item_package_dimensions &&
      attributes.item_package_dimensions[0]) ??
    null;

  const dimensions = getDimensionString(itemPackageDimensions);

  const { data: prod } = useGetProduct(item.asin);
  const { data: zulu, isLoading } = useGetZuluAssortment(
    prod?.assortmentNumber || ""
  );

  return (
    <>
      <Modal.Header closeButton />
      <Modal.Body>
        <div className="row scrollbar mb-4">
          <div className="col-5 d-flex justify-content-center align-items-center">
            <img
              className="img-fluid image-limit"
              src={image?.link}
              alt={item.itemName}
            />
          </div>
          <div className="col-7">
            <div className="pe-4">
              <h4 className="mb-5">Amazon General Info</h4>
              <ProductInfoRow label="Product Title" value={item.itemName} />
              <ProductInfoRow
                label="Assortment Name"
                isLoading={isLoading}
                value={zulu?.name || ""}
              />
              <ProductInfoRow label="Brand" value={item.brand} />
              <ProductInfoRow label="ASIN" value={item.asin} />
              <ProductInfoRow label="SKU" value={item.inventory?.sellerSku} />
              <ProductInfoRow label="FNSKU" value={item.inventory?.fnSku} />
              <ProductInfoRow label="Package Dimension" value={dimensions} />
              <ProductInfoRow
                label="Weight"
                value={`${weight.value.toFixed(2)} ${weight.unit}`}
              />
              <ProductInfoRow
                label="Package size"
                isLoading={isLoading}
                value={zulu?.amz_packaging_size || ""}
              />
              <div className="row mb-2 placeholder-glow">
                <label className="col-4 pe-1 px-1 col-form-label fs--1 fw-bold">
                  Best sellers rank
                </label>
                <div className="col-8">
                  <ul className="list-unstyled placeholder-glow col-form-label ps-3 form-control-plaintext">
                    {salesRanks.displayGroupRanks.map((rank, index) => {
                      return (
                        <li key={index} className="fs--1 fw-bold">
                          # {rank.rank} in {rank.title}
                        </li>
                      );
                    })}
                    {salesRanks.classificationRanks.map((rank, index) => {
                      return (
                        <li key={index + 1} className="fs--1 fw-bold">
                          # {rank.rank} in {rank.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(isShowDetails === undefined || isShowDetails) && (
          <div className="row m-2">
            <div className="nav nav-tabs">
              {views.map((view) => (
                <Button
                  key={view.key}
                  className={cn(
                    "mx-1",
                    activeView === view.key ? "active" : ""
                  )}
                  variant="soft-primary"
                  onClick={() => setActiveView(view.key)}
                >
                  {view.label}
                </Button>
              ))}
            </div>
            <div className="row border-top pt-2">
              {views.map((view) => (
                <Fragment key={view.key}>
                  {activeView === view.key && view.component}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
    </>
  );
}

function AmazonDetail<T extends ListingProductSummary>({
  item,
}: GenericItemModalProps<T>) {
  const [state, setState] = useState<ProductData>({});

  const { data: prod, isLoading: isProdLoading } = useGetProduct(item.asin);
  const totalReservedQuantity =
    item.inventory?.inventoryDetails?.reservedQuantity?.totalReservedQuantity;
  const fulfillableQuantity =
    item.inventory?.inventoryDetails?.fulfillableQuantity || 0;
  const totalQuantity = item.inventory?.totalQuantity;
  const inboundShippedQuantity =
    item.inventory?.inventoryDetails?.inboundShippedQuantity;

  const totalResearchingQuantity =
    item.inventory?.inventoryDetails?.researchingQuantity
      ?.totalResearchingQuantity;

  const { mutate } = useProductEditMutation();

  React.useEffect(() => {
    if (prod) {
      setState(prod);
    }
  }, [prod]);

  function handleOnBlur() {
    mutate({ asin: item.asin, data: state });
  }

  function handleAvgCOGChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    const numValue = parseFloat(value);
    setState((prev) => ({
      ...prev,
      avgCOG: isNaN(numValue) ? undefined : numValue,
    }));
  }

  function handleShippingCostChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    const numValue = parseFloat(value);
    setState((prev) => ({
      ...prev,
      shippingCost: isNaN(numValue) ? undefined : numValue,
    }));
  }
  return (
    <>
      <div className="col-6">
        <h4 className="mb-2">Inventory</h4>
        <ProductInfoRow
          label="Reserved Inventory"
          value={totalReservedQuantity}
        />
        <ProductInfoRow
          label="Available Inventory"
          value={fulfillableQuantity}
        />
        <ProductInfoRow
          label="Inbound Inventory"
          value={inboundShippedQuantity}
        />
        <ProductInfoRow label="Researching" value={totalResearchingQuantity} />
        <ProductInfoRow label="Total Amazon Inventory" value={totalQuantity} />
        <ProductInfoRow
          isLoading={isProdLoading}
          label="Yiwu Warehouse Inventory"
          value={prod?.yiwuWarehouseInventory ?? 0}
        />
      </div>
      <div className="col-6">
        {/* Prices */}
        <h4 className="mb-2">Prices</h4>
        <ProductInfoRow
          label="Retail Price"
          value={`$ ${item.price.toFixed(2)}`}
        />
        <ProductEditInfoRow
          isLoading={isProdLoading}
          label="Average Cost of Goods"
          type="number"
          min={0}
          value={state.avgCOG}
          onChange={handleAvgCOGChange}
          onBlur={handleOnBlur}
        />
        <ProductEditInfoRow
          isLoading={isProdLoading}
          label="Shipping Cost"
          type="number"
          min={0}
          value={state.shippingCost}
          onChange={handleShippingCostChange}
          onBlur={handleOnBlur}
        />

        {/* Manufacturing */}
        <h4 className="mb-2 mt-10">Manufacturing</h4>
        <ProductEditInfoRow
          label="Manufacturing Lead Time"
          value={state.manufacturingLeadtime}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              manufacturingLeadtime: e.target.value,
            }))
          }
        />
        <ProductEditInfoRow
          label="Safety Lead Time"
          value={state.safetyLeadTime}
          onChange={(e) =>
            setState((prev) => ({ ...prev, safetyLeadTime: e.target.value }))
          }
        />
      </div>
    </>
  );
}

function ZuluInfo<T extends ListingProductSummary>({
  item,
}: GenericItemModalProps<T>) {
  const { data: prod, isLoading: isProdLoading } = useGetProduct(item.asin);
  const { data, isLoading: isZuluLoading } = useGetZuluAssortment(
    prod?.assortmentNumber || ""
  );
  const { mutate } = useProductEditMutation();

  const [state, setState] = useState<ProductData>({});

  React.useEffect(() => {
    if (prod) {
      setState(prod);
    }
  }, [prod]);

  function handleOnBlur() {
    mutate({ asin: item.asin, data: state });
  }

  function handleAssortmentChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    setState((prev) => ({ ...prev, assortmentNumber: value }));
  }

  function handleInventoryChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    const numValue = parseFloat(value);
    setState((prev) => ({
      ...prev,
      yiwuWarehouseInventory: isNaN(numValue) ? undefined : numValue,
    }));
  }

  function handlePoQuantityChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    const numValue = parseFloat(value);
    setState((prev) => ({
      ...prev,
      poQuantity: isNaN(numValue) ? undefined : numValue,
    }));
  }

  function handlePoDateChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    setState((prev) => ({ ...prev, poReadyDate: value }));
  }

  return (
    <>
      <div className="col-6">
        <h4 className="mb-2">Zulu Info</h4>
        <ProductEditInfoRow
          isLoading={isProdLoading}
          label="Assortment Number"
          value={state.assortmentNumber}
          onChange={handleAssortmentChange}
          onBlur={handleOnBlur}
        />
        <ProductInfoRow
          isLoading={isZuluLoading}
          label="Assortment Name"
          value={data?.name ?? ""}
        />
        <ProductInfoRow
          isLoading={isZuluLoading}
          label="Category"
          value={data?.category ?? ""}
        />
        <ProductInfoRow
          isLoading={isZuluLoading}
          label="Sub-Category"
          value={data?.sub_category ?? ""}
        />

        <ProductEditInfoRow
          isLoading={isProdLoading}
          type="number"
          min={0}
          label="Yiwu Warehouse Inventory"
          value={state.yiwuWarehouseInventory}
          onChange={handleInventoryChange}
          onBlur={handleOnBlur}
        />
        <ProductEditInfoRow
          isLoading={isProdLoading}
          type="number"
          min={0}
          label="PO Quantity"
          value={state.poQuantity}
          onChange={handlePoQuantityChange}
          onBlur={handleOnBlur}
        />
        <ProductEditInfoRow
          isLoading={isProdLoading}
          label="PO Ready Date"
          value={state.poReadyDate}
          onChange={handlePoDateChange}
          onBlur={handleOnBlur}
        />
      </div>
      <div className="col-6">
        <h4 className="mb-4"></h4>
        <div className="row mb-2">
          <label
            className="col-4 col-form-label fs--1 fw-bold"
            htmlFor="staticProductTitle"
          >
            Manufacturing Orders
          </label>
          <div className="col-8">
            <ul className="list-unstyled placeholder-glow col-form-label">
              {isZuluLoading ? (
                <>
                  {Array.from({ length: 5 }, (_, index) => (
                    <li key={index}>
                      <span className="placeholder h-100 w-100 rounded-2"></span>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {data?.mops?.map((mop) => {
                    return (
                      <li key={mop.id} className="fs--1 fw-bold ps-3">
                        {mop.name} ({mop.product_qty} MOQ)
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function Shipments<T extends ListingProductSummary>({
  item,
}: GenericItemModalProps<T>) {
  const [state, setState] = useState<ProductData>({});

  const sellerSku = item.inventory?.sellerSku;
  const { data: prod, isLoading: isProdLoading } = useGetProduct(item.asin);
  const { data: shipments, isLoading } = useGetShipments({
    status: "ALL",
    sellerSku,
  });

  const { data: statuses, isLoading: isStatusLoading } =
    useGetShipmentStatuses();

  const shipmentItems =
    shipments?.filter(
      (item) =>
        !["CLOSED", "CANCELLED"].includes(item.shipment?.ShipmentStatus ?? "")
    ) || [];

  const { mutate } = useProductEditMutation();

  React.useEffect(() => {
    if (prod) {
      setState(prod);
    }
  }, [prod]);

  function handleOnBlur() {
    mutate({ asin: item.asin, data: state });
  }

  function handleDeliveryTimeChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    setState((prev) => ({ ...prev, deliveryTime: value }));
  }

  function handleDeliveryFeeChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    const numValue = parseFloat(value);
    setState((prev) => ({
      ...prev,
      deliveryFee: isNaN(numValue) ? undefined : numValue,
    }));
  }
  return (
    <>
      <div className="col-6 mb-5">
        <h4 className="mb-2">Shipments</h4>

        <ProductInfoRow
          label="Ongoing Shipments"
          value={shipmentItems?.length}
          isLoading={isLoading}
        />
        <ProductEditInfoRow
          isLoading={isProdLoading}
          label="Delivery Time"
          value={state.deliveryTime}
          onChange={handleDeliveryTimeChange}
          onBlur={handleOnBlur}
        />
        <ProductEditInfoRow
          isLoading={isProdLoading}
          type="number"
          min={0}
          label="Delivery Fee"
          value={state.deliveryFee}
          onChange={handleDeliveryFeeChange}
          onBlur={handleOnBlur}
        />
      </div>
      <div className="row">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Delivery Name</TableHead>
              <TableHead>Delivery ID</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Amazon Reference Number</TableHead>
              <TableHead>Amazon Warehouse Code</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: 4 }, (_, index) => (
                  <TableRow key={index} className="placeholder-glow">
                    {Array.from({ length: 9 }, (_, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <span
                          className="placeholder w-100 rounded-2"
                          style={{ height: "30px" }}
                        ></span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {shipmentItems?.map((item, index) => {
                  const shipmentStatus = item.shipment?.ShipmentStatus;
                  const status =
                    statuses?.find((item) => item.value === shipmentStatus)
                      ?.label || shipmentStatus;

                  return (
                    <TableRow key={index}>
                      <TableCell className="text-nowrap">
                        {item.shipment?.ShipmentName}
                      </TableCell>
                      <TableCell>{item.ShipmentId}</TableCell>
                      <TableCell>{/* {item.dateCreated} */}</TableCell>
                      <TableCell>
                        {/* {item.amazonReferenceNumber} */}
                      </TableCell>
                      <TableCell>
                        {item.shipment?.DestinationFulfillmentCenterId}
                      </TableCell>
                      <TableCell>
                        {item.shipment?.DestinationFulfillmentCenterId}
                      </TableCell>
                      <TableCell>{/* {item.trackingNumber} */}</TableCell>
                      <TableCell>
                        {isStatusLoading ? (
                          <span className="spinner-border spinner-border-xs"></span>
                        ) : (
                          <>{status}</>
                        )}
                      </TableCell>
                      <TableCell>{/* {item.statusCode} */}</TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function ProductInfoRow({
  label,
  value,
  isLoading,
  variant,
}: {
  label: string;
  value?: string | number;
  isLoading?: boolean;
  variant?: "default" | "outlined";
}) {
  return (
    <div className="row mb-2 placeholder-glow">
      <label className="col-4 pe-1 px-1 col-form-label fs--1 fw-bold">
        {label}
      </label>
      {isLoading ? (
        <div className="col-8">
          <span className="placeholder placeholder-input p-2 w-100 rounded-2"></span>
        </div>
      ) : (
        <div className="col-8">
          <span
            className={cn(
              "fs--1 fw-bold placeholder-input ps-3",
              variant === "outlined" ? "form-control" : "form-control-plaintext"
            )}
          >
            {value}
          </span>
        </div>
      )}
    </div>
  );
}

function ProductEditInfoRow({
  label,
  isLoading,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  isLoading?: boolean;
}) {
  return (
    <div className="row mb-2 placeholder-glow">
      <label className="col-4 pe-1 px-1 col-form-label fs--1 fw-bold">
        {label}
      </label>
      {isLoading ? (
        <div className="col-8">
          <span className="placeholder placeholder-input p-2 w-100 rounded-2"></span>
        </div>
      ) : (
        <div className="col-8">
          <Input {...props} />
        </div>
      )}
    </div>
  );
}

export default ProductItemModal;
