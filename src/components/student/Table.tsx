import { Student } from "@/types/models";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import EditableString from "./cell/EditableString";
import { FilterProp } from "./types";
import SearchBox from "./SearchBox";
import * as student from "@/utils/student";
import { useDialog } from "@/hooks/useDialog";
import Add from "./Add";

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

  //#region sync head and body
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const header = headerRef.current;
    const body = bodyRef.current;

    if (!header || !body) return;

    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      return () => {
        target.scrollLeft = source.scrollLeft;
      };
    };

    const onBodyScroll = syncScroll(body, header);
    const onHeaderScroll = syncScroll(header, body);

    body.addEventListener("scroll", onBodyScroll);
    header.addEventListener("scroll", onHeaderScroll);

    return () => {
      body.removeEventListener("scroll", onBodyScroll);
      header.removeEventListener("scroll", onHeaderScroll);
    };
  }, []);

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
      accessorKey: "id",
      header: "ID",
      cell: (props) => (
        <p className="text-textBody font-mono text-base ">{props.getValue()}</p>
      ),
      minSize: 150,
      maxSize: containerWidth ? containerWidth * 0.5 : undefined,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: EditableString,

      minSize: 250,
      maxSize: containerWidth ? containerWidth * 0.5 : undefined,
    },
    {
      accessorKey: "note",
      header: "Short Note",
      cell: EditableString,
      maxSize: containerWidth ? containerWidth * 0.5 : undefined,
      minSize: 150,
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
    columnResizeDirection: "rtl",
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
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  //#endregion

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col gap-4 overflow-hidden max-w-full w-full select-none"
      >
        <div className="flex flex-row items-center justify-between">
          <SearchBox
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
          <Add refreshHandler={loadData} />
        </div>
        {/** TABLE */}
        <div ref={headerRef} className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-primary sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={clsx(
                        "p-2 text-left align-middle font-bold text-base text-background uppercase border",
                        "relative bg-primary group"
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
                  ))}
                </tr>
              ))}
            </thead>
          </table>
        </div>
        {/** ROW */}
        <div ref={bodyRef} className="overflow-auto flex-1">
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
        <div
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
        </div>
      )}
    </>
  );
};

export default Table;
