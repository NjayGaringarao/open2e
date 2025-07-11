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
import { useState } from "react";
import EditableString from "./cell/EditableString";
import { FilterProp } from "./types";
import SearchBox from "./SearchBox";

// Extend TableMeta to include updateData
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    updateData: (rowIndex: number, columnId: string, value: any) => void;
  }
}

const DATAPLACEHOLDER: Respondent[] = [
  {
    respondent_id: "22-1-6-0004",
    name: "Nino Jr",
    label: "Developer",
  },
  {
    respondent_id: "22-1-7-0000",
    name: "Alyssa Jane Marquez",
    label: "Researcher",
  },
  {
    respondent_id: "22-1-7-0001",
    name: "John Paul Marquez",
    label: "Assistant",
  },
];

const columns: ColumnDef<Respondent, any>[] = [
  {
    accessorKey: "respondent_id",
    header: "ID",
    cell: (props) => (
      <p className="text-textBody font-mono text-base ">{props.getValue()}</p>
    ),
    minSize: 150,
    size: 150,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: EditableString,
    size: 300,
    minSize: 250,
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: EditableString,
    size: 200,
    minSize: 150,
  },
];

const Table = () => {
  const [data, setData] = useState<Respondent[]>(DATAPLACEHOLDER);
  const [columnFilters, setColumnFilters] = useState<FilterProp[]>([]);

  const table = useReactTable<Respondent>({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
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

  return (
    <>
      <SearchBox
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      {/** TABLE */}
      <Box w={table.getTotalSize()} className="rounded-md overflow-hidden">
        {/** HEADER */}
        {table.getHeaderGroups().map((headerGroup) => (
          <Box key={headerGroup.id} className="flex w-fit bg-primary">
            {/** Mapping all the headers */}
            {headerGroup.headers.map((header) => (
              <Box
                className={clsx(
                  "relative flex items-start p-2",
                  "font-bold text-base text-background uppercase border"
                )}
                w={header.getSize()}
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : header.column.columnDef.header &&
                    typeof header.column.columnDef.header === "function"
                  ? header.column.columnDef.header(header.getContext())
                  : header.column.columnDef.header}

                <Box
                  className={clsx(
                    "absolute opacity-0 top-0 right-0 h-full w-2 rounded-md select-none touch-none cursor-col-resize",
                    header.column.getIsResizing()
                      ? "bg-primary"
                      : "bg-textBody",
                    "hover:opacity-100"
                  )}
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                />
              </Box>
            ))}
          </Box>
        ))}
        {/** ROW */}
        {table.getRowModel().rows.map((row) => (
          <Box
            key={row.id}
            className="flex w-fit items-center border-b border-textBody border-opacity-50"
          >
            {row.getVisibleCells().map((cell) => (
              <Box
                className="p-2 max-w-full"
                w={cell.column.getSize()}
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Table;
