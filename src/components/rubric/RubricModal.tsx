import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { createRubric, Rubric } from "@/database/rubric";
import { useDialog } from "@/context/dialog";
import Button from "@/components/Button";

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubric?: Rubric | null;
}

const RubricModal = ({ isOpen, onClose, rubric }: RubricModalProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { alert } = useDialog();

  useEffect(() => {
    if (rubric) {
      setName(rubric.name);
      setContent(rubric.content);
    } else {
      setName("");
      setContent("");
    }
  }, [rubric, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      alert({
        title: "Validation Error",
        description: "Please fill in all fields",
        mode: "ERROR",
      });
      return;
    }

    setLoading(true);
    const { error } = await createRubric({
      name: name.trim(),
      content: content.trim(),
    });
    setLoading(false);

    if (error) {
      alert({
        title: "Error",
        description: `Failed to create rubric: ${error}`,
        mode: "ERROR",
      });
    } else {
      alert({
        title: "Success",
        description: "Rubric created successfully",
        mode: "SUCCESS",
      });
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {rubric ? "View Rubric" : "Create New Rubric"}
                </DialogTitle>

                {rubric ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {rubric.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <div
                        className="p-3 bg-gray-50 rounded-md max-h-96 overflow-y-auto"
                        dangerouslySetInnerHTML={{
                          __html: rubric.content.replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rubric Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter rubric name"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rubric Content
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter rubric content (supports markdown formatting)"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Rubric"}
                      </Button>
                      <Button
                        type="button"
                        onClick={onClose}
                        secondary
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RubricModal;
