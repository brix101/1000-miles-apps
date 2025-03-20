import PageHeaderContainer from "@/components/container/page-header-Container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetCategories from "@/hooks/queries/useGetCategories";
import { CategorySale } from "@/types/category";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const categoryOption = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Parent Categories",
    },
  },
};

export const subOption = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Sub Categories",
    },
  },
};

function Categories() {
  const { data, isLoading } = useGetCategories();
  const { parentData, subData } = useGenerateChartData(data, isLoading);
  const reducedTotalSales = useMemo(() => {
    if (!data) {
      return 0; // Default to 0 if data is undefined
    }

    return data?.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.totalSales;
    }, 0);
  }, [data]);

  return (
    <>
      <PageHeaderContainer>Categories</PageHeaderContainer>
      <div className="row">
        <div className="col-4 card p-2">
          <Pie options={categoryOption} data={parentData} />
        </div>
        <div className="col-1"></div>
        <div className="col-4 card p-2">
          <Pie options={subOption} data={subData} />
        </div>
      </div>
      <div className="mt-5 mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parent Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Percent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: 3 }, (_, index) => (
                  <TableRow key={index} className="placeholder-glow">
                    {Array.from({ length: 4 }, (_, columnIndex) => (
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
                {data?.map((category, index) => {
                  const totalSales = category.totalSales;
                  const percentage = (totalSales / reducedTotalSales) * 100;

                  return (
                    <TableRow key={index}>
                      <TableCell className="fw-bold text-1100">
                        {category.parentCategory}
                      </TableCell>
                      <TableCell className="fw-bold text-1100">
                        {category.subCategory}
                      </TableCell>
                      <TableCell className="">
                        $ {category.totalSales.toFixed(2)}
                      </TableCell>
                      <TableCell className="">
                        {percentage.toFixed(2)} %
                      </TableCell>
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

interface ReducedCategorySale {
  subCategory: string;
  parentCategory: string;
  totalSales: number;
}

function useGenerateLoaderData() {
  const [data, setData] = useState<number[]>([]);

  const generateRandomData = (count: number): number[] => {
    const newData: number[] = [];

    for (let i = 1; i <= count; i++) {
      const totalSales = Math.floor(Math.random() * 100) + 1; // Random total sales between 1 and 100
      newData.push(totalSales);
    }

    return newData;
  };

  useEffect(() => {
    // Initial data generation
    setData(generateRandomData(10));

    // Set up interval to generate new data every 1 second
    const intervalId = setInterval(() => {
      setData(generateRandomData(10));
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return data;
}

function useGenerateChartData(
  data: CategorySale[] | undefined,
  isLoading: boolean
) {
  const randomData = useGenerateLoaderData();

  const categoryLabels = data?.map((item) => item.parentCategory) || [];
  const reducedData: ReducedCategorySale[] | undefined = data?.reduce(
    (accumulator: ReducedCategorySale[], currentItem: CategorySale) => {
      const existingItemIndex = accumulator.findIndex(
        (item) => item.parentCategory === currentItem.parentCategory
      );

      if (existingItemIndex !== -1) {
        // If item with the same parentCategory exists, reduce its totalSales
        accumulator[existingItemIndex].totalSales += currentItem.totalSales;
      } else {
        // If item doesn't exist, add it to the accumulator
        accumulator.push({
          subCategory: currentItem.subCategory,
          parentCategory: currentItem.parentCategory,
          totalSales: currentItem.totalSales,
        });
      }

      return accumulator;
    },
    []
  );

  const categoryTotals: number[] =
    reducedData?.map((item) => item.totalSales) || [];

  const parentData = {
    labels: isLoading ? [] : categoryLabels,
    datasets: [
      {
        label: "Parent Category",
        data: isLoading ? randomData : categoryTotals,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const subLabels = data?.map((item) => item.subCategory) || [];
  const subTotals = data?.map((item) => item.totalSales) || [];

  const subData = {
    labels: isLoading ? [] : subLabels,
    datasets: [
      {
        label: "Sub Category",
        data: isLoading ? randomData : subTotals,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return { parentData, subData };
}

export default Categories;
