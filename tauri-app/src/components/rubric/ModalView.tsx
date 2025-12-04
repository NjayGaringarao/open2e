import { Rubric } from "@/database/rubric";
import BaseModal from "../container/BaseModal";
import InputBox from "../InputBox";
import { useEffect, useState } from "react";
import { parseContentToBrackets } from "@/utils/rubricUtils";
import RubricCriteria from "./RubricCriteria";
import { getRubricExamples } from "@/database/rubric_example";
import { RubricExampleForm } from "@/types/rubric";
import { parseUserContent, parseAssistantContent } from "@/utils/exampleUtils";
import RubricExamplesList from "./RubricExamplesList";
import { cn } from "@/utils/style";

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
  const [note, setNote] = useState<string>("");
  const [examples, setExamples] = useState<RubricExampleForm[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(false);

  useEffect(() => {
    if (rubric) {
      setForm({
        name: rubric.name,
        content: rubric.content,
        totalScore: rubric.total_score.toString(),
      });

      // Try to parse brackets and note from content, fallback to showing raw content
      const parsed = parseContentToBrackets(rubric.content);
      setBrackets(parsed.brackets);
      setNote(parsed.note || "");

      // Fetch examples
      setLoadingExamples(true);
      getRubricExamples(rubric.id)
        .then(({ examples: dbExamples, error }) => {
          if (!error && dbExamples.length > 0) {
            // Convert EvaluationExample[] to RubricExampleForm[]
            const exampleForms: RubricExampleForm[] = [];
            for (let i = 0; i < dbExamples.length; i += 2) {
              const userExample = dbExamples[i];
              const assistantExample = dbExamples[i + 1];
              if (userExample && assistantExample) {
                const userParsed = parseUserContent(userExample.content);
                const assistantParsed = parseAssistantContent(
                  assistantExample.content
                );
                exampleForms.push({
                  question: userParsed.question,
                  answer: userParsed.answer,
                  score: assistantParsed.score,
                  justification: assistantParsed.justification,
                  suggested_query: assistantParsed.suggested_query,
                });
              }
            }
            setExamples(exampleForms);
          } else {
            setExamples([]);
          }
        })
        .catch(() => {
          setExamples([]);
        })
        .finally(() => {
          setLoadingExamples(false);
        });
    } else {
      setForm({
        name: "",
        content: "",
        totalScore: "10",
      });
      setBrackets([]);
      setNote("");
      setExamples([]);
    }
  }, [rubric]);

  return (
    <BaseModal
      isOpen={!!rubric}
      onClose={onClose}
      title="View Rubric"
      panelClassName={cn(examples.length > 0 ? "max-w-8xl" : "max-w-6xl")}
    >
      <div
        className={cn(
          examples.length > 0 ? "grid grid-cols-2" : "flex flex-col",
          "p-6 gap-6"
        )}
      >
        <div className={cn("space-y-4", examples.length == 0 && "flex-1")}>
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

          <RubricCriteria brackets={brackets} note={note} />
        </div>

        {/* Examples Section */}
        {examples.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base text-uGrayLight">
                Examples ({examples.length})
              </h3>
            </div>
            {loadingExamples ? (
              <div className="text-center py-4 text-uGrayLight">
                Loading examples...
              </div>
            ) : (
              <RubricExamplesList
                examples={examples}
                totalScore={parseInt(form.totalScore) || 10}
                editable={false}
              />
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ModalView;
