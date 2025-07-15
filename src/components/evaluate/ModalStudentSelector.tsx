import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import InputBox from "../InputBox";
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
  tags,
  selectionMode,
  onSubmit,
  disabledStudentIds,
}: StudentSelectorModalProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredStudents = useMemo(() => {
    if (tagFilter === "All") return students;
    return students.filter((s) => s.tag?.label === tagFilter);
  }, [tagFilter, students]);

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
                <DialogTitle className="text-2xl font-semibold text-primary">
                  Select Student{selectionMode === "multiple" ? "s" : ""}
                </DialogTitle>

                <div className="grid grid-cols-3 justify-between gap-2">
                  <InputBox
                    placeholder="Search by name or tag..."
                    value={globalFilter}
                    setValue={setGlobalFilter}
                    inputClassName="py-1 px-2"
                    containerClassname="col-span-2"
                  />
                  <select
                    className="text-textBody px-3 py-1 border border-textBody rounded-md outline-none focus:border-primary"
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

                <StudentTable
                  data={filteredStudents}
                  selectionMode={selectionMode}
                  disabledRowIds={disabledStudentIds}
                  onSelectionChange={handleSelectionChange}
                  enableGlobalSearch={false}
                  enableTagFilter={false}
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
