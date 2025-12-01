import RubricPicker from "../rubric/RubricPicker";
import QuestionBox from "./QuestionBox";
import AnswerBox from "./AnswerBox";
import { useEvaluation } from "@/context/main/useEvaluation";
import clsx from "clsx";
import { Eye } from "lucide-react";
import Button from "../Button";
import LoadingOverlay from "./LoadingOverlay";

interface InputCardProps {
  onViewResult?: () => void;
  swiperRef?: React.RefObject<any>;
  isEvaluating: boolean;
}

const InputCard = ({
  onViewResult,
  swiperRef,
  isEvaluating,
}: InputCardProps) => {
  const {
    selectedRubric,
    updateSelectedRubric,
    isLoading,
    sheet,
    question,
    evaluateSheet,
  } = useEvaluation();

  const hasResult = sheet.score !== null && sheet.justification !== "";

  // Check if inputs are ready for evaluation
  const isInputReady =
    selectedRubric !== null &&
    question.tracked.trim() !== "" &&
    sheet.trackedAnswer.trim() !== "";

  const handleViewResult = () => {
    if (swiperRef?.current) {
      swiperRef.current.slideTo(1);
    }
    onViewResult?.();
  };

  const handleEvaluate = async () => {
    await evaluateSheet();
  };

  return (
    <div className="flex flex-col border border-primary/80 rounded-lg h-full overflow-hidden">
      <div className="w-full bg-uGray p-4 flex flex-row justify-between items-center">
        <p className="text-background font-semibold text-xl">Input</p>
        <div className="flex flex-row gap-2">
          {!hasResult && isInputReady && (
            <Button
              onClick={handleEvaluate}
              disabled={isLoading}
              className="w-34"
              title="Evaluate"
            ></Button>
          )}
          {hasResult && (
            <Button
              onClick={handleViewResult}
              className="w-34"
              title="View Result"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="relative w-full flex flex-col gap-8 p-4 flex-1 overflow-auto">
        <div
          className={clsx(
            "flex flex-col gap-8 flex-1",
            hasResult && "opacity-90"
          )}
        >
          {!hasResult && (
            <RubricPicker
              selectedRubricId={selectedRubric?.id || null}
              onRubricSelect={updateSelectedRubric}
              disabled={isLoading || hasResult}
            />
          )}

          <QuestionBox />

          <AnswerBox />

          {hasResult && (
            <RubricPicker
              selectedRubricId={selectedRubric?.id || null}
              onRubricSelect={updateSelectedRubric}
              disabled={isLoading || hasResult}
              showScoreBlock={hasResult}
            />
          )}
        </div>

        <LoadingOverlay
          isVisible={isEvaluating}
          prompt={`Evaluating using GPT-4o/Phi4-mini`}
        />
      </div>
    </div>
  );
};

export default InputCard;
