import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Student } from "@/types/models";
import clsx from "clsx";
import InputBox from "../InputBox";
import DraggableHeader from "./DraggableHeader";
import CreateStudent from "../student/CreateStudent";
import { useStudent } from "@/context/main/student";
import { SearchIcon, UserRoundX } from "lucide-react";
import { useTag } from "@/context/main/tag";
import ManageTag from "../student/ManageTag";
import Select from "../Select";

interface StudentTableProps {
  mode?: "SELECTION.multiple" | "SELECTION.single" | "MAIN";
  disabledRowIds?: string[];
  onRowClick?: (student: Student) => void;
  onSelectionChange?: (selected: Student[]) => void;
  columnVisibility?: Record<string, boolean>;
  footerActions?: React.ReactNode;
  height?: string;
  containerClassname?: string;
}

const StudentTable = ({
  mode = "SELECTION.multiple",
  disabledRowIds = [],
  onRowClick,
  onSelectionChange,
  footerActions,
  containerClassname,
}: StudentTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const { fetchStudentList, studentList: data } = useStudent();
  const { tagList: tags } = useTag();

  const sensors = useSensors(useSensor(PointerSensor));

  const filteredStudents = useMemo(() => {
    const base =
      tagFilter === "All"
        ? data
        : data.filter((s) => s.tag?.label === tagFilter);

    const lower = globalFilter.toLowerCase();
    return base.filter(
      (s) =>
        `${s.first_name} ${s.middle_name ?? ""} ${s.last_name}`
          .toLowerCase()
          .includes(lower) || s.tag?.label.toLowerCase().includes(lower)
    );
  }, [data, globalFilter, tagFilter]);

  const columns: ColumnDef<Student, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4 accent-primary"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            e.stopPropagation();
            row.toggleSelected();
          }}
          className="w-4 h-4 accent-primary"
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: (props) => (
        <p className="text-uGrayLight font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: (props) => (
        <p className="text-uGrayLight font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "middle_name",
      header: "Middle Name",
      cell: (props) => (
        <p className="text-uGrayLight font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: (props) => (
        <p className="text-uGrayLight font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "tag.label",
      header: "Tag",
      cell: ({ row }) => (
        <p className="text-uGrayLight font-mono text-base truncate">
          {row.original.tag?.label ?? "—"}
        </p>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: { sorting, rowSelection, columnOrder },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    enableSorting: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    getRowId: (row) => row.id,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
  });

  useEffect(() => {
    // IF :  Selection should be single, implement this:

    if (mode === "SELECTION.single") {
      const keys = Object.keys(rowSelection);
      if (keys.length > 1) {
        setRowSelection({ [keys[0]]: true });
      }
    }

    onSelectionChange?.(
      table.getSelectedRowModel().rows.map((row) => row.original)
    );
  }, [rowSelection]);

  useEffect(() => {
    if (columnOrder.length === 0 && table.getAllLeafColumns().length > 0) {
      setColumnOrder(table.getAllLeafColumns().map((col) => col.id));
    }
  }, [table, columnOrder]);

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 overflow-hidden",
        containerClassname
      )}
    >
      <div className="flex gap-2 w-full justify-between items-center">
        <div className="flex gap-2 items-center group">
          <SearchIcon className="text-uGrayLight h-10 w-10 group-hover:text-primary" />
          <InputBox
            placeholder="Search here..."
            value={globalFilter}
            setValue={setGlobalFilter}
            inputClassName="py-1 px-2 group-hover:border-primary"
            containerClassname="col-span-2"
          />

          <Select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="All">All Tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.label}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>

        {mode === "MAIN" && (
          <div className="flex flex-row gap-2">
            <CreateStudent refreshHandler={fetchStudentList} />
            <ManageTag />
          </div>
        )}
      </div>

      <div className={clsx("overflow-y-auto rounded-md h-full")}>
        <table className="w-full table-fixed select-none">
          <thead className="sticky top-0 text-uGrayLight text-sm uppercase">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (active.id !== over?.id) {
                  setColumnOrder((prev) => {
                    const oldIndex = prev.indexOf(active.id as string);
                    const newIndex = prev.indexOf(over?.id as string);
                    return arrayMove(prev, oldIndex, newIndex);
                  });
                }
              }}
            >
              <SortableContext
                items={table
                  .getAllLeafColumns()
                  .filter((col) => col.id !== "select")
                  .map((col) => col.id)}
                strategy={horizontalListSortingStrategy}
              >
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) =>
                      header.column.id === "select" ? (
                        <th
                          key={header.id}
                          className="p-2 text-left font-semibold bg-panel border border-uGrayLight"
                          style={{ width: header.getSize() }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ) : (
                        <DraggableHeader key={header.id} header={header} />
                      )
                    )}
                  </tr>
                ))}
              </SortableContext>
            </DndContext>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={clsx(
                  row.getIsSelected() && "bg-secondary",
                  disabledRowIds.includes(row.original.id)
                    ? "opacity-40 cursor-not-allowed bg-secondary"
                    : "cursor-pointer hover:bg-secondary",
                  "border-b border-panel"
                )}
                onClick={() => {
                  const isDisabled = disabledRowIds.includes(row.original.id);
                  if (isDisabled) return;

                  if (mode !== "MAIN") {
                    row.toggleSelected();
                    onRowClick?.(row.original);
                  } else {
                    onRowClick?.(row.original);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const isSelectCell = cell.column.id === "select";
                  return (
                    <td
                      key={cell.id}
                      className="p-2"
                      style={{ width: cell.column.getSize() }}
                      onClick={
                        isSelectCell ? (e) => e.stopPropagation() : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <div className="h-24"></div>
            {filteredStudents.length === 0 && (
              <div
                className={clsx(
                  "absolute bottom-0 w-full p-6 rounded-md bg-panel",
                  "flex flex-row gap-4 items-center justify-center",
                  "text-uGrayLight text-lg"
                )}
              >
                <UserRoundX /> <p>No student to show</p>
              </div>
            )}
          </tbody>
        </table>
      </div>

      {footerActions && (
        <div className="flex justify-end gap-2 pt-2">{footerActions}</div>
      )}
    </div>
  );
};

export default StudentTable;
