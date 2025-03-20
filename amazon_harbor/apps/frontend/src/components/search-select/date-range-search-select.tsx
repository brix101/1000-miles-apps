import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { useSearchParams } from "react-router-dom";
dayjs.extend(utc);

import "react-datepicker/dist/react-datepicker.css";

export interface DateRangeSearchSelectProps {
  intervalKey?: string;
  isDisabled?: boolean;
  defaultInterval?: string;
}
const initialDate = dayjs().subtract(2, "day");
export const defaultQueryInterval = `${initialDate.toISOString()}--${initialDate.toISOString()}`;

function DateRangeSearchSelect({
  intervalKey = "interval",
  defaultInterval,
  isDisabled,
}: DateRangeSearchSelectProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialInterval = defaultInterval || defaultQueryInterval;
  const interval = searchParams.get(intervalKey) || initialInterval;

  const [startDateString, endDateString] = interval.split("--");
  const startDate = dayjs(startDateString).utcOffset(0).toDate();
  const endDate = dayjs(endDateString).utcOffset(0).toDate();

  useEffect(() => {
    if (!isDisabled) {
      searchParams.set(intervalKey, interval);
    } else {
      searchParams.delete(intervalKey);
    }
    setSearchParams(searchParams);
  }, [isDisabled]);

  function onStartDateChange(date: Date | null) {
    const selectedDate = dayjs(date).utcOffset(0).toISOString();
    const newInterval = `${selectedDate}--${endDateString}`;

    searchParams.set(intervalKey, newInterval);
    setSearchParams(searchParams);
  }

  function onEndDateChange(date: Date | null) {
    const selectedDate = dayjs(date).utcOffset(0).toISOString();
    const newInterval = `${startDateString}--${selectedDate}`;

    searchParams.set(intervalKey, newInterval);
    setSearchParams(searchParams);
  }

  return (
    <>
      <div className="col-6 row">
        <label className="col-4 col-form-label text-nowrap">Start Date</label>
        <div className="col-8">
          <DatePicker
            disabled={isDisabled}
            className="form-select"
            selected={startDate}
            onChange={onStartDateChange}
            maxDate={endDate}
            dateFormat="MMM-dd, yyyy"
          />
        </div>
      </div>
      <div className="col-6 row">
        <label className="col-4 col-form-label text-nowrap">End Date</label>
        <div className="col-8">
          <DatePicker
            disabled={isDisabled}
            className="form-select"
            selected={endDate}
            onChange={onEndDateChange}
            minDate={startDate}
            maxDate={initialDate.toDate()}
            dateFormat="MMM-dd, yyyy"
          />
        </div>
      </div>
    </>
  );
}

export default DateRangeSearchSelect;
