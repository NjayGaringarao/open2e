import { useDialog } from "@/hooks/useDialog";
import { Tag } from "@/types/models";
import { getAll } from "@/utils/tag";
import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import Button from "../Button";
import ModalCreateTag from "./ModalCreateTag";

interface ITagPicker {
  tag?: Tag;
  setTag: (tag: Tag | undefined) => void;
  className?: string;
}

const TagPicker = ({ tag, setTag, className }: ITagPicker) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const { alert } = useDialog();

  const loadTagList = async () => {
    const { error, tags } = await getAll();

    if (error) {
      alert({
        title: "Failed to Initialize",
        description: error,
        mode: "ERROR",
      });
    }

    setTagList(tags ?? []);
  };

  const handleSelect = (_tag?: Tag) => {
    setTag(_tag);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (isModalVisible) loadTagList();
  }, [isModalVisible]);
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
                            "w-full flex flex-col p-2 text-lg items-center rounded-md mb-4",
                            "border focus:border-2 focus:border-primary focus:outline-none",
                            !tag ? "border-primary" : "border-textBody"
                          )}
                        >
                          No Tag (Default)
                        </button>

                        {tagList.map((_tag) => (
                          <button
                            id={_tag.id.toString()}
                            onClick={() => handleSelect(_tag)}
                            className={clsx(
                              "w-full flex flex-col p-2 text-lg items-center bg-panel rounded-md",
                              "focus:border-2 focus:border-primary focus:outline-none",
                              tag?.id === _tag.id && "border border-primary"
                            )}
                          >
                            {_tag.label}
                          </button>
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
        refreshHandle={loadTagList}
      />
    </>
  );
};

export default TagPicker;
