import { useEffect, useState } from "react";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import ParagraphBox from "../ParagraphBox";
import Button from "../Button";
import { useDialog } from "@/context/dialog";
import { useRubric } from "@/context/main/rubric";
import { createRubric } from "@/database/rubric";

interface ModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreate = ({ isOpen, onClose }: ModalCreateProps) => {
  const [form, setForm] = useState({
    name: "",
    content: "",
    totalScore: "10",
  });
  const [loading, setLoading] = useState(false);
  const { alert } = useDialog();
  const { addRubric } = useRubric();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.content.trim() ||
      parseInt(form.totalScore) <= 0
    ) {
      alert({
        title: "Validation Error",
        description: "Please fill in all fields and enter a valid total score",
        mode: "ERROR",
      });
      return;
    }

    setLoading(true);
    const { rubric: newRubric, error } = await createRubric({
      name: form.name.trim(),
      content: form.content.trim(),
      total_score: parseInt(form.totalScore),
    });
    setLoading(false);

    if (error) {
      alert({
        title: "Error",
        description: `Failed to create rubric: ${error}`,
        mode: "ERROR",
      });
    } else {
      if (newRubric) {
        addRubric(newRubric);
      }
      alert({
        title: "Success",
        description: "Rubric created successfully",
        mode: "SUCCESS",
      });
      onClose();
    }
  };

  useEffect(() => {
    setForm({
      name: "",
      content: "",
      totalScore: "10",
    });
  }, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Rubric"
      panelClassName="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div className="flex flex-row gap-4 items-center">
          <InputBox
            title="Rubric Name"
            value={form.name}
            setValue={(value) => setForm({ ...form, name: value })}
            disabled={loading}
            inputClassName="px-4 py-2 text-base"
            containerClassname="flex-1"
          />
          <InputBox
            title="Total Score"
            value={form.totalScore}
            setValue={(value) => setForm({ ...form, totalScore: value })}
            disabled={loading}
            inputClassName="px-4 py-2 text-base"
            containerClassname="w-32"
          />
        </div>
        <ParagraphBox
          value={form.content}
          setValue={(value) => setForm({ ...form, content: value })}
          rows={12}
          placeholder="Enter rubric content (supports markdown formatting)"
          disabled={loading}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={loading} className="w-32">
            {loading ? "Creating..." : "Save"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ModalCreate;
