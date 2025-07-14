import { Student } from "@/types/models";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FilterProp } from "./types";
import SearchBox from "./SearchBox";
import * as student from "@/utils/student";
import { useDialog } from "@/hooks/useDialog";
import CreateStudent from "./CreateStudent";
import ModalEditStudent from "./ModalEditStudent";

// Extend TableMeta to include updateData
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    updateData: (rowIndex: number, columnId: string, value: any) => void;
  }
}

const Table = () => {
  const [data, setData] = useState<Student[]>([]);
  const { alert, confirm } = useDialog();
  const [columnFilters, setColumnFilters] = useState<FilterProp[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [onEditStudent, setOnEditStudent] = useState<Student | null>(null);

  const loadData = async () => {
    const { error, students } = await student.getAll();
    if (error) {
      alert({
        title: "Failed to Initialize",
        description: error,
        mode: "ERROR",
      });
    }
    setData(students ?? []);
  };

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
      loadData(); // reload from DB
    });
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
      size: 40,
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
      header: "Name",
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: "last_name",
          header: "Last",
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
          header: "First",
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
          header: "Middle",
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
      ],
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
    data,
    columns,
    state: {
      columnFilters,
      rowSelection,
    },
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="relative flex flex-col gap-4 max-w-full overflow-y-hidden">
      <div className="flex flex-row items-center justify-between">
        <SearchBox
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <CreateStudent refreshHandler={loadData} />
      </div>
      {/** Changing this DIV into TABLE will result in full width occupation.
       *   HOWEVER, Sticky thead and y-scrolling tbody will become a single unscrolled one.
       */}
      <div className="w-full overflow-y-auto">
        <thead className="bg-panel select-none w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(
                      "p-1 text-center align-middle font-bold text-base text-textBody uppercase border border-textBody sticky top-0 z-10",
                      "relative bg-panel group"
                    )}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanResize() && (
                      <div
                        className={clsx(
                          "absolute opacity-0 top-0 left-0 h-full w-2 cursor-col-resize select-none touch-none",
                          header.column.getIsResizing()
                            ? "bg-secondary"
                            : "bg-textBody",
                          "group-hover:opacity-100"
                        )}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {data.length ? (
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
      </div>
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
        refreshHandler={loadData}
      />
    </div>
  );
};

export default Table;
