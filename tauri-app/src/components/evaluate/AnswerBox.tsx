import ParagraphBox from "../ParagraphBox";
import { useEvaluation } from "@/context/main/useEvaluation";

const AnswerBox = () => {
  const { sheet, updateSheet, isLoading } = useEvaluation();

  const handleClear = () => {
    // Only clear the text, not the entire sheet
    updateSheet((prev) => ({ ...prev, trackedAnswer: "" }));
  };

  return (
    <div className="w-full">
      <p className="text-uGrayLight/80 text-base mb-2">Answer</p>
      <ParagraphBox
        value={sheet.trackedAnswer}
        setValue={(e) => updateSheet((prev) => ({ ...prev, trackedAnswer: e }))}
        disabled={
          isLoading || (sheet.score !== null && sheet.justification !== "")
        }
        placeholder="Type the answer here..."
        containerClassname="w-full"
        inputClassName="h-64 py-4 text-base whitespace-pre-line"
        handleClear={handleClear}
        withVoiceInput
        withClearButton
        rows={7}
      />
    </div>
  );
};

export default AnswerBox;
