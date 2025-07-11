import { Respondent } from "@/types/models";
import { Box } from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import EditableString from "./cell/EditableString";
import { FilterProp } from "./types";
import SearchBox from "./SearchBox";
import { getAll } from "@/utils/respondent";
import { useDialog } from "@/hooks/useDialog";
import * as respondent from "@/utils/respondent";
// Extend TableMeta to include updateData
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    updateData: (rowIndex: number, columnId: string, value: any) => void;
  }
}

const columns: ColumnDef<Respondent, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        className="w-5 h-5 accent-primary"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="w-5 h-5 accent-primary"
      />
    ),
    size: 40,
    enableResizing: false,
  },
  {
    accessorKey: "respondent_id",
    header: "ID",
    cell: (props) => (
      <p className="text-textBody font-mono text-base ">{props.getValue()}</p>
    ),
    minSize: 150,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: EditableString,

    minSize: 250,
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: EditableString,

    minSize: 150,
  },
];

const Table = () => {
  const [data, setData] = useState<Respondent[]>([]);
  const { alert, confirm } = useDialog();
  const [columnFilters, setColumnFilters] = useState<FilterProp[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const initialize = async () => {
    const { error, respondents } = await getAll();

    if (error) {
      alert({
        title: "Failed to Initialize",
        description: error,
        mode: "ERROR",
      });
    }
    setData(respondents ?? []);
  };

  const handleDelete = async () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((r) => r.original.respondent_id);

    if (
      !confirm({
        title: "Confirm Delete",
        description: "Are you sure you want to delete this respondent?",
        mode: "CRITICAL",
      })
    )
      return;

    Promise.all(selectedIds.map((id) => respondent.remove(id))).then(() => {
      setRowSelection({});
      initialize(); // reload from DB
    });
  };

  const table = useReactTable<Respondent>({
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
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    } as TableMeta<{
      updateData: (rowIndex: number, columnId: string, value: any) => void;
    }>,
  });

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 max-h-full overflow-hidden select-none">
        <SearchBox
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        {/** TABLE */}
        <div className="overflow-x-auto rounded-md">
          <table className="w-full table-fixed">
            <thead className="bg-primary sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={clsx(
                        "p-2 text-left align-middle font-bold text-base text-background uppercase border",
                        "relative bg-primary"
                      )}
                      style={{ width: header.getSize() }}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                      {header.column.getCanResize() && (
                        <Box
                          className={clsx(
                            "absolute opacity-0 top-0 right-0 h-full w-2 cursor-col-resize select-none touch-none",
                            header.column.getIsResizing()
                              ? "bg-secondary"
                              : "bg-textBody",
                            "hover:opacity-100"
                          )}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          </table>
        </div>
        {/** ROW */}
        <div className="overflow-auto flex-1">
          <table className="w-full table-fixed">
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-textBody border-opacity-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-2 align-middle"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {Object.keys(rowSelection).length > 0 && (
        <Box
          className={clsx(
            "mt-4 bg-panel p-4 w-full",
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
        </Box>
      )}
    </>
  );
};

export default Table;
