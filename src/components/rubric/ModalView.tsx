import { Rubric } from "@/database/rubric";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import { useEffect, useState } from "react";
import ParagraphBox from "../ParagraphBox";

interface ModalViewProps {
  onClose: () => void;
  rubric: Rubric | null;
}

const ModalView = ({ onClose, rubric }: ModalViewProps) => {
  const [form, setForm] = useState({
    name: "",
    content: "",
    totalScore: "10",
  });

  useEffect(() => {
    if (rubric) {
      setForm({
        name: rubric.name,
        content: rubric.content,
        totalScore: rubric.total_score.toString(),
      });
    } else {
      setForm({
        name: "",
        content: "",
        totalScore: "10",
      });
    }
  }, [rubric]);

  return (
    <BaseModal
      isOpen={!!rubric}
      onClose={onClose}
      title="View Rubric"
      panelClassName="max-w-4xl"
    >
      <div className="space-y-4 p-6">
        <div className="flex flex-row gap-4 items-center">
          <InputBox
            title="Rubric Name"
            value={form.name}
            setValue={(value) => setForm({ ...form, name: value })}
            disabled={true}
            inputClassName="px-4 py-2 text-base"
            containerClassname="flex-1"
          />
          <InputBox
            title="Total Score"
            value={form.totalScore}
            setValue={(value) => setForm({ ...form, totalScore: value })}
            disabled={true}
            inputClassName="px-4 py-2 text-base"
            containerClassname="w-32"
          />
        </div>
        <ParagraphBox
          value={form.content}
          title="Scoring"
          setValue={(value) => setForm({ ...form, content: value })}
          placeholder="Enter rubric content (supports markdown formatting)"
          disabled={true}
          containerClassname="h-96"
        />
      </div>
    </BaseModal>
  );
};

export default ModalView;
