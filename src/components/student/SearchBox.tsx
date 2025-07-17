import InputBox from "@/components/InputBox";
import { FilterProp } from "./types";

interface ISearch {
  columnFilters: FilterProp[];
  setColumnFilters: (value: FilterProp[]) => void;
}

const SearchBox = ({ columnFilters, setColumnFilters }: ISearch) => {
  const taskName =
    columnFilters.find((f: FilterProp) => f.id === "name")?.value || "";

  const onFilterChange = (id: string, value: string) => {
    const newFilters = columnFilters
      .filter((f: FilterProp) => f.id !== id)
      .concat({ id, value });

    setColumnFilters(newFilters);
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <p className="text-uGrayLight font-semibold text-lg">Search</p>
      <InputBox
        value={taskName}
        setValue={(e) => onFilterChange("name", e)}
        inputClassName="px-2 py-1"
      />
    </div>
  );
};
export default SearchBox;
