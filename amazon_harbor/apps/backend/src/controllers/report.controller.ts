import { getMyFeesEstimateForSKU } from "@/services/amz-fee.service";
import {
  defaultInvetorySummary,
  getInventorySummaries,
} from "@/services/amz-inventory.service";
import { getListingsItems } from "@/services/amz-listing.service";
import {
  getComparisonInterval,
  getGranularityInterval,
  getOrderMetrics,
  parseQueryInterval,
} from "@/services/amz-sale.service";
import { ProductStatus, getProducts } from "@/services/product.service";
import { fetchImage, getImages } from "@/utils/images-utils";
import type {
  ComparedPeriod,
  OrderMetricsIntervalComparison,
} from "@repo/schema";

import dayjs from "dayjs";
import ExcelJS from "exceljs";
import type { NextFunction, Request, Response } from "express";

export const getSalesReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketplaceId = (req.query.marketplace as string) || "ATVPDKIKX0DER"; // Use the query parameter or default to 'USA'
    const period = (req.query.period as string) || "YESTERDAY";
    const queryInterval = req.query.interval as string;
    const queryCompPeriod =
      (req.query.comparisonPeriod as string) || "LAST_WEEK";
    // const comparisonNumber = req.query.comparisonNumber as string;
    const queryCompInterval = req.query.comparisonInterval as string;

    const inventories = await getInventorySummaries(marketplaceId);
    const products = await getProducts("Active");

    const listingsItems = await getListingsItems({
      products,
      marketplaceId,
    });

    const { granularity, interval } = getGranularityInterval(period);
    const parseInterval = parseQueryInterval(queryInterval);

    const listingPromises = listingsItems.map(async (item) => {
      const inventory = inventories.find((inv) => inv.asin === item.asin);
      const summary = item.summaries[0];

      const sales = await getOrderMetrics({
        marketplaceIds: marketplaceId,
        granularity,
        interval: parseInterval || interval,
        sku: item.sellerSku,
      });

      const fees = await getMyFeesEstimateForSKU({
        amount: sales.totalSales.amount,
        SellerSKU: item.sellerSku,
      });

      const parseCompInterval = parseQueryInterval(queryCompInterval);
      const compInterval =
        parseCompInterval ||
        getComparisonInterval(queryCompPeriod, sales.interval);

      const comparisonItems = await getOrderMetrics({
        marketplaceIds: marketplaceId,
        granularity,
        interval: compInterval,
        sku: item.sellerSku,
      });

      const comparisonFees = await getMyFeesEstimateForSKU({
        amount: comparisonItems.totalSales.amount,
        SellerSKU: item.sellerSku,
      });

      const comparisons: OrderMetricsIntervalComparison[] = [
        {
          value: queryCompPeriod,
          sales: comparisonItems,
          fees: comparisonFees,
        },
      ];

      return {
        asin: item.asin,
        summary,
        inventory,
        sales,
        comparisons,
        fees,
      };
    });

    const listingResults = await Promise.all(listingPromises);
    const items = listingResults.filter(({ sales }) => sales.unitCount > 0);
    const comparisons = items[0].comparisons || [];
    const comparedPeriods: ComparedPeriod[] = comparisons.map((comparison) => {
      const sales = comparison.sales;

      const [start, end] = sales.interval.split("--");
      return {
        value: comparison.value,
        start,
        end,
      };
    });

    const workbook = new ExcelJS.Workbook();

    const saleWorksheet = workbook.addWorksheet("Sales Report");
    const row = saleWorksheet.addRow([]);
    saleWorksheet.mergeCells(row.number, 1, row.number, 7);
    comparedPeriods.forEach((comparison, index) => {
      const colIdx = index + 8;
      saleWorksheet.mergeCells(row.number, colIdx, row.number, colIdx + 3);
      row.getCell(colIdx).value = comparison.value;
    });

    saleWorksheet.addRow([
      "ASIN",
      "SKU",
      "Product Name",
      "Brand",
      "Sales",
      "Spending",
      "Profit",
      "Growth",
      "Sales",
      "Spending",
      "Profit",
    ]);

    items.forEach((item) => {
      const itemRow = saleWorksheet.addRow([]);

      itemRow.getCell("A").value = item.asin;
      itemRow.getCell("B").value = item.inventory?.sellerSku || "";
      itemRow.getCell("C").value = item.inventory?.productName || "";
      itemRow.getCell("D").value = item.summary?.brand || "";
      itemRow.getCell("E").value = item.sales.totalSales.amount || 0;
      itemRow.getCell("F").value = item.fees.Amount || 0;
      itemRow.getCell("G").value = {
        formula: `=E${itemRow.number}-F${itemRow.number}`,
      };
      item.comparisons.forEach((comparison) => {
        itemRow.getCell("H").value = {
          formula: `=((E${itemRow.number}-I${itemRow.number})/ABS(I${itemRow.number}))*100`,
        };
        itemRow.getCell("I").value = comparison.sales.totalSales.amount || 0;
        itemRow.getCell("J").value = comparison.fees.Amount || 0;
        itemRow.getCell("K").value = {
          formula: `=IF(I${itemRow.number}<>0, ((E${itemRow.number}-I${itemRow.number})/ABS(I${itemRow.number}))*100, 0)`,
        };
      });
    });

    // Generate the Excel file as a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set the response headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `Sales_Report.xlsx`);

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const getInventoryReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brandName = (req.query.brand as string) || "BSCOOL"; // Use the query parameter or default to 'BSCOOL'
    const marketplaceId = (req.query.marketplace as string) || "ATVPDKIKX0DER"; // Use the query parameter or default to 'USA'
    const status = req.query.status as ProductStatus; // Use the query parameter or default to 'All'
    const currentDate = dayjs();
    const fileName = currentDate.format("DD_MMM");
    const sheetName = currentDate.format("MMM DD");

    const lastlastMonth = currentDate
      .utcOffset(0)
      .subtract(2, "month")
      .endOf("month");
    const sixMonthsAgo = lastlastMonth.utcOffset(0).subtract(6, "month");

    const interval = `${sixMonthsAgo.add(1, "month").toISOString()}--${lastlastMonth.toISOString()}`;
    const titleMonths = [];
    let currentMonth = lastlastMonth;

    while (currentMonth.isAfter(sixMonthsAgo)) {
      titleMonths.push(currentMonth.format("MMMM"));
      currentMonth = currentMonth.subtract(1, "month");
    }
    titleMonths.reverse();

    console.log({ interval });

    const inventories = await getInventorySummaries(marketplaceId);
    const products = await getProducts(status);
    const listingsItems = await getListingsItems({
      products: products,
      marketplaceId,
    });

    const items = listingsItems
      .filter((item) => item.brand.toLowerCase() === brandName.toLowerCase())
      .map((item) => {
        const inventory =
          inventories.find((inv) => inv.asin === item.asin) ||
          defaultInvetorySummary;
        return { ...item, inventory, procurement: undefined };
      });

    const headerStyle: Partial<ExcelJS.Style> = {
      numFmt: "@",
      alignment: {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      },
      font: {
        bold: true,
        size: 16,
      },
      border: {
        bottom: {
          style: "medium",
        },
        left: {
          style: "medium",
        },
        right: {
          style: "medium",
        },
        top: {
          style: "medium",
        },
      },
    };

    const bodyStyle: Partial<ExcelJS.Style> = {
      numFmt: "@",
      alignment: {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      },
      font: { bold: true },
      border: {
        bottom: {
          style: "medium",
        },
        left: {
          style: "medium",
        },
        right: {
          style: "medium",
        },
        top: {
          style: "medium",
        },
      },
    };

    const defaultWidth = 14.14;
    const specificWidths: Record<string, number> = {
      "1": 18,
      "2": 48.86,
      "3": 18,
      "4": 18,
      "5": 18,
    };

    const wb = new ExcelJS.Workbook();

    const invSheet = wb.addWorksheet(sheetName);
    for (let index = 1; index < 42; index++) {
      const x = index.toString();
      invSheet.getColumn(index).width = specificWidths[x] || defaultWidth;
    }

    const unitOrderKey = "Units Ordered";
    const orderProductKey = "Ordered Product Sales";
    const titles = [
      "Product Image",
      "TITLE",
      "SKU",
      "ASIN",
      unitOrderKey,
      orderProductKey,
      unitOrderKey,
      orderProductKey,
      unitOrderKey,
      orderProductKey,
      unitOrderKey,
      orderProductKey,
      unitOrderKey,
      orderProductKey,
      unitOrderKey,
      orderProductKey,
      "Last 6 Months Sales Unit",
      "Last 6 Months Product Sales",
      "Upcoming 12 Months Sales Unit Projection",
      "Reorder amount sugesstion for Next 6 Months",
      "Manufacturing lead time (days)",
      "Manufacturing Safe Time",
      "Shipment lead Time (including 5 days safe time)",
      "Inbound to AMZ",
      "Reserved in AMZ",
      "Current Inventory In Amazon",
      "Total AMZ",
      "Current Inventory In Yiwu Warehouse",
      "Purchase Order Amount (pcs)",
      "Purchase order ready date",
      "Overall Stock",
      "Amazon Stock is Sufficient Until (Days)",
      "Amazon Stock is Sufficient Until (Months)",
      "Calculated Sales per Day Estimation (Units)",
      "Amazon Stock is Sufficient Until",
      "Ship to Amazon (Send Date)",
      "Ship to Amazon for 3 Months (Units)",
      "Projected Reorder PO (Order Date)",
      "Need to Reorder PO for 6 Months (Units)",
      "Production Remarks",
    ];

    // #################################### Headers ##########################################
    // #################################### Headers ##########################################
    // #################################### Headers ##########################################
    // #################################### Headers ##########################################
    // #################################### Headers ##########################################

    const titleMonthRow = invSheet.addRow([]);
    titleMonthRow.height = 21;
    titleMonths.forEach((month, idx) => {
      const currRow = titleMonthRow.number;
      const cellStart = idx * 2 + 5;
      const cellEnd = cellStart + 1;

      invSheet.mergeCells(currRow, cellStart, currRow, cellEnd);
      titleMonthRow.getCell(cellEnd).value = month;
      titleMonthRow.getCell(cellEnd).style = headerStyle;
    });
    const titleMonthRowCells = invSheet.getRow(titleMonthRow.number);
    titleMonthRowCells.eachCell((cell) => {
      cell.style = headerStyle;
    });

    const titleRow = invSheet.addRow([]);
    titleRow.height = 85.5;
    titles.forEach((title, idx) => {
      const currRow = titleMonthRow.number;
      const currCell = idx + 1;

      const isMonthKey = [unitOrderKey, orderProductKey].includes(titles[idx]);

      if (!isMonthKey) {
        invSheet.mergeCells(currRow, currCell, currRow + 1, currCell);
      }

      titleRow.getCell(currCell).value = title;
    });
    const titleRowCells = invSheet.getRow(titleRow.number);
    titleRowCells.eachCell((cell) => {
      cell.style = headerStyle;
      const masterCell = cell.model.master;
      if (masterCell) {
        const sheetCell = invSheet.getCell(masterCell);
        sheetCell.style = headerStyle;
      }
    });

    // #################################### Body ##########################################
    // #################################### Body ##########################################
    // #################################### Body ##########################################
    // #################################### Body ##########################################
    // #################################### Body ##########################################

    await Promise.all(
      items.map(async (item) => {
        const row = invSheet.addRow([]);
        const idx = row.number;
        row.height = 60;

        const image = getImages(item)[0];
        const imageBuffer = await fetchImage(image.link);
        // Add image to the worksheet
        const imageId = wb.addImage({
          buffer: imageBuffer,
          extension: "png",
        });

        invSheet.addImage(imageId, {
          tl: { col: 0.85, row: row.number - 0.85 }, // Top-left corner cell reference
          ext: { width: 54, height: 63 }, // Dimensions of the image
        });

        const {
          inventoryDetails: {
            inboundReceivingQuantity,
            reservedQuantity,
            fulfillableQuantity,
          },
          totalQuantity,
        } = item.inventory;

        row.getCell(1).value = "";
        row.getCell(2).value = item.itemName;
        row.getCell(3).value = item.sellerSku;
        row.getCell(4).value = item.asin;

        // Update from sales
        row.getCell(5).value = 0;
        row.getCell(6).value = 0;
        row.getCell(7).value = 0;
        row.getCell(8).value = 0;
        row.getCell(9).value = 0;
        row.getCell(10).value = 0;
        row.getCell(11).value = 0;
        row.getCell(12).value = 0;
        row.getCell(13).value = 0;
        row.getCell(14).value = 0;
        row.getCell(15).value = 0;
        row.getCell(16).value = 0;

        row.getCell(17).value = {
          formula: `=SUM(E${idx},G${idx},I${idx},K${idx},M${idx},O${idx})`,
        };
        row.getCell(18).value = {
          formula: `=SUM(F${idx},H${idx},J${idx},L${idx},N${idx},P${idx})`,
        };
        row.getCell(19).value = { formula: `=Q${idx}*2*1.2` };
        row.getCell(20).value = { formula: `=S${idx}/2` };
        row.getCell(21).value = 21;
        row.getCell(22).value = 7;
        row.getCell(23).value = 30;
        row.getCell(24).value = inboundReceivingQuantity;
        row.getCell(25).value = reservedQuantity.totalReservedQuantity;
        row.getCell(26).value = fulfillableQuantity;
        row.getCell(27).value = totalQuantity;
        row.getCell(28).value = 0;
        row.getCell(29).value = 0;
        row.getCell(30).value = "";
        row.getCell(31).value = 0;
        row.getCell(32).value = { formula: `=(AB${idx}/AI${idx})-7` };
        row.getCell(33).value = { formula: `=AG${idx}/30` };
        row.getCell(34).value = {
          formula: `=(S${idx}/12)/30+(S${idx}/12)/30*20%`,
        };
        row.getCell(35).value = {
          formula: `=TODAY()+AG${idx}`,
        };
        row.getCell(36).value = {
          formula: `=AJ${idx}-30`,
        };
        row.getCell(37).value = {
          formula: `=AI${idx}*30*3`,
        };
        row.getCell(38).value = "";
        row.getCell(39).value = "";
        row.getCell(40).value = "";
        row.getCell(41).value = "";

        row.commit();
        // Styles all cells
        const rowCells = invSheet.getRow(idx);
        rowCells.eachCell((cell) => {
          cell.style = bodyStyle;
        });
      })
    );

    // Generate the Excel file as a buffer
    const buffer = await wb.xlsx.writeBuffer();
    // Set the response headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `${fileName}.xlsx`);

    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};
