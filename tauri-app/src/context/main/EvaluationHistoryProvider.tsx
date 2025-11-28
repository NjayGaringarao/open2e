import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAllEvaluations,
  getEvaluationsByDateRange,
} from "@/database/analytics/queries";
import type { EvaluationData } from "@/database/analytics/types";

interface EvaluationHistoryContextType {
  evaluations: EvaluationData[];
  filteredEvaluations: EvaluationData[];
  groupedEvaluations: { [date: string]: EvaluationData[] };
  loading: boolean;
  fromDate: string;
  toDate: string;
  sortOrder: "asc" | "desc";
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  refreshEvaluations: () => Promise<void>;
}

const EvaluationHistoryContext =
  createContext<EvaluationHistoryContextType | null>(null);

export const EvaluationHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<
    EvaluationData[]
  >([]);
  const [groupedEvaluations, setGroupedEvaluations] = useState<{
    [date: string]: EvaluationData[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadEvaluations = async () => {
    setLoading(true);
    try {
      let data: EvaluationData[];

      if (fromDate && toDate) {
        // Convert ISO strings to YYYY-MM-DD format for database query
        const startDateFormatted = new Date(fromDate)
          .toISOString()
          .split("T")[0];
        const endDateFormatted = new Date(toDate).toISOString().split("T")[0];
        data = await getEvaluationsByDateRange(
          startDateFormatted,
          endDateFormatted
        );
      } else {
        data = await getAllEvaluations();
      }

      // Sort by created_at
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      setEvaluations(data);
      setFilteredEvaluations(sortedData);
      setGroupedEvaluations(groupByDate(sortedData));
    } catch (error) {
      console.error("Failed to load evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (evaluations: EvaluationData[]) => {
    const grouped: { [date: string]: EvaluationData[] } = {};

    evaluations.forEach((evaluation) => {
      const date = new Date(evaluation.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(evaluation);
    });

    return grouped;
  };

  const refreshEvaluations = async () => {
    await loadEvaluations();
  };

  useEffect(() => {
    loadEvaluations();
  }, [fromDate, toDate, sortOrder]);

  const value: EvaluationHistoryContextType = {
    evaluations,
    filteredEvaluations,
    groupedEvaluations,
    loading,
    fromDate,
    toDate,
    sortOrder,
    setFromDate,
    setToDate,
    setSortOrder,
    refreshEvaluations,
  };

  return (
    <EvaluationHistoryContext.Provider value={value}>
      {children}
    </EvaluationHistoryContext.Provider>
  );
};

export const useEvaluationHistory = () => {
  const context = useContext(EvaluationHistoryContext);
  if (!context) {
    throw new Error(
      "useEvaluationHistory must be used within an EvaluationHistoryProvider"
    );
  }
  return context;
};
