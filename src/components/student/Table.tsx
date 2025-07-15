import { Student } from "@/types/models";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import * as student from "@/utils/student";
import { useDialog } from "@/context/dialog";
import ModalEditStudent from "./ModalEditStudent";
import { useStudent } from "@/context/student";
import { SortingState, getSortedRowModel } from "@tanstack/react-table";
import InputBox from "../InputBox";
import CreateStudent from "./CreateStudent";
import { SearchIcon } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import DraggableHeader from "../table/DraggableHeader";

const Table = () => {
  const { confirm } = useDialog();
  const { studentList, fetchStudentList } = useStudent();
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [rowSelection, setRowSelection] = useState({});
  const [onEditStudent, setOnEditStudent] = useState<Student | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const filteredStudents = useMemo(() => {
    const base =
      tagFilter === "All"
        ? studentList
        : studentList.filter((s) => s.tag?.label === tagFilter);

    const lower = globalFilter.toLowerCase();
    return base.filter(
      (s) =>
        `${s.first_name} ${s.middle_name ?? ""} ${s.last_name}`
          .toLowerCase()
          .includes(lower) || s.tag?.label.toLowerCase().includes(lower)
    );
  }, [studentList, globalFilter, tagFilter]);

  const handleDelete = async () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((r) => r.original.id);

    if (
      !confirm({
        title: "Confirm Delete",
        description: "Are you sure you want to delete this student?",
        mode: "CRITICAL",
      })
    )
      return;

    Promise.all(selectedIds.map((id) => student.remove(id))).then(() => {
      setRowSelection({});
    });
    await fetchStudentList();
  };

  const columns: ColumnDef<Student, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-5 h-5 accent-primary"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-5 h-5 accent-primary"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      minSize: 40,
      maxSize: 40,
      enableResizing: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: (props) => (
        <p
          className={clsx(
            "text-textBody font-mono text-base w-auto",
            "truncate overflow-hidden whitespace-nowrap"
          )}
        >
          {props.getValue()}
        </p>
      ),
      enableResizing: true,
    },

    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: (props) => (
        <p
          className={clsx(
            "text-textBody font-mono text-base w-auto",
            "truncate overflow-hidden whitespace-nowrap"
          )}
        >
          {props.getValue()}
        </p>
      ),
      footer: (props) => props.column.id,
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: (props) => (
        <p
          className={clsx(
            "text-textBody font-mono text-base w-auto",
            "truncate overflow-hidden whitespace-nowrap"
          )}
        >
          {props.getValue()}
        </p>
      ),
      footer: (props) => props.column.id,
    },
    {
      accessorKey: "middle_name",
      header: "Middle Name",
      cell: (props) => (
        <p
          className={clsx(
            "text-textBody font-mono text-base w-auto",
            "truncate overflow-hidden whitespace-nowrap"
          )}
        >
          {props.getValue()}
        </p>
      ),
      footer: (props) => props.column.id,
    },

    {
      accessorKey: "tag.label",
      header: "Tag",
      cell: (props) => (
        <p
          className={clsx(
            "text-textBody font-mono text-base w-auto",
            "truncate overflow-hidden whitespace-nowrap"
          )}
        >
          {props.getValue()}
        </p>
      ),
    },
  ];

  const table = useReactTable<Student>({
    data: filteredStudents,
    columns,
    state: {
      sorting,
      rowSelection,
      columnOrder,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  useEffect(() => {
    if (columnOrder.length === 0 && table.getAllLeafColumns().length > 0) {
      setColumnOrder(table.getAllLeafColumns().map((col) => col.id));
    }
  }, [table, columnOrder]);

  return (
    <>
      <div className="relative flex flex-col gap-4 max-w-full overflow-y-auto">
        <div className="flex gap-2 w-full justify-between">
          <div className="flex flex-row gap-2 items-center group  ">
            <SearchIcon className="text-textBody h-10 w-10 group-hover:text-primary" />

            <InputBox
              placeholder="Search here..."
              value={globalFilter}
              setValue={setGlobalFilter}
              inputClassName="py-1 px-2 group-hover:border-primary"
              containerClassname="col-span-2"
            />
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className={clsx(
                "px-2 py-1 border border-textBody rounded-md text-sm lg:text-base w-auto min-w-44",
                "outline-none focus:border-primary focus:border-2"
              )}
            >
              <option value="All">All Tags</option>
              {[
                ...new Set(
                  studentList.map((s) => s.tag?.label).filter(Boolean)
                ),
              ].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {/** This is only a button with associated modal */}
          <CreateStudent refreshHandler={fetchStudentList} />
        </div>

        <table className="w-full select-none">
          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
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
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) =>
                    header.column.id === "select" ? (
                      <th
                        key={header.id}
                        className="p-1 text-center align-middle font-bold text-xs text-textBody uppercase border border-textBody sticky top-0 z-10 bg-panel"
                        style={{ width: header.getSize() }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ) : (
                      <DraggableHeader<Student>
                        key={header.id}
                        header={header}
                      />
                    )
                  )}
                </tr>
              ))}
            </SortableContext>
          </DndContext>
          {studentList.length ? (
            <tbody className="flex-1">
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-secondary"
                    onClick={() => setOnEditStudent(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="p-2 align-middle border-b border-panel"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <div
              className="bg-panel mt-6 p-4 flex flex-row justify-center items-center"
              style={{ width: table.getTotalSize() }}
            >
              <p className="text-primary font-semibold text-lg">
                No Student to Show.
              </p>
            </div>
          )}

          <div className="h-20"></div>
        </table>
      </div>
      {/** This is an option that show whenever there was a selected row */}
      {Object.keys(rowSelection).length > 0 && (
        <div
          className={clsx(
            "absolute bottom-0 bg-panel p-4 w-full",
            "flex justify-between items-center shadow-md z-50",
            "rounded-md border border-primary"
          )}
        >
          <p className="text-base text-textBody">
            {Object.keys(rowSelection).length} selected
          </p>
          <button
            className="px-4 py-2 bg-uRed text-white rounded-md hover:brightness-110"
            onClick={handleDelete}
          >
            Delete Selected
          </button>
        </div>
      )}

      <ModalEditStudent
        onEditStudent={onEditStudent}
        setOnEditStudent={setOnEditStudent}
        refreshHandler={fetchStudentList}
      />
    </>
  );
};

export default Table;
