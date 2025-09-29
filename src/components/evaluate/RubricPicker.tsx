import { useState, useEffect } from "react";
import { getAllRubrics, Rubric } from "@/database/rubric";
import { useDialog } from "@/context/dialog";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import clsx from "clsx";

interface RubricPickerProps {
  selectedRubricId: number | null;
  onRubricSelect: (rubric: Rubric) => void;
}

const RubricPicker = ({
  selectedRubricId,
  onRubricSelect,
}: RubricPickerProps) => {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);
  const { alert } = useDialog();

  const loadRubrics = async () => {
    setLoading(true);
    const { rubrics, error } = await getAllRubrics();
    if (error) {
      alert({
        title: "Error",
        description: `Failed to load rubrics: ${error}`,
        mode: "ERROR",
      });
    } else {
      setRubrics(rubrics);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRubrics();
  }, []);

  const selectedRubric = rubrics.find((r) => r.id === selectedRubricId);

  const handleRubricSelect = (rubric: Rubric) => {
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
            className={clsx(
              "bg-transparent",
              "w-full min-w-44",
              "p-3 px-4 text-base font-semibold rounded-md shadow-base",
              "transition-all transform hover:brightness-110 hover:shadow-uGrayLight",
              "shadow shadow-uGrayLight",
              "hover:border hover:border-primary",
              "text-uGrayLight text-base",
              "flex justify-between items-center"
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
            <ListboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {rubrics.map((rubric) => (
                <ListboxOption
                  key={rubric.id}
                  value={rubric}
                  className={({ active, selected }) =>
                    clsx(
                      "relative cursor-pointer select-none py-3 px-4",
                      "border-b border-gray-100 last:border-b-0",
                      active ? "bg-gray-100" : "",
                      selected ? "bg-primary/10" : ""
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="font-medium">{rubric.name}</div>
                          <div className="text-sm text-gray-500">
                            Created:{" "}
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
