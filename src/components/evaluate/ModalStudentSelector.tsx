import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { Tag, Student } from "@/types/models";
import InputBox from "../InputBox";

interface StudentSelectorModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  students: Student[];
  tags: Tag[];
  selectionMode: "single" | "multiple";
  onSubmit: (selected: Student[]) => void;
  disabledStudentIds?: string[];
}

const ModalStudentSelector = ({
  isVisible,
  setIsVisible,
  students,
  tags,
  selectionMode,
  onSubmit,
  disabledStudentIds,
}: StudentSelectorModalProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filteredStudents = useMemo(() => {
    if (tagFilter === "All") return students;
    return students.filter((s) => s.tag?.label === tagFilter);
  }, [tagFilter, students]);

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
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
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 accent-primary"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "first_name",
        header: "First Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "middle_name",
        header: "Middle Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "tag.label",
        header: "Tag",
        cell: ({ row }) => row.original.tag?.label ?? "—",
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: { globalFilter, sorting, rowSelection },
    enableRowSelection: (row) => !disabledStudentIds?.includes(row.original.id),
    enableMultiRowSelection: (row) =>
      selectionMode === "multiple" &&
      !disabledStudentIds?.includes(row.original.id),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  });

  const handleSubmit = () => {
    const selected = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onSubmit(selected);
    setIsVisible(false);
  };

  useEffect(() => {
    if (selectionMode === "single") {
      const keys = Object.keys(rowSelection);
      if (keys.length > 1) {
        const firstKey = keys[0];
        setRowSelection({ [firstKey]: true });
      }
    }
  }, [rowSelection, selectionMode]);

  return (
    <Transition appear show={isVisible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-90" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={clsx(
                "rounded-lg bg-background transform transition-all overflow-hidden",
                "flex flex-col w-[52rem] max-h-[85vh]"
              )}
            >
              <div className="p-6 flex flex-col gap-4 overflow-hidden">
                <DialogTitle className="text-2xl font-semibold text-primary">
                  Select Student{selectionMode === "multiple" ? "s" : ""}
                </DialogTitle>

                <div className="flex flex-row justify-between gap-2">
                  <InputBox
                    placeholder="Search by name or tag..."
                    value={globalFilter}
                    setValue={setGlobalFilter}
                    inputClassName="py-1 px-2"
                    containerClassname="w-full"
                  />
                  <select
                    className="text-textBody px-3 py-1 border border-textBody rounded-md"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                  >
                    <option value="All">All Tags</option>
                    {tags.map((t) => (
                      <option key={t.id} value={t.label}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="overflow-y-auto border rounded-md max-h-[45vh]">
                  <table className="w-full table-fixed text-sm">
                    <thead className="sticky top-0 bg-primary text-background">
                      {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                          {hg.headers.map((header) => (
                            <th
                              key={header.id}
                              className="p-2 text-left font-semibold"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " ↑",
                                desc: " ↓",
                              }[header.column.getIsSorted() as string] ?? null}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className={clsx(
                            row.getIsSelected() && "bg-primary/10",
                            disabledStudentIds?.includes(row.original.id)
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer hover:bg-primary/10"
                          )}
                          onClick={() => {
                            if (
                              !disabledStudentIds?.includes(row.original.id)
                            ) {
                              row.toggleSelected();
                            }
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="p-2">
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

                <div className="flex flex-row justify-end gap-3 pt-2">
                  <button
                    className="text-sm px-4 py-2 border rounded-md hover:brightness-110"
                    onClick={() => setIsVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-sm px-4 py-2 bg-primary text-background rounded-md hover:brightness-110"
                    onClick={handleSubmit}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalStudentSelector;
