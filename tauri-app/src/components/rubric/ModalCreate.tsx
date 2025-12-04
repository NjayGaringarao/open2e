import { useEffect, useState } from "react";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import ParagraphBox from "../ParagraphBox";
import Button from "../Button";
import { useDialog } from "@/context/dialog";
import { useRubric } from "@/context/main/rubric";
import { createRubric } from "@/database/rubric";
import { ScoreBracket, RubricForm, RubricExampleForm } from "@/types/rubric";
import {
  convertBracketsToContent,
  validateCompleteCoverage,
  getCoveragePercentage,
} from "@/utils/rubricUtils";
import ScoreBracketCard from "./ScoreBracketCard";
import ModalAddBracket from "./ModalAddBracket";
import ModalAddExample from "./ModalAddExample";
import RubricExamplesList from "./RubricExamplesList";
import { createRubricExample } from "@/database/rubric_example";
import {
  formatUserContent,
  formatAssistantContent,
} from "@/utils/exampleUtils";
import { Plus, AlertCircle } from "lucide-react";
import { cn } from "@/utils/style";

interface ModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreate = ({ isOpen, onClose }: ModalCreateProps) => {
  const [form, setForm] = useState<RubricForm>({
    name: "",
    totalScore: 10,
    brackets: [],
    note: "",
    examples: [],
  });
  const [loading, setLoading] = useState(false);
  const [showAddBracketModal, setShowAddBracketModal] = useState(false);
  const [showAddExampleModal, setShowAddExampleModal] = useState(false);
  const [editingBracket, setEditingBracket] = useState<ScoreBracket | null>(
    null
  );
  const [editingExample, setEditingExample] =
    useState<RubricExampleForm | null>(null);
  const { alert } = useDialog();
  const { addRubric } = useRubric();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!form.name.trim()) {
      alert({
        title: "Validation Error",
        description: "Please enter a rubric name",
        mode: "ERROR",
      });
      return;
    }

    if (form.totalScore <= 0) {
      alert({
        title: "Validation Error",
        description: "Please enter a valid total score",
        mode: "ERROR",
      });
      return;
    }

    // Validate brackets
    const coverageValidation = validateCompleteCoverage(
      form.brackets,
      form.totalScore
    );
    if (!coverageValidation.isValid) {
      const missingRanges = coverageValidation.missingRanges
        .map((range) =>
          range.min === range.max ? range.min : `${range.min}-${range.max}`
        )
        .join(", ");
      alert({
        title: "Validation Error",
        description: `Please add score brackets to cover all ranges. Missing: ${missingRanges}`,
        mode: "ERROR",
      });
      return;
    }

    setLoading(true);

    // Convert brackets to content string
    const content = convertBracketsToContent(form.brackets, form.note);

    const { rubric: newRubric, error } = await createRubric({
      name: form.name.trim(),
      content,
      total_score: form.totalScore,
    });

    if (error) {
      setLoading(false);
      alert({
        title: "Error",
        description: `Failed to create rubric: ${error}`,
        mode: "ERROR",
      });
      return;
    }

    // Save examples if rubric was created and examples exist
    if (newRubric && form.examples && form.examples.length > 0) {
      let exampleErrors: string[] = [];
      for (let i = 0; i < form.examples.length; i++) {
        const example = form.examples[i];
        const userContent = formatUserContent(example.question, example.answer);
        const assistantContent = formatAssistantContent(
          example.score,
          example.justification,
          example.suggested_query
        );

        const { error: exampleError } = await createRubricExample({
          rubric_id: newRubric.id,
          user_content: userContent,
          assistant_content: assistantContent,
          display_order: i,
        });

        if (exampleError) {
          exampleErrors.push(`Example ${i + 1}: ${exampleError}`);
        }
      }

      if (exampleErrors.length > 0) {
        setLoading(false);
        alert({
          title: "Warning",
          description: `Rubric created but some examples failed to save: ${exampleErrors.join(
            ", "
          )}`,
          mode: "ERROR",
        });
        return;
      }
    }

    setLoading(false);

    if (newRubric) {
      addRubric(newRubric);
    }
    alert({
      title: "Success",
      description: "Rubric created successfully",
      mode: "SUCCESS",
    });
    onClose();
  };

  const handleAddBracket = (bracket: ScoreBracket) => {
    setForm((prev) => ({
      ...prev,
      brackets: [...prev.brackets, bracket],
    }));
  };

  const handleEditBracket = (bracket: ScoreBracket) => {
    setForm((prev) => ({
      ...prev,
      brackets: prev.brackets.map((b) => (b.id === bracket.id ? bracket : b)),
    }));
  };

  const handleDeleteBracket = (bracketId: string) => {
    setForm((prev) => ({
      ...prev,
      brackets: prev.brackets.filter((b) => b.id !== bracketId),
    }));
  };

  const handleEditBracketClick = (bracket: ScoreBracket) => {
    setEditingBracket(bracket);
    setShowAddBracketModal(true);
  };

  const handleAddBracketClick = () => {
    setEditingBracket(null);
    setShowAddBracketModal(true);
  };

  const handleAddExample = (example: RubricExampleForm) => {
    setForm((prev) => ({
      ...prev,
      examples: [...(prev.examples || []), example],
    }));
  };

  const handleEditExample = (example: RubricExampleForm) => {
    setForm((prev) => ({
      ...prev,
      examples: (prev.examples || []).map((e) =>
        e === editingExample ? example : e
      ),
    }));
  };

  const handleDeleteExample = (exampleId: string | number) => {
    setForm((prev) => ({
      ...prev,
      examples: (prev.examples || []).filter(
        (e, index) => e.id !== exampleId && index !== exampleId
      ),
    }));
  };

  const handleAddExampleClick = () => {
    setEditingExample(null);
    setShowAddExampleModal(true);
  };

  const handleEditExampleClick = (example: RubricExampleForm) => {
    setEditingExample(example);
    setShowAddExampleModal(true);
  };

  const coveragePercentage = getCoveragePercentage(
    form.brackets,
    form.totalScore
  );
  const coverageValidation = validateCompleteCoverage(
    form.brackets,
    form.totalScore
  );

  useEffect(() => {
    setForm({
      name: "",
      totalScore: 10,
      brackets: [],
      note: "",
      examples: [],
    });
    setShowAddBracketModal(false);
    setShowAddExampleModal(false);
    setEditingBracket(null);
    setEditingExample(null);
  }, [isOpen]);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Create New Rubric"
        panelClassName="max-w-7xl"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-row gap-6 w-full">
            {/* Left Column - Main Form */}
            <div
              className={cn(
                "space-y-6 flex-1",
                (form.examples || []).length > 0 && "flex-1"
              )}
            >
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
                  value={form.totalScore.toString()}
                  setValue={(value) =>
                    setForm({ ...form, totalScore: parseInt(value) || 0 })
                  }
                  disabled={loading}
                  inputClassName="px-4 py-2 text-base"
                  containerClassname="w-32"
                  type="number"
                  min="1"
                />
              </div>

              {/* Score Brackets Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base text-uGrayLight">Score Brackets</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {form.brackets
                    .sort((a, b) => a.minScore - b.minScore)
                    .map((bracket) => (
                      <ScoreBracketCard
                        key={bracket.id}
                        bracket={bracket}
                        onEdit={handleEditBracketClick}
                        onDelete={handleDeleteBracket}
                        disabled={loading}
                      />
                    ))}
                  {coveragePercentage !== 100 && (
                    <Button
                      onClick={handleAddBracketClick}
                      disabled={loading}
                      className="bg-transparent text-primary h-32"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                      Add Score Bracket
                    </Button>
                  )}
                </div>
              </div>

              {/* Note Section */}
              <div className="space-y-2">
                <h3 className="text-base text-uGrayLight">
                  Additional Notes (Optional)
                </h3>
                <ParagraphBox
                  value={form.note || ""}
                  setValue={(value) => setForm({ ...form, note: value })}
                  placeholder="Enter any additional notes or instructions for this rubric..."
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="flex flex-row gap-4">
                {/* Coverage Status */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-uGrayLight">
                      Score Coverage
                    </h3>
                    <span className="text-sm font-medium text-uGrayLight">
                      {coveragePercentage}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        coveragePercentage === 100 ? "bg-uGreen" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${
                          coveragePercentage <= 100 ? coveragePercentage : 99
                        }%`,
                      }}
                    />
                  </div>
                  {!coverageValidation.isValid && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Missing ranges:{" "}
                        {coverageValidation.missingRanges
                          .map((range) =>
                            range.min === range.max
                              ? range.min
                              : `${range.min}-${range.max}`
                          )
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  disabled={loading || !coverageValidation.isValid}
                  className="w-32"
                  type="submit"
                >
                  {loading ? "Creating..." : "Save Rubric"}
                </Button>
              </div>
            </div>

            {/* Right Column - Examples Section */}
            {(form.examples || []).length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base text-uGrayLight">
                    Examples ({(form.examples || []).length})
                  </h3>
                  <Button
                    onClick={handleAddExampleClick}
                    disabled={loading}
                    className="bg-transparent text-primary"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    Add Example
                  </Button>
                </div>
                <RubricExamplesList
                  examples={form.examples || []}
                  totalScore={form.totalScore}
                  editable={true}
                  onEdit={handleEditExampleClick}
                  onDelete={handleDeleteExample}
                />
              </div>
            )}

            {/* Add Example Button when no examples exist */}
            {(form.examples || []).length === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base text-uGrayLight">
                    Examples (Optional)
                  </h3>
                  <Button
                    onClick={handleAddExampleClick}
                    disabled={loading}
                    className="bg-transparent text-primary"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    Add Example
                  </Button>
                </div>
                <div className="text-center py-8 text-gray-500 min-w-96  flex flex-col justify-center items-center border border-uGrayLightLight rounded-lg p-4">
                  <p className="text-xl text-uGrayLight">
                    No examples added yet.
                  </p>
                  <p className="text-sm text-uGrayLight">
                    Click "Add Example" to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>
      </BaseModal>

      <ModalAddBracket
        isOpen={showAddBracketModal}
        onClose={() => setShowAddBracketModal(false)}
        onAdd={handleAddBracket}
        onEdit={handleEditBracket}
        editingBracket={editingBracket}
        totalScore={form.totalScore}
        existingBrackets={form.brackets}
      />

      <ModalAddExample
        isOpen={showAddExampleModal}
        onClose={() => {
          setShowAddExampleModal(false);
          setEditingExample(null);
        }}
        onAdd={handleAddExample}
        onEdit={handleEditExample}
        editingExample={editingExample}
        totalScore={form.totalScore}
      />
    </>
  );
};

export default ModalCreate;
