import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import Button from "../Button";
import { Tag, Student } from "@/types/models";
import StudentTable from "../table/StudentTable";

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
  selectionMode,
  onSubmit,
  disabledStudentIds,
}: StudentSelectorModalProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectionChange = (selected: Student[]) => {
    if (selectionMode === "single") {
      setSelectedIds(selected.length > 0 ? [selected[0].id] : []);
    } else {
      setSelectedIds(selected.map((s) => s.id));
    }
  };

  const handleSubmit = () => {
    const selected = students.filter((s) => selectedIds.includes(s.id));
    onSubmit(selected);
    setIsVisible(false);
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [isVisible]);

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
                "flex flex-col w-[56rem] max-h-[85vh]"
              )}
            >
              <div className="p-6 flex flex-col gap-4 overflow-hidden">
                <div className="flex flex-col gap-2">
                  <DialogTitle className="text-2xl font-semibold text-primary">
                    Select Students
                  </DialogTitle>
                  <p className="text-textBody text-base">
                    To be able to add an answer sheet, you must first select a
                    student to evaluate.
                  </p>
                </div>

                <StudentTable
                  disabledRowIds={disabledStudentIds}
                  onSelectionChange={handleSelectionChange}
                  height="max-h-[45vh]"
                />

                <div className="flex flex-row justify-end gap-3 pt-2">
                  <Button title="Confirm" onClick={handleSubmit} />
                  <Button
                    title="Cancel"
                    secondary
                    onClick={() => setIsVisible(false)}
                  />
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
