import { useEffect, useState } from "react";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import ParagraphBox from "../ParagraphBox";
import Button from "../Button";
import { useDialog } from "@/context/dialog";
import { useRubric } from "@/context/main/rubric";
import { updateRubric, Rubric } from "@/database/rubric";
import { ScoreBracket, RubricForm, RubricExampleForm } from "@/types/rubric";
import {
  convertBracketsToContent,
  validateCompleteCoverage,
  getCoveragePercentage,
  parseContentToBrackets,
} from "@/utils/rubricUtils";
import ScoreBracketCard from "./ScoreBracketCard";
import ModalAddBracket from "./ModalAddBracket";
import ModalAddExample from "./ModalAddExample";
import RubricExamplesList from "./RubricExamplesList";
import {
  getRubricExamplesWithIds,
  createRubricExample,
  deleteRubricExample,
} from "@/database/rubric_example";
import {
  parseUserContent,
  parseAssistantContent,
  formatUserContent,
  formatAssistantContent,
} from "@/utils/exampleUtils";
import { Plus, AlertCircle } from "lucide-react";
import { cn } from "@/utils/style";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  rubric: Rubric | null;
}

const ModalEdit = ({ isOpen, onClose, rubric }: ModalEditProps) => {
  const [form, setForm] = useState<RubricForm>({
    name: "",
    totalScore: 10,
    brackets: [],
    note: "",
    examples: [],
  });
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [showAddBracketModal, setShowAddBracketModal] = useState(false);
  const [showAddExampleModal, setShowAddExampleModal] = useState(false);
  const [editingBracket, setEditingBracket] = useState<ScoreBracket | null>(
    null
  );
  const [editingExample, setEditingExample] =
    useState<RubricExampleForm | null>(null);
  const { alert, confirm } = useDialog();
  const { addRubric, removeRubric } = useRubric();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = await confirm({
      title: "Confirm Changes",
      description:
        "You have made changes to the rubric. Do you want to save these changes?",
      confirmText: "Save",
      cancelText: "Cancel",
      mode: "DEFAULT",
    });

    if (!confirmed) {
      return;
    }

    if (!rubric) {
      alert({
        title: "Error",
        description: "No rubric selected for editing",
        mode: "ERROR",
      });
      return;
    }

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

    const { rubric: newRubric, error } = await updateRubric({
      oldRubricId: rubric.id,
      name: form.name.trim(),
      content,
      total_score: form.totalScore,
    });

    if (error) {
      setLoading(false);
      alert({
        title: "Error",
        description: `Failed to update rubric: ${error}`,
        mode: "ERROR",
      });
      return;
    }

    // Update examples if rubric was updated
    if (newRubric && form.examples) {
      // Since updateRubric creates a NEW rubric (old one is archived),
      // we need to recreate ALL examples for the new rubric
      // The old examples will remain with the archived rubric
      const currentExamples = form.examples || [];

      let exampleErrors: string[] = [];

      // Recreate all examples for the new rubric
      for (let i = 0; i < currentExamples.length; i++) {
        const example = currentExamples[i];
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

      // Delete old examples from the archived rubric (optional cleanup)
      // Note: We could also leave them since the rubric is archived
      const { examples: oldExamples } = await getRubricExamplesWithIds(
        rubric.id
      );
      for (const oldExample of oldExamples) {
        await deleteRubricExample(oldExample.id);
      }

      if (exampleErrors.length > 0) {
        setLoading(false);
        alert({
          title: "Warning",
          description: `Rubric updated but some examples had errors: ${exampleErrors.join(
            ", "
          )}`,
          mode: "ERROR",
        });
        return;
      }
    }

    setLoading(false);

    if (newRubric) {
      removeRubric(rubric.id);
      addRubric(newRubric);
    }
    alert({
      title: "Success",
      description: "Rubric updated successfully",
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
      examples: [...(prev.examples || []), { ...example, isNew: true }],
    }));
  };

  const handleEditExample = (example: RubricExampleForm) => {
    setForm((prev) => ({
      ...prev,
      examples: (prev.examples || []).map((e) =>
        e === editingExample ? { ...example, isModified: true } : e
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

  // Track original form data to detect modifications
  const [originalForm, setOriginalForm] = useState<RubricForm>({
    name: "",
    totalScore: 10,
    brackets: [],
    note: "",
    examples: [],
  });

  useEffect(() => {
    if (rubric && isOpen) {
      // Parse existing rubric content to populate form
      const parsed = parseContentToBrackets(rubric.content);
      const initialForm = {
        name: rubric.name,
        totalScore: rubric.total_score,
        brackets: parsed.brackets,
        note: parsed.note || "",
        examples: [] as RubricExampleForm[],
      };

      // Set form first with empty examples
      setForm(initialForm);
      setOriginalForm(initialForm);
      setIsModified(false);

      // Load examples with IDs separately
      getRubricExamplesWithIds(rubric.id)
        .then(({ examples: dbExamples, error }) => {
          if (!error && dbExamples.length > 0) {
            const exampleForms: RubricExampleForm[] = [];
            for (const dbExample of dbExamples) {
              const userParsed = parseUserContent(dbExample.user_content);
              const assistantParsed = parseAssistantContent(
                dbExample.assistant_content
              );
              exampleForms.push({
                id: dbExample.id,
                question: userParsed.question,
                answer: userParsed.answer,
                score: assistantParsed.score,
                justification: assistantParsed.justification,
                suggested_query: assistantParsed.suggested_query,
              });
            }

            // Update form with examples
            setForm((prev) => ({
              ...prev,
              examples: exampleForms,
            }));
            setOriginalForm((prev) => ({
              ...prev,
              examples: exampleForms,
            }));
          }
        })
        .catch((err) => {
          console.error("Error loading examples:", err);
        });
    } else {
      const emptyForm = {
        name: "",
        totalScore: 10,
        brackets: [],
        note: "",
        examples: [],
      };
      setForm(emptyForm);
      setOriginalForm(emptyForm);
      setIsModified(false);
    }
    setShowAddBracketModal(false);
    setShowAddExampleModal(false);
    setEditingBracket(null);
    setEditingExample(null);
  }, [rubric, isOpen]);

  // Check for modifications whenever form changes
  useEffect(() => {
    if (originalForm.name || originalForm.brackets.length > 0) {
      const hasChanges =
        form.name !== originalForm.name ||
        form.totalScore !== originalForm.totalScore ||
        form.note !== originalForm.note ||
        JSON.stringify(
          form.brackets.sort((a, b) => a.minScore - b.minScore)
        ) !==
          JSON.stringify(
            originalForm.brackets.sort((a, b) => a.minScore - b.minScore)
          ) ||
        JSON.stringify(form.examples || []) !==
          JSON.stringify(originalForm.examples || []);

      setIsModified(hasChanges);
    }
  }, [form, originalForm]);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Rubric"
        panelClassName={cn(
          (form.examples || []).length > 0 ? "max-w-8xl" : "max-w-6xl"
        )}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div
            className={cn(
              (form.examples || []).length > 0
                ? "grid grid-cols-2"
                : "flex flex-col",
              "gap-6"
            )}
          >
            {/* Left Column - Main Form */}
            <div className={cn("space-y-6")}>
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

                <div className="flex flex-col gap-4">
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
                  disabled={
                    loading || !coverageValidation.isValid || !isModified
                  }
                  className="w-40"
                  type="submit"
                >
                  {loading ? "Updating..." : "Save Changes"}
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
                <div className="text-center py-8 text-gray-500">
                  No examples added yet. Click "Add Example" to get started.
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

export default ModalEdit;
