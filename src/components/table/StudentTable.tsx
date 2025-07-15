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
import { Student, Tag } from "@/types/models";
import clsx from "clsx";
import InputBox from "../InputBox";
import DraggableHeader from "./DraggableHeader";
import CreateStudent from "../student/CreateStudent";
import { useStudent } from "@/context/student";

interface StudentTableProps {
  mode?: "SELECTION" | "MAIN";
  data: Student[];
  tags?: Tag[];
  enableTagFilter?: boolean;
  enableGlobalSearch?: boolean;
  selectionMode?: "none" | "single" | "multiple";
  disabledRowIds?: string[];
  onRowClick?: (student: Student) => void;
  onSelectionChange?: (selected: Student[]) => void;
  columnVisibility?: Record<string, boolean>;
  footerActions?: React.ReactNode;
  showCreateButton?: boolean;
  height?: string;
}

const StudentTable = ({
  mode = "SELECTION",
  data,
  tags = [],
  enableTagFilter = false,
  enableGlobalSearch = false,
  selectionMode = "none",
  disabledRowIds = [],
  onRowClick,
  onSelectionChange,
  footerActions,
  showCreateButton = false,
  height = "max-h-[60vh]",
}: StudentTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const { fetchStudentList } = useStudent();

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
        <p className="text-textBody font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: (props) => (
        <p className="text-textBody font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "middle_name",
      header: "Middle Name",
      cell: (props) => (
        <p className="text-textBody font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: (props) => (
        <p className="text-textBody font-mono text-base truncate">
          {props.getValue()}
        </p>
      ),
    },
    {
      accessorKey: "tag.label",
      header: "Tag",
      cell: ({ row }) => (
        <p className="text-textBody font-mono text-base truncate">
          {row.original.tag?.label ?? "—"}
        </p>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: { sorting, rowSelection, columnOrder },
    enableRowSelection: selectionMode !== "none",
    enableMultiRowSelection: selectionMode === "multiple",
    onRowSelectionChange: setRowSelection,
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
    if (selectionMode === "single") {
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
    <div className="flex flex-col gap-2 overflow-hidden">
      {(enableGlobalSearch || enableTagFilter || showCreateButton) && (
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            {enableGlobalSearch && (
              <InputBox
                placeholder="Search by name or tag..."
                value={globalFilter}
                setValue={setGlobalFilter}
                inputClassName="py-1 px-2"
              />
            )}
            {enableTagFilter && (
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="text-textBody px-3 py-1 border border-textBody rounded-md outline-none focus:border-primary"
              >
                <option value="All">All Tags</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.label}>
                    {t.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          {showCreateButton && (
            <CreateStudent refreshHandler={fetchStudentList} />
          )}
        </div>
      )}

      <div className={clsx("overflow-y-auto rounded-md", height)}>
        <table className="w-full table-fixed select-none">
          <thead className="sticky top-0 text-textBody text-sm uppercase">
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
                          className="p-2 text-left font-semibold bg-panel border border-textBody"
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

                  if (mode === "SELECTION") {
                    row.toggleSelected();
                    onRowClick?.(row.original);
                  } else if (mode === "MAIN") {
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
