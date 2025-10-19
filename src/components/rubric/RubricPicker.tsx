import { Rubric } from "@/database/rubric";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import clsx from "clsx";
import { useRubric } from "@/context/main/rubric";
import { cn } from "@/utils/style";

interface RubricPickerProps {
  selectedRubricId: number | null;
  onRubricSelect: (rubric: Rubric) => void;
  disabled?: boolean;
}

const RubricPicker = ({
  selectedRubricId,
  onRubricSelect,
  disabled = false,
}: RubricPickerProps) => {
  const { rubrics, loading } = useRubric();
  const selectedRubric = rubrics.find((r) => r.id === selectedRubricId);

  const handleRubricSelect = (rubric: Rubric) => {
    if (disabled) return;
    onRubricSelect(rubric);
  };

  if (loading) {
    return (
      <div className="w-full">
        <p className="text-uGrayLight text-xl mb-2 font-semibold">Rubric</p>
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
          Loading rubrics...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-uGrayLight text-xl mb-2 font-semibold">Rubric</p>
      <Listbox value={selectedRubric} onChange={handleRubricSelect}>
        <div className="relative">
          <ListboxButton
            disabled={disabled}
            className={clsx(
              "bg-transparent",
              "w-full min-w-44",
              "p-3 px-4 text-base font-semibold rounded-md shadow-base",
              "transition-all transform hover:brightness-110 hover:shadow-uGrayLight",
              "shadow shadow-uGrayLight",
              "hover:border hover:border-primary",
              "text-uGrayLight text-base",
              "flex justify-between items-center",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="text-left">
              {selectedRubric ? selectedRubric.name : "Select a rubric"}
            </span>
            <ChevronDownIcon className="w-5 h-5" />
          </ListboxButton>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <ListboxOptions
              className={cn(
                "max-h-60 absolute z-10 w-full mt-2 bg-panel ",
                "rounded-md  overflow-y-auto",
                "shadow-md shadow-background",
                "flex-col items-start",
                "animate-fadeIn"
              )}
            >
              {rubrics.map((rubric) => (
                <ListboxOption
                  key={rubric.id}
                  value={rubric}
                  className={({ active, selected }) =>
                    clsx(
                      "relative cursor-pointer select-none py-3 px-4",
                      "border-b border-uGrayLightLight last:border-b-0",
                      active ? "bg-secondary" : "",
                      selected ? "bg-primary/10" : ""
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-base font-medium">
                            {rubric.name}
                          </div>
                          <div className="text-sm text-uGrayLightLight">
                            Max Score: {rubric.total_score} | Created by:{" "}
                            {rubric.created_by} | Created:{" "}
                            {new Date(rubric.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {selected && (
                          <CheckIcon className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default RubricPicker;
