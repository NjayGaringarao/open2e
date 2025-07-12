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
import * as student from "@/utils/student";
import { useDialog } from "@/hooks/useDialog";

interface IAdd {
  refreshHandler: () => void;
}

const Add = ({ refreshHandler }: IAdd) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { alert } = useDialog();
  const [form, setForm] = useState({
    id: "",
    name: "",
    note: "",
  });

  const handleAdd = async () => {
    setIsLoading(true);
    const { error } = await student.add(form.id, form.name, form.note);

    if (error) {
      alert({
        title: "Insert Failed",
        description: error,
        mode: "ERROR",
      });
    } else {
      refreshHandler();
      setIsModalVisible(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setForm({ id: "", name: "", note: "" });
  }, [isModalVisible]);

  return (
    <>
      <Button
        title="Add"
        className="text-background text-lg"
        onClick={() => setIsModalVisible(true)}
      >
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
                    "w-[26rem] p-6 ",
                    "text-left align-middle shadow-xl",
                    "flex flex-col gap-4"
                  )}
                >
                  <DialogTitle className="text-2xl font-semibold text-primary">
                    New Student
                  </DialogTitle>

                  <p className="text-textBody text-base leading-snug">
                    Fill out the form to insert new student to the table.
                  </p>

                  <InputBox
                    title="Identification Number"
                    value={form.id}
                    setValue={(e) => setForm((prev) => ({ ...prev, id: e }))}
                    inputClassName="px-2 py-1"
                  />

                  <InputBox
                    title="Name"
                    value={form.name}
                    setValue={(e) => setForm((prev) => ({ ...prev, name: e }))}
                    inputClassName="px-2 py-1"
                  />

                  <InputBox
                    title="Short Note"
                    value={form.note}
                    setValue={(e) => setForm((prev) => ({ ...prev, note: e }))}
                    inputClassName="px-2 py-1"
                  />
                  <div className="flex flex-row gap-3 justify-end">
                    <Button title="Save" onClick={handleAdd} />

                    <Button
                      title="Cancel"
                      secondary={true}
                      onClick={() => setIsModalVisible(false)}
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

export default Add;
