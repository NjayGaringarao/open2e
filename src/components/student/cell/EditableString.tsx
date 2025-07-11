import { useEffect, useRef, useState } from "react";
import InputBox from "@/components/InputBox";
import { Student } from "@/types/models";
import { Column, Row } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { Toaster, toaster } from "@/components/ui/toaster";
import * as student from "@/utils/student";
import clsx from "clsx";
interface IEditableCell {
  getValue: () => string;
  row: Row<Student>;
  column: Column<Student>;
  table: any;
}

const EditableString = ({ getValue, row, column, table }: IEditableCell) => {
  const initialValue = getValue();
  const [input, setInput] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState<string | undefined>();
  const isSubmittingRef = useRef(false);

  const onBlur = () => {
    // If check button is clicked, skip reset
    if (isSubmittingRef.current) {
      isSubmittingRef.current = false;
      return;
    }

    setIsEditing(false);
    setInput(initialValue); // Reset input if not submitting
  };

  const onFocus = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    isSubmittingRef.current = true;

    if (!columnName) {
      console.warn("No accessorKey found for editable column.");
      return;
    }

    if (columnName !== "name" && columnName !== "note") {
      console.warn(`Unsupported column update attempted: ${columnName}`);
      return;
    }

    const { error } = await student.update(row.original.id, columnName, input);

    if (error) {
      toaster.create({
        title: "Update Failed",
        type: "error",
      });

      isSubmittingRef.current = false;
      onBlur();
    } else {
      table.options.meta?.updateData(row.index, columnName, input);

      setIsEditing(false);
      toaster.create({
        title: "Updated Successfully",
        type: "info",
      });
    }
  };

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setColumnName((column.columnDef as { accessorKey?: string }).accessorKey);
  }, []);

  return (
    <div className="flex w-full flex-row gap-2" onFocus={onFocus}>
      <InputBox
        containerClassname="flex flex-1 overflow-hidden ellipsis nowrap"
        inputClassName={clsx(
          "px-0 border-transparent focus:border-2 focus:border",
          columnName === "note" ? "opacity-50" : ""
        )}
        value={input}
        setValue={setInput}
        onBlur={onBlur}
      />
      {isEditing && (
        <button
          className="text-textBody"
          onMouseDown={() => {
            isSubmittingRef.current = true;
          }}
          onClick={handleUpdate}
        >
          <Check />
        </button>
      )}
      <Toaster />
    </div>
  );
};

export default EditableString;
