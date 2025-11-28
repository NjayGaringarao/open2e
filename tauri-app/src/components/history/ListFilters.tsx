import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import DateRangePicker from "@/components/DateRangePicker";
import { useEvaluationHistory } from "@/context/main/useEvaluationHistory";
import { cn } from "@/utils/style";

const ListFilters = () => {
  const { fromDate, toDate, setFromDate, setToDate, sortOrder, setSortOrder } =
    useEvaluationHistory();
  const [isSortAsc, setIsSortAsc] = useState(sortOrder === "asc");

  const handleSortToggle = () => {
    const newSortOrder = isSortAsc ? "desc" : "asc";
    setIsSortAsc(!isSortAsc);
    setSortOrder(newSortOrder);
  };

  const formatDateForPicker = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleFromDateChange = (date: string) => {
    // DateRangePicker returns YYYY-MM-DD format, convert to ISO string
    const isoDate = new Date(date + "T00:00:00.000Z").toISOString();
    setFromDate(isoDate);
  };

  const handleToDateChange = (date: string) => {
    // DateRangePicker returns YYYY-MM-DD format, convert to ISO string
    const isoDate = new Date(date + "T23:59:59.999Z").toISOString();
    setToDate(isoDate);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex-1">
        <DateRangePicker
          fromDate={formatDateForPicker(fromDate)}
          toDate={formatDateForPicker(toDate)}
          setFromDate={handleFromDateChange}
          setToDate={handleToDateChange}
          containerClassName="w-full"
          inputClassName="w-full"
        />
      </div>

      <button
        onClick={handleSortToggle}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary",
          "hover:brightness-110 transition-all duration-200",
          "bg-transparent hover:bg-secondary/20"
        )}
        title={`Sort ${isSortAsc ? "Descending" : "Ascending"}`}
      >
        {isSortAsc ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isSortAsc ? "Newest First" : "Oldest First"}
        </span>
      </button>
    </div>
  );
};

export default ListFilters;
