import { useEffect, useRef, useState } from "react";
import InputBox from "@/components/InputBox";
import { Respondent } from "@/types/models";
import { Column, Row } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { Toaster, toaster } from "@/components/ui/toaster";

interface IEditableCell {
  getValue: () => string;
  row: Row<Respondent>;
  column: Column<Respondent>;
  table: any;
}

const EditableString = ({ getValue, row, column, table }: IEditableCell) => {
  const initialValue = getValue();
  const [input, setInput] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const isSubmittingRef = useRef(false); // Track if check button was clicked

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

  const handleUpdate = () => {
    isSubmittingRef.current = true;
    table.options.meta?.updateData(row.index, column.id, input);
    setIsEditing(false);
    toaster.create({
      title: "Updated Successfully",
      type: "info",
    });
  };

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  return (
    <div className="flex w-full flex-row gap-2" onFocus={onFocus}>
      <InputBox
        containerClassname="flex flex-1 overflow-hidden ellipsis nowrap"
        inputClassName="px-0 border-transparent focus:border-2 focus:border"
        value={input}
        setValue={setInput}
        onBlur={onBlur}
      />
      {isEditing && (
        <button
          className="text-textBody"
          onMouseDown={() => {
            // This ensures blur doesn't reset value when button is clicked
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
