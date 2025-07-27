import Button from "@/components/Button";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Plus } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import InputBox from "../InputBox";
import clsx from "clsx";
import Loading from "../Loading";
import * as student from "@/database/student";
import { useDialog } from "@/context/dialog";
import { Tag } from "@/models";
import ParagraphBox from "../ParagraphBox";
import { nanoid } from "nanoid";
import TagPicker from "./TagPicker";
import { useStudent } from "@/context/main/student";

interface IAdd {
  refreshHandler: () => void;
}

const CreateStudent = ({ refreshHandler }: IAdd) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchStudentList } = useStudent();
  const { alert } = useDialog();
  const [form, setForm] = useState({
    id: "",
    fName: "",
    mName: "",
    lName: "",
    remarks: "",
  });
  const [tag, setTag] = useState<Tag | undefined>();
  const [isFormValid, setIsFormValid] = useState(false);

  const handleAdd = async () => {
    setIsLoading(true);
    const { error } = await student.add({
      id: form.id,
      first_name: form.fName,
      middle_name: form.mName,
      last_name: form.lName,
      remarks: form.remarks,
      tag_id: tag?.id,
    });

    if (error) {
      alert({
        title: "Save Failed",
        description: error,
        mode: "ERROR",
      });
    } else {
      refreshHandler();
      setIsModalVisible(false);
    }
    await fetchStudentList();
    setIsLoading(false);
  };

  useEffect(() => {
    setForm({ id: nanoid(12), fName: "", mName: "", lName: "", remarks: "" });
    setTag(undefined);
  }, [isModalVisible]);

  useEffect(() => {
    if (form.id.length && form.fName.length && form.lName.length) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [form]);

  return (
    <>
      <Button title="Add" secondary onClick={() => setIsModalVisible(true)}>
        <Plus className="h-5 w-5" />
      </Button>
      <Transition appear show={isModalVisible} as={Fragment}>
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
                    "w-[44rem] p-6 ",
                    "text-left align-middle shadow-xl",
                    "flex flex-col gap-4"
                  )}
                >
                  <DialogTitle className="text-2xl font-semibold text-primary">
                    New Student
                  </DialogTitle>

                  <p className="text-uGrayLight text-base -mt-2">
                    Fill out the form to insert new student to the table.
                  </p>

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
                      maxLength={21}
                    />

                    <TagPicker tag={tag} setTag={setTag} />

                    <p className="col-span-3 text-uGrayLight mt-4 -mb-1">
                      NAME
                    </p>
                    <InputBox
                      value={form.fName}
                      setValue={(e) =>
                        setForm((prev) => ({ ...prev, fName: e }))
                      }
                      placeholder="First"
                      maxLength={30}
                      inputClassName="px-2 py-1"
                    />
                    <InputBox
                      value={form.mName}
                      setValue={(e) =>
                        setForm((prev) => ({ ...prev, mName: e }))
                      }
                      placeholder="Middle (Optional)"
                      maxLength={30}
                      inputClassName="px-2 py-1"
                    />
                    <InputBox
                      value={form.lName}
                      setValue={(e) =>
                        setForm((prev) => ({ ...prev, lName: e }))
                      }
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
                      title="Save"
                      onClick={handleAdd}
                      className="w-24"
                      disabled={!isFormValid}
                    />

                    <Button
                      title="Cancel"
                      secondary={true}
                      onClick={() => setIsModalVisible(false)}
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
    </>
  );
};

export default CreateStudent;
