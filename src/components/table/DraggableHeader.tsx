import { useSortable } from "@dnd-kit/sortable";
import { Header, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { CSS } from "@dnd-kit/utilities";
import { Move } from "lucide-react";

const DraggableHeader = <T,>({ header }: { header: Header<T, unknown> }) => {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({ id: header.column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: header.getSize(),
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={clsx(
        "p-1 text-center align-middle font-bold text-xs text-textBody uppercase border border-textBody sticky top-0 z-10",
        "relative bg-panel group"
      )}
    >
      {/* Wrapping content in a clickable div */}
      <div
        onClick={header.column.getToggleSortingHandler()}
        className="flex items-center justify-center cursor-pointer select-none"
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {header.column.getCanSort() &&
          ({
            asc: " ↑",
            desc: " ↓",
          }[header.column.getIsSorted() as string] ??
            " ⇅")}
      </div>

      {/* Drag handle — smaller area to avoid hijacking click */}
      <div
        {...listeners}
        className="absolute left-1 top-1 cursor-grab rounded-sm"
        title="Drag to reorder"
      >
        <Move className="text-primary w-5 h-5 opacity-0 group-hover:opacity-100" />
      </div>

      {header.column.getCanResize() && (
        <div
          className={clsx(
            "absolute opacity-0 top-0 right-0 h-full w-2 cursor-col-resize select-none touch-none",
            header.column.getIsResizing() ? "bg-secondary" : "bg-textBody",
            "group-hover:opacity-100"
          )}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
        />
      )}
    </th>
  );
};

export default DraggableHeader;
