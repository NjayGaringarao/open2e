import { Rubric } from "@/database/rubric";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import { useEffect, useState } from "react";
import ParagraphBox from "../ParagraphBox";
import { parseContentToBrackets } from "@/utils/rubricUtils";
import ScoreBracketCard from "./ScoreBracketCard";

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
  const [brackets, setBrackets] = useState<any[]>([]);

  useEffect(() => {
    if (rubric) {
      setForm({
        name: rubric.name,
        content: rubric.content,
        totalScore: rubric.total_score.toString(),
      });

      // Try to parse brackets from content, fallback to showing raw content
      const parsedBrackets = parseContentToBrackets(rubric.content);
      setBrackets(parsedBrackets);
    } else {
      setForm({
        name: "",
        content: "",
        totalScore: "10",
      });
      setBrackets([]);
    }
  }, [rubric]);

  return (
    <BaseModal
      isOpen={!!rubric}
      onClose={onClose}
      title="View Rubric"
      panelClassName="max-w-6xl"
    >
      <div className="space-y-6 p-6">
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

        {brackets.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg text-uGrayLight">Score Brackets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {brackets
                .sort((a, b) => a.minScore - b.minScore)
                .map((bracket) => (
                  <ScoreBracketCard
                    key={bracket.id}
                    bracket={bracket}
                    onEdit={() => {}} // No-op for view mode
                    onDelete={() => {}} // No-op for view mode
                    disabled={true}
                  />
                ))}
            </div>
          </div>
        ) : (
          <ParagraphBox
            value={form.content}
            title="Scoring"
            setValue={(value) => setForm({ ...form, content: value })}
            placeholder="Enter rubric content (supports markdown formatting)"
            disabled={true}
            containerClassname="h-96"
          />
        )}
      </div>
    </BaseModal>
  );
};

export default ModalView;
