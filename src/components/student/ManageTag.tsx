import { remove } from "@/utils/tag";
import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import { Tag, Trash, X } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "../Button";
import ModalCreateTag from "./ModalCreateTag";
import { useDialog } from "@/context/dialog/useDialog";
import { useTag } from "@/context/main/tag";
import { useStudent } from "@/context/main/student";

const ManageTag = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const { tagList, fetchTagList } = useTag();
  const { fetchStudentList } = useStudent();
  const { alert, confirm } = useDialog();

  const deleteTag = async (tag_id: number) => {
    const confirmation = await confirm({
      title: "Confirm Delete",
      description:
        "This tag will be removed from the student(s) who uses this.",
      mode: "CRITICAL",
    });

    if (!confirmation) return;

    const { error } = await remove(tag_id);

    if (error) {
      alert({
        title: "Failed to Delete",
        description: error,
        mode: "ERROR",
      });
    }
    await fetchTagList();
    await fetchStudentList();
  };

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)} secondary>
        <Tag /> Tags
      </Button>
      <Transition appear show={isModalVisible} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalVisible(false)}
        >
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

          <div className="fixed inset-0 flex items-center justify-center p-6">
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
                    "w-[26rem] p-6",
                    "text-left align-middle shadow-xl",
                    "flex flex-col gap-6"
                  )}
                >
                  <div className="flex flex-row justify-between items-center">
                    <DialogTitle className="text-2xl font-semibold text-primary">
                      Manage Tag
                    </DialogTitle>
                    <button
                      onClick={() => setIsModalVisible(false)}
                      className="text-uGrayLight hover:text-primary"
                    >
                      <X />
                    </button>
                  </div>

                  <p className="text-uGrayLight text-base -mt-2">
                    Tagging helps you group your students.
                  </p>

                  {tagList.length ? (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                        {tagList.map((_tag) => (
                          <div
                            className={clsx("w-full flex flex-row gap-2 pr-2")}
                          >
                            <div
                              id={_tag.id.toString()}
                              className={clsx(
                                "py-1 px-4 text-lg flex-1 bg-panel rounded-md",
                                "focus:border-2 focus:border-primary focus:outline-none",

                                "flex flex-row justify-between"
                              )}
                            >
                              <p>{_tag.label}</p>
                            </div>
                            <button
                              className="text-uGrayLight hover:text-uRed"
                              onClick={() => deleteTag(_tag.id)}
                            >
                              <Trash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-row justify-between items-center">
                        <p className="text-uGrayLight">{`${tagList.length} Tag(s) Available`}</p>
                        <Button
                          title="Add"
                          className="self-end w-32"
                          secondary
                          onClick={() => setIsCreateVisible(true)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-center bg-panel rounded-md p-4">
                      <p className="text-lg text-textHeader">
                        No Tag Available,
                      </p>
                      <Button
                        title="Create One!"
                        className="border-none text-lg px-1"
                        secondary
                        onClick={() => setIsCreateVisible(true)}
                      />
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
      <ModalCreateTag
        isVisible={isCreateVisible}
        setIsVisible={setIsCreateVisible}
        refreshHandle={fetchTagList}
      />
    </>
  );
};

export default ManageTag;
