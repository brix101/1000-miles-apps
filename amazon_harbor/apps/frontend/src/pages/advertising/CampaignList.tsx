import PageHeaderContainer from "@/components/container/page-header-Container";
import { campaignListColumns } from "@/components/data-table/columns/campaign-list-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Icons } from "@/components/icons";
import CampaignStatusSearchSelect from "@/components/search-select/campaign-status-search-select";
import DateRangeSearchSelect from "@/components/search-select/date-range-search-select";
import { Button } from "@/components/ui/button";
import { defaultCampaignStatus } from "@/contant/index.constant";
import useGetCampaigns from "@/hooks/queries/useGetCampaigns";
import useCreateQuery from "@/hooks/useCreateQuery";
import { ICampaignQuery } from "@/services/campaign.service";
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
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useSearchParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CampaignList() {
  const intervalKey = "interval";
  const currentDate = dayjs().subtract(2, "day").toISOString();
  const defaultInterval = `${currentDate}--${currentDate}`;

  const [searchParams] = useSearchParams();
  const [query, updateQuery] = useCreateQuery<ICampaignQuery>({
    status: searchParams.get("status") || defaultCampaignStatus,
    interval: searchParams.get(intervalKey) || defaultInterval,
  });

  const { data, isLoading, isFetching } = useGetCampaigns(query);

  return (
    <>
      <div className="d-flex justify-content-between">
        <PageHeaderContainer>Campaigns</PageHeaderContainer>
        <div>
          <Button size="sm" className="d-none" disabled={isLoading}>
            Download Excel
          </Button>
        </div>
      </div>
      <div className="col-5 row d-flex mb-2">
        <CampaignStatusSearchSelect />
      </div>
      <div className="col-8 row mb-2">
        <DateRangeSearchSelect
          intervalKey={intervalKey}
          defaultInterval={defaultInterval}
        />
      </div>

      <ChartDataComponent />
      <DataTable
        data={data || []}
        columns={campaignListColumns}
        isLoading={isLoading}
        toolBarChildren={
          <div className="d-flex align-items-center">
            <Button
              size="sm"
              className="d-flex justify-content-center"
              style={{
                width: " 200px",
              }}
              onClick={updateQuery}
              disabled={isFetching}
            >
              {isFetching ? (
                <span className="spinner-border spinner-border-xs"></span>
              ) : null}
              <span className="px-2">Apply</span>
            </Button>
          </div>
        }
        // enableToolbar={false}
      />
    </>
  );
}

function ChartDataComponent() {
  const [isClose, setIsClose] = useState(false);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  const labels = [
    "Jan 11",
    "Jan 12",
    "Jan 13",
    "Jan 14",
    "Jan 15",
    "Jan 16",
    "Jan 17",
    "Jan 18",
  ];

  const graphData = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.floor(Math.random() * (1000 - 0 + 1)) + 0),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => Math.floor(Math.random() * (1000 - 0 + 1)) + 0),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="row d-none">
      <div className="col-11 card">
        <Line
          options={options}
          data={graphData}
          style={{ height: isClose ? "35px" : "484px" }}
        />
      </div>
      <div className="col-1">
        <Button size="icon" onClick={() => setIsClose((prev) => !prev)}>
          {isClose ? <Icons.FiChevronDown /> : <Icons.FiChevronUp />}
        </Button>
      </div>
    </div>
  );
}

export default CampaignList;
