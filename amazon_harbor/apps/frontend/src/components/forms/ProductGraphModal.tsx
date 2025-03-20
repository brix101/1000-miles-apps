import { ProcurementProduct } from "@/types/procurement-product";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Stock movement",
    },
  },
};

const numberOfDays = 8;
const labels = Array.from({ length: 8 }, (_, index) =>
  dayjs()
    .subtract(numberOfDays - (index + 1), "day")
    .format("MMM DD")
);

const generateRandomData = () => {
  return {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.floor(Math.random() * 1000) + 1),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => Math.floor(Math.random() * 1000) + 1),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
};

const useLiveChartData = () => {
  const [data, setData] = useState(generateRandomData());

  useEffect(() => {
    // Set up the interval to refresh data every 1 second
    const intervalId = setInterval(() => {
      // Call your function to generate random data
      const newData = generateRandomData();
      setData(newData);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return data;
};

export default function ProductGraphModal({
  product,
}: {
  product: ProcurementProduct;
}) {
  const data = useLiveChartData();
  return (
    <>
      <Modal.Header closeButton>
        <div className="custom-modal-title">{product.itemName}</div>
      </Modal.Header>
      <Modal.Body>
        <Line options={options} data={data} />
      </Modal.Body>
    </>
  );
}
