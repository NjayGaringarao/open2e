import { Tag } from "@/types/models";
import { remove } from "@/utils/tag";
import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "../Button";
import ModalCreateTag from "./ModalCreateTag";
import { useDialog } from "@/context/dialog/useDialog";
import { useTag } from "@/context/tag";
import { useStudent } from "@/context/student";

interface ITagPicker {
  tag?: Tag;
  setTag: (tag: Tag | undefined) => void;
  className?: string;
}

const TagPicker = ({ tag, setTag, className }: ITagPicker) => {
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

  const handleSelect = (_tag?: Tag) => {
    setTag(_tag);
    setIsModalVisible(false);
  };

  return (
    <>
      <button
        className={clsx(
          "h-full bg-panel px-4 py-2 rounded-md",
          "text-textBody text-base font-semibold",
          "flex flex-row justify-between items-center",
          "hover:brightness-110 focus:border-2 focus:border-primary focus:outline-none",
          className
        )}
        onClick={() => setIsModalVisible(true)}
      >
        {tag ? tag.label : "Select Tag"} <ChevronDown />
      </button>
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
                      Select Tag
                    </DialogTitle>
                    <button
                      onClick={() => setIsModalVisible(false)}
                      className="text-textBody hover:text-primary"
                    >
                      <X />
                    </button>
                  </div>

                  <p className="text-textBody text-base -mt-2">
                    Tagging helps you group your students.
                  </p>

                  {tagList.length ? (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                        <button
                          id="no tag"
                          onClick={() => handleSelect(undefined)}
                          className={clsx(
                            "w-full flex flex-col py-1 px-4 text-lg items-center rounded-md mb-4",
                            "border focus:border-2 focus:border-primary focus:outline-none",
                            !tag ? "border-primary" : "border-textBody"
                          )}
                        >
                          No Tag (Default)
                        </button>

                        {tagList.map((_tag) => (
                          <div
                            className={clsx("w-full flex flex-row gap-2 pr-2")}
                          >
                            <button
                              id={_tag.id.toString()}
                              onClick={() => handleSelect(_tag)}
                              className={clsx(
                                "py-1 px-4 text-lg flex-1 bg-panel rounded-md",
                                "focus:border-2 focus:border-primary focus:outline-none",
                                tag?.id === _tag.id && "border border-primary",
                                "flex flex-row justify-between"
                              )}
                            >
                              <p>{_tag.label}</p>
                            </button>
                            <button
                              className="text-textBody hover:text-uRed"
                              onClick={() => deleteTag(_tag.id)}
                            >
                              <X />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-row justify-between items-center">
                        <p className="text-textBody">{`${tagList.length} Tag(s) Available`}</p>
                        <Button
                          title="Add New"
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

export default TagPicker;
