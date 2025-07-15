import { useSortable } from "@dnd-kit/sortable";
import { Header, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { CSS } from "@dnd-kit/utilities";

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
      {...listeners}
      className={clsx(
        "p-1 text-center align-middle font-bold text-xs text-textBody uppercase border border-textBody sticky top-0 z-10",
        "relative bg-panel group"
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      {!header.isPlaceholder && (
        <>
          {flexRender(header.column.columnDef.header, header.getContext())}
          {header.column.getCanSort() &&
            ({
              asc: " ↑",
              desc: " ↓",
            }[header.column.getIsSorted() as string] ??
              null)}
        </>
      )}

      {header.column.getCanResize() && (
        <div
          className={clsx(
            "absolute opacity-0 top-0 left-0 h-full w-2 cursor-col-resize select-none touch-none",
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
