import ShipmentModel from "@/models/shipment.model";
import type {
  ReducedResult,
  ShipmentDataResult,
  ShipmentItemData,
} from "@/types/shipment";
import apiSPInstance from "@/utils/api-sp-instance";
import createCache from "@/utils/cache.util";
import type { Shipment } from "@repo/schema";

export async function getShipmentStatusItems() {
  return Promise.resolve([
    { value: "ALL", label: "All" },
    { value: "RECEIVING", label: "Receiving" },
    { value: "READY_TO_SHIP", label: "Ready to Ship" },
    { value: "IN_TRANSIT", label: "In transit" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "WORKING", label: "Working" },
    { value: "CLOSED", label: "Closed" },
    { value: "CANCELLED", label: "Cancelled" },
  ]);
}

const shipmentsCache = createCache<Shipment[]>();

export async function getShipments(
  ShipmentIdList: string,
  ShipmentStatus?: string
) {
  const ShipmentStatusList =
    ShipmentStatus !== "ALL" ? ShipmentStatus : undefined;

  const cacheKey = `${ShipmentStatus}-${ShipmentIdList}`;
  const cachedData = shipmentsCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const response = await apiSPInstance.get<ShipmentDataResult>(
    "/fba/inbound/v0/shipments",
    {
      params: {
        ShipmentStatusList,
        ShipmentIdList,
      },
    }
  );

  const result = response.data.payload.ShipmentData;
  // Store data in the cache
  shipmentsCache.set(cacheKey, result);

  return result;
}

export async function getShipmentItems(ShipmentStatusList?: string) {
  const currentDate = new Date();
  const daysToFilter = 30;

  // Subtracting 1 day from the current date
  const lastUpdatedAfter = new Date(currentDate);
  lastUpdatedAfter.setDate(currentDate.getDate() - daysToFilter);

  const LastUpdatedBefore = currentDate.toISOString();
  const LastUpdatedAfter = lastUpdatedAfter.toISOString();

  const params = {
    LastUpdatedBefore,
    LastUpdatedAfter,
    QueryType: "DATE_RANGE",
  };

  const key = JSON.stringify(params);

  const shipmentData = await ShipmentModel.findOne({ key }).lean();

  if (shipmentData) {
    return shipmentData.shipmentData;
  }

  const response = await apiSPInstance.get<ShipmentItemData>(
    "/fba/inbound/v0/shipmentItems",
    {
      params,
    }
  );

  const ItemData = response.data.payload.ItemData;

  const reducedArray = ItemData.reduce<ReducedResult>((record, item) => {
    const {
      ShipmentId,
      SellerSKU,
      QuantityShipped,
      QuantityReceived,
      QuantityInCase,
      PrepDetailsList,
    } = item;

    if (!(ShipmentId in record)) {
      record[ShipmentId] = {
        SellerSKUs: [],
        TotalQuantities: {
          Shipped: 0,
          Received: 0,
          InCase: 0,
        },
        AllPrepDetailsList: [],
      };
    }

    const shipment = record[ShipmentId];

    if (!shipment.SellerSKUs.includes(SellerSKU)) {
      shipment.SellerSKUs.push(SellerSKU);
    }

    shipment.TotalQuantities.Shipped += QuantityShipped;
    shipment.TotalQuantities.Received += QuantityReceived;
    shipment.TotalQuantities.InCase += QuantityInCase;
    shipment.AllPrepDetailsList.concat(PrepDetailsList);

    record[ShipmentId] = shipment;

    return record;
  }, {});

  // Convert the reducedArray object to an array of results
  const resultArray = Object.keys(reducedArray).map((shipmentId) => ({
    ShipmentId: shipmentId,
    SellerSKUs: reducedArray[shipmentId].SellerSKUs,
    AllPrepDetailsList: reducedArray[shipmentId].AllPrepDetailsList,
    ...reducedArray[shipmentId].TotalQuantities,
  }));

  const shipmentIdList = resultArray.map((item) => item.ShipmentId).join(",");
  const shipments = await getShipments(shipmentIdList, ShipmentStatusList);

  const result = resultArray
    .map((item) => {
      const shipment = shipments.find(
        (shipItem) => shipItem.ShipmentId === item.ShipmentId
      );
      return { ...item, shipment };
    })
    .filter((item) => item.shipment);

  await ShipmentModel.create({ key, shipmentData: result });

  return result;
}
