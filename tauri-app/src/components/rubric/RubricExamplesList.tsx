import { RubricExampleForm } from "@/types/rubric";
import { Edit, Trash2 } from "lucide-react";

interface RubricExamplesListProps {
  examples: RubricExampleForm[];
  totalScore: number;
  editable?: boolean;
  onEdit?: (example: RubricExampleForm) => void;
  onDelete?: (exampleId: string | number) => void;
}

const RubricExamplesList = ({
  examples,
  totalScore,
  editable = false,
  onEdit,
  onDelete,
}: RubricExamplesListProps) => {
  if (examples.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No examples available for this rubric.
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      <div className="space-y-3 overflow-y-auto">
        {examples.map((example, index) => {
          const question = example.question || "";
          const answer = example.answer || "";
          const score = example.score ?? 0;
          const justification = example.justification || "";
          const suggestedQuery = example.suggested_query || "";

          return (
            <div
              key={example.id || `example-${index}`}
              className="border border-uGrayLightLight rounded-lg p-4 bg-panel"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Question */}
                  <div>
                    <div className="text-xs font-semibold text-uGrayLight mb-1">
                      Question
                    </div>
                    <div className="text-sm text-primary">{question}</div>
                  </div>

                  {/* Answer */}
                  <div>
                    <div className="text-xs font-semibold text-uGrayLight mb-1">
                      Answer
                    </div>
                    <div className="text-sm text-uGrayLight">{answer}</div>
                  </div>

                  {/* Score and Evaluation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-uGrayLight mb-1">
                        Score
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {score} / {totalScore}
                      </div>
                    </div>
                    {suggestedQuery && (
                      <div>
                        <div className="text-xs font-semibold text-uGrayLight mb-1">
                          Suggested Query
                        </div>
                        <div className="text-sm text-uGrayLight truncate">
                          {suggestedQuery}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Justification */}
                  {justification && (
                    <div>
                      <div className="text-xs font-semibold text-uGrayLight mb-1">
                        Justification
                      </div>
                      <div className="text-sm text-uGrayLight line-clamp-3">
                        {justification}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {editable && (onEdit || onDelete) && (
                  <div className="flex flex-col gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(example)}
                        className="p-2 text-uGrayLight hover:text-primary transition-colors"
                        title="Edit example"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(example.id || `example-${index}`)
                        }
                        className="p-2 text-uGrayLight hover:text-uRed transition-colors"
                        title="Delete example"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RubricExamplesList;
