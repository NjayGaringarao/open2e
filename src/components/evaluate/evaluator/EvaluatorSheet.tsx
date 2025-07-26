import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import clsx from "clsx";
import { EvaluatorSheet as SheetType } from "@/types/evaluation/evaluator";
import ParagraphBox from "@/components/ParagraphBox";
import ModalResult from "@/components/evaluate/ModalResult";
import Loading from "@/components/Loading";
import { useEvaluator } from "@/context/main/evaluator";

type Props = {
  sheet: SheetType;
};

export default function EvaluatorSheet({ sheet }: Props) {
  const { state, updateSheet, evaluateSheet, saveSheet, removeSheet } =
    useEvaluator();

  // UI states
  const [color, setColor] = useState("bg-uGrayLight");
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswerModified, setIsAnswerModified] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fullName = sheet.student.middle_name?.length
    ? `${sheet.student.first_name} ${sheet.student.middle_name} ${sheet.student.last_name}`
    : `${sheet.student.first_name} ${sheet.student.last_name}`;

  // Evaluate the current answer
  const handleEvaluate = async () => {
    // update global with current draftAnswer
    updateSheet(sheet.id, {
      committedAnswer: sheet.trackedAnswer,
      isEvaluationSaved: false,
      status: "EVALUATING",
    });
    await evaluateSheet(sheet.id);
  };

  // Trigger evaluation or open modal
  const handlePress = async () => {
    if (isAnswerModified) {
      await handleEvaluate();
    } else {
      setIsResultVisible(true);
    }
  };

  const handleSave = () => {
    saveSheet(sheet.id);
  };

  const handleClear = () => {
    updateSheet(sheet.id, {
      ...sheet,
      trackedAnswer: "",
      committedAnswer: "",
      score: undefined,
      justification: undefined,
      isEvaluationSaved: false,
      status: "NOT_EVALUATED",
    });
  };

  useEffect(() => {
    // Set color based on evaluation state
    setColor(
      sheet.score !== null && !isAnswerModified && sheet.committedAnswer !== ""
        ? `bg-score-${sheet.score}`
        : "bg-uGrayLight"
    );

    // Set saved state based on global and answer modified state
    setIsSaved(sheet.isEvaluationSaved && !isAnswerModified);
  }, [sheet, isAnswerModified]);

  // Sync loading state
  useEffect(() => {
    setIsLoading(sheet.status === "EVALUATING");
    setIsAnswerModified(sheet.committedAnswer !== sheet.trackedAnswer);
  }, [sheet]);

  return (
    <div className="flex flex-col w-full relative">
      {/* Input and Button Row */}
      <div className="flex flex-row justify-center w-full gap-4 mt-4">
        <ParagraphBox
          value={sheet.trackedAnswer}
          setValue={(val) => updateSheet(sheet.id, { trackedAnswer: val })}
          disabled={isLoading || state.isLocked}
          placeholder="Type the answer here..."
          containerClassname="flex-1"
          handleClear={handleClear}
          withVoiceInput
          rows={3}
        />

        <div className="flex flex-col w-40 gap-2">
          {/* Evaluate Button */}
          <button
            className={clsx(
              "flex flex-1 rounded-md hover:brightness-110 items-center justify-center",
              isLoading || sheet.trackedAnswer === ""
                ? "opacity-50 cursor-not-allowed"
                : "",
              color
            )}
            onClick={handlePress}
            disabled={isLoading || sheet.trackedAnswer === ""}
          >
            {isLoading ? (
              <Loading size="medium" />
            ) : !isAnswerModified && sheet.score !== undefined ? (
              <>
                {/* Score Box */}
                <div className="flex flex-col items-center">
                  <p className="text-background text-3xl font-semibold">
                    {sheet.score}/10
                  </p>
                  <p className="text-background text-sm font-semibold">SCORE</p>
                </div>
              </>
            ) : (
              <>
                {/* Evaluate Sign */}
                <p className="text-background text-lg font-semibold">
                  Evaluate
                </p>
              </>
            )}
          </button>

          {/* SAVE BUTTON: only shows when answer is evaluated + unmodified */}
          {!isSaved &&
            !isAnswerModified &&
            sheet.score !== null &&
            sheet.justification &&
            sheet.status !== "EVALUATING" && (
              <button
                onClick={handleSave}
                className={clsx(
                  "border border-uBlue p-2 rounded-md group",
                  "hover:brightness-110 hover:bg-uBlue",
                  "flex flex-row items-center justify-center gap-2",
                  "text-uGrayLight font-semibold"
                )}
              >
                <Save className="text-uBlue group-hover:text-background h-5 w-5" />
                Save
              </button>
            )}
        </div>
      </div>

      {/* Floating Controller */}
      <div
        className={clsx(
          "absolute ml-4 bg-background border border-uGrayLight rounded-md px-4",
          "hover:border hover:border-primary group",
          "flex flex-row gap-4 items-center",
          "select-none"
        )}
      >
        {/* UserName */}
        <p className={clsx("text-base lg:text-lg text-uGrayLight font-mono")}>
          {fullName}
        </p>

        {/** Remove */}
        <button onClick={() => removeSheet(sheet.id)}>
          <X className="text-uGrayLight w-4 h-4 lg:w-5 lg:h-5 hover:text-uRed" />
        </button>
      </div>

      {/* Result Modal */}
      <ModalResult
        isVisible={
          isResultVisible && !!sheet.justification && sheet.score !== undefined
        }
        score={sheet.score ?? 0}
        justification={sheet.justification ?? ""}
        answer={sheet.committedAnswer}
        question={state.question}
        onClose={async (e) => {
          if (e?.re_evaluate) {
            await handleEvaluate();
          }
          setIsResultVisible(false);
        }}
      />

      {/* UI Debug */}
      {/* <p className="text-xs text-gray-400 break-all">
        {JSON.stringify(
          {
            local: {
              modified: isAnswerModified,
              saved: isSaved,
            },
            global: sheet,
          },
          null,
          2
        )}
      </p> */}
    </div>
  );
}
