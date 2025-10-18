import { useState, useEffect } from "react";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import ParagraphBox from "../ParagraphBox";
import Button from "../Button";
import { ScoreBracket } from "@/types/rubric";

interface AddBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bracket: ScoreBracket) => void;
  onEdit: (bracket: ScoreBracket) => void;
  editingBracket: ScoreBracket | null;
  totalScore: number;
  existingBrackets: ScoreBracket[];
}

const AddBracketModal = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  editingBracket,
  totalScore,
  existingBrackets,
}: AddBracketModalProps) => {
  const [form, setForm] = useState({
    minScore: "",
    maxScore: "",
    criteria: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const isEditing = !!editingBracket;

  useEffect(() => {
    if (editingBracket) {
      setForm({
        minScore: editingBracket.minScore.toString(),
        maxScore: editingBracket.maxScore.toString(),
        criteria: editingBracket.criteria,
      });
    } else {
      setForm({
        minScore: "",
        maxScore: "",
        criteria: "",
      });
    }
    setErrors([]);
  }, [editingBracket, isOpen]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    const minScore = parseInt(form.minScore);
    const maxScore = parseInt(form.maxScore);

    // Check if fields are filled
    if (
      !form.minScore.trim() ||
      !form.maxScore.trim() ||
      !form.criteria.trim()
    ) {
      newErrors.push("All fields are required");
      return newErrors;
    }

    // Check if scores are valid numbers
    if (isNaN(minScore) || isNaN(maxScore)) {
      newErrors.push("Scores must be valid numbers");
      return newErrors;
    }

    // Check if scores are within valid range
    if (
      minScore < 0 ||
      maxScore < 0 ||
      minScore > totalScore ||
      maxScore > totalScore
    ) {
      newErrors.push(`Scores must be between 0 and ${totalScore}`);
      return newErrors;
    }

    // Check if minScore <= maxScore
    if (minScore > maxScore) {
      newErrors.push("Minimum score cannot be greater than maximum score");
      return newErrors;
    }

    // Check for overlaps with existing brackets (excluding the one being edited)
    const otherBrackets = existingBrackets.filter(
      (b) => b.id !== editingBracket?.id
    );
    const hasOverlap = otherBrackets.some((bracket) => {
      return !(maxScore < bracket.minScore || minScore > bracket.maxScore);
    });

    if (hasOverlap) {
      newErrors.push("This score range overlaps with an existing bracket");
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const bracket: ScoreBracket = {
      id: editingBracket?.id || `bracket-${Date.now()}`,
      minScore: parseInt(form.minScore),
      maxScore: parseInt(form.maxScore),
      criteria: form.criteria.trim(),
    };

    if (isEditing) {
      onEdit(bracket);
    } else {
      onAdd(bracket);
    }

    onClose();
  };

  const getAvailableRanges = () => {
    const ranges: { min: number; max: number }[] = [];
    const sortedBrackets = [...existingBrackets]
      .filter((b) => b.id !== editingBracket?.id)
      .sort((a, b) => a.minScore - b.minScore);

    let currentMin = 0;
    for (const bracket of sortedBrackets) {
      if (currentMin < bracket.minScore) {
        ranges.push({ min: currentMin, max: bracket.minScore - 1 });
      }
      currentMin = bracket.maxScore + 1;
    }
    if (currentMin <= totalScore) {
      ranges.push({ min: currentMin, max: totalScore });
    }

    return ranges;
  };

  const availableRanges = getAvailableRanges();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Score Bracket" : "Add Score Bracket"}
      panelClassName="max-w-2xl"
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

        <div className="grid grid-cols-2 gap-4">
          <InputBox
            title="Minimum Score"
            value={form.minScore}
            setValue={(value) => setForm({ ...form, minScore: value })}
            inputClassName="px-4 py-2 text-base"
            type="number"
            min="0"
            max={totalScore.toString()}
          />
          <InputBox
            title="Maximum Score"
            value={form.maxScore}
            setValue={(value) => setForm({ ...form, maxScore: value })}
            inputClassName="px-4 py-2 text-base"
            type="number"
            min="0"
            max={totalScore.toString()}
          />
        </div>
        {availableRanges.length > 0 && (
          <div className="flex flex-row gap-2 items-center">
            <h4 className="text-sm italic text-uGrayLight mb-2">
              Tips: These are the available score ranges:
            </h4>
            <div className="flex-1 flex flex-wrap gap-2">
              {availableRanges.map((range, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setForm({
                      ...form,
                      minScore: range.min.toString(),
                      maxScore: range.max.toString(),
                    });
                  }}
                  className="px-3 py-1 bg-secondary text-uGrayLight rounded text-sm hover:brightness-110"
                >
                  {range.min === range.max
                    ? range.min
                    : `${range.min}-${range.max}`}
                </button>
              ))}
            </div>
          </div>
        )}

        <ParagraphBox
          title="Criteria"
          value={form.criteria}
          setValue={(value) => setForm({ ...form, criteria: value })}
          inputClassName="h-48"
          placeholder="Describe the criteria for this score range..."
        />

        <div className="flex justify-end gap-3">
          <Button type="submit" className="w-42">
            {isEditing ? "Update" : "Add"} Bracket
          </Button>
          <Button onClick={onClose} className="w-42" secondary>
            Cancel
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AddBracketModal;
