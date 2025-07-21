import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import InputBox from "../InputBox";
import Button from "../Button";
import * as student from "@/utils/student";
import { Student, Tag } from "@/types/models";
import Loading from "../Loading";
import ParagraphBox from "../ParagraphBox";
import TagPicker from "./TagPicker";
import { useDialog } from "@/context/dialog/useDialog";
import { useStudent } from "@/context/main/student";

interface IEditStudent {
  onEditStudent: Student | null;
  setOnEditStudent: (student: Student | null) => void;
  refreshHandler: () => void;
}

const ModalEditStudent = ({
  onEditStudent,
  setOnEditStudent,
  refreshHandler,
}: IEditStudent) => {
  const [isLoading, setIsLoading] = useState(false);
  const { alert } = useDialog();
  const [tag, setTag] = useState<Tag | undefined>();
  const { fetchStudentList } = useStudent();
  const [form, setForm] = useState({
    id: "",
    fName: "",
    mName: "",
    lName: "",
    remarks: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    const { error } = await student.update({
      id: form.id,
      first_name: form.fName,
      middle_name: form.mName,
      last_name: form.lName,
      remarks: form.remarks,
      tag: tag,
    });

    if (error) {
      alert({
        title: "Update Failed",
        description: error,
        mode: "ERROR",
      });
    } else {
      refreshHandler();
      setOnEditStudent(null);
    }
    await fetchStudentList();
    setIsLoading(false);
  };

  useEffect(() => {
    if (form.id.length && form.fName.length && form.lName.length) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [form]);

  useEffect(() => {
    if (!onEditStudent) {
      setIsModified(false);
      return;
    }

    const s = onEditStudent;
    const f = form;

    if (
      s.id !== f.id ||
      s.first_name !== f.fName ||
      s.middle_name !== f.mName ||
      s.last_name !== f.lName ||
      s.remarks !== f.remarks ||
      s.tag?.id !== tag?.id
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [form, tag]);

  useEffect(() => {
    if (onEditStudent) {
      const s = onEditStudent;
      setForm({
        id: s.id,
        fName: s.first_name,
        mName: s.middle_name ?? "",
        lName: s.last_name,
        remarks: s.remarks ?? "",
      });
      setTag(s.tag);
    } else {
      setForm({ id: "", fName: "", mName: "", lName: "", remarks: "" });
      setTag(undefined);
    }
  }, [onEditStudent]);

  return (
    <Transition appear show={!!onEditStudent} as={Fragment}>
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
          <div
            style={{
              position: "fixed",
              inset: 0,
              opacity: "90%",
              background: "black",
            }}
          ></div>
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
                "rounded-lg bg-background transform transition-all overflow-hidden ",
                "flex flex-col"
              )}
            >
              <div
                className={clsx(
                  "w-[56rem] p-6 ",
                  "text-left align-middle shadow-xl",
                  "flex flex-col gap-4"
                )}
              >
                <DialogTitle className="text-2xl font-semibold text-primary">
                  Modify Student Details
                </DialogTitle>

                <div className="grid grid-cols-3 gap-2 w-full items-center">
                  <p className="col-span-3 text-uGrayLight -mb-1">
                    STUDENT NUMBER
                  </p>
                  <InputBox
                    titleClassName="text-base"
                    value={form.id}
                    setValue={(e) => setForm((prev) => ({ ...prev, id: e }))}
                    inputClassName="px-2 py-1"
                    containerClassname="col-span-2"
                    disabled
                  />

                  <TagPicker tag={tag} setTag={setTag} />

                  <p className="col-span-3 text-uGrayLight mt-4 -mb-1">NAME</p>
                  <InputBox
                    value={form.fName}
                    setValue={(e) => setForm((prev) => ({ ...prev, fName: e }))}
                    placeholder="First"
                    maxLength={30}
                    inputClassName="px-2 py-1"
                  />
                  <InputBox
                    value={form.mName}
                    setValue={(e) => setForm((prev) => ({ ...prev, mName: e }))}
                    placeholder="Middle (Optional)"
                    maxLength={30}
                    inputClassName="px-2 py-1"
                  />
                  <InputBox
                    value={form.lName}
                    setValue={(e) => setForm((prev) => ({ ...prev, lName: e }))}
                    placeholder="Last"
                    maxLength={40}
                    inputClassName="px-2 py-1"
                  />
                  <p className="col-span-3 text-uGrayLight mt-4 -mb-1">
                    REMARKS
                  </p>
                  <ParagraphBox
                    value={form.remarks}
                    setValue={(e) =>
                      setForm((prev) => ({ ...prev, remarks: e }))
                    }
                    containerClassname="col-span-3"
                    rows={2}
                    placeholder="Maximum of 80 characters... (Optional)"
                    maxLength={80}
                  />
                </div>

                <div className="flex flex-row gap-4 justify-end mt-4">
                  <Button
                    title="Update"
                    onClick={handleUpdate}
                    className="w-24"
                    disabled={!isFormValid || !isModified}
                  />

                  <Button
                    title="Cancel"
                    secondary={true}
                    onClick={() => setOnEditStudent(null)}
                    className="w-24"
                  />
                </div>
              </div>

              {isLoading && (
                <div
                  className={clsx(
                    "absolute w-full h-full bg-black bg-opacity-50",
                    "flex flex-col items-center justify-center"
                  )}
                >
                  <Loading />
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalEditStudent;
