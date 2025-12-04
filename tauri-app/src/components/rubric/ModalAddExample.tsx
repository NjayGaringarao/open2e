import { useState, useEffect } from "react";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import ParagraphBox from "../ParagraphBox";
import Button from "../Button";
import { RubricExampleForm } from "@/types/rubric";
import { validateExample } from "@/utils/exampleUtils";

interface ModalAddExampleProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (example: RubricExampleForm) => void;
  onEdit: (example: RubricExampleForm) => void;
  editingExample: RubricExampleForm | null;
  totalScore: number;
}

const ModalAddExample = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  editingExample,
  totalScore,
}: ModalAddExampleProps) => {
  const [form, setForm] = useState({
    question: "",
    answer: "",
    score: "",
    justification: "",
    suggested_query: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const isEditing = !!editingExample;

  useEffect(() => {
    if (editingExample) {
      setForm({
        question: editingExample.question || "",
        answer: editingExample.answer || "",
        score: editingExample.score?.toString() || "",
        justification: editingExample.justification || "",
        suggested_query: editingExample.suggested_query || "",
      });
    } else {
      setForm({
        question: "",
        answer: "",
        score: "",
        justification: "",
        suggested_query: "",
      });
    }
    setErrors([]);
  }, [editingExample, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scoreNum = parseInt(form.score);
    if (isNaN(scoreNum)) {
      setErrors(["Score must be a valid number"]);
      return;
    }

    const exampleData: RubricExampleForm = {
      id: editingExample?.id,
      question: form.question.trim(),
      answer: form.answer.trim(),
      score: scoreNum,
      justification: form.justification.trim(),
      suggested_query: form.suggested_query.trim(),
      isNew: !editingExample,
      isModified: !!editingExample,
    };

    const validation = validateExample(exampleData, totalScore);
    if (!validation.isValid) {
      setErrors([validation.error || "Validation failed"]);
      return;
    }

    if (isEditing) {
      onEdit(exampleData);
    } else {
      onAdd(exampleData);
    }

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Example" : "Add Example"}
      panelClassName="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <ul className="text-red-700 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <InputBox
          title="Question"
          value={form.question}
          setValue={(value) => setForm({ ...form, question: value })}
          placeholder="Example: What is the RAM?"
          inputClassName="px-3 py-2"
        />

        <ParagraphBox
          title="Answer"
          value={form.answer}
          setValue={(value) => setForm({ ...form, answer: value })}
          placeholder="Example: A high speed volatile storage that cpu can read and write data quickly for running programs."
          inputClassName="min-h-32"
        />

        <div className="grid grid-cols-2 gap-4">
          <InputBox
            title="Score"
            value={form.score}
            setValue={(value) => setForm({ ...form, score: value })}
            inputClassName="px-4 py-2 text-base"
            type="number"
            min="0"
            max={totalScore.toString()}
            placeholder={`0-${totalScore}`}
          />
          <InputBox
            title="Suggested Query"
            value={form.suggested_query}
            setValue={(value) => setForm({ ...form, suggested_query: value })}
            inputClassName="px-4 py-2 text-base"
            placeholder="e.g., 'What is the RAM?'"
          />
        </div>

        <ParagraphBox
          title="Justification"
          value={form.justification}
          setValue={(value) => setForm({ ...form, justification: value })}
          placeholder={`Example: \n- The answer is correct and the student has a good understanding of the topic.\n- It cannot be lower because it satisfies the criteria for the score.`}
          inputClassName="min-h-32"
        />

        <div className="text-xs text-uGrayLight">
          <p className="mb-1">
            <strong>Tip:</strong> Justification should explain why this score is
            appropriate, why it cannot be higher, and why it cannot be lower.
          </p>
          <p>
            Use bullet points format, e.g., "- Point 1\n- Point 2\n- Point 3"
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" className="w-32">
            {isEditing ? "Update" : "Add"} Example
          </Button>
          <Button onClick={onClose} className="w-32" secondary>
            Cancel
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ModalAddExample;
