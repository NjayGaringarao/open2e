import { useEffect, useState } from "react";
import ParagraphBox from "../../ParagraphBox";
import Loading from "../../Loading";
import ModalResult from "../ModalResult";
import { Save, User } from "lucide-react";
import clsx from "clsx";
import { useSettings } from "@/context/main/settings";
import { useLearner } from "@/context/main/learner/useLearner";
import AIDetection from "../AIDetection";

const AnswerSheet = () => {
  const { userName } = useSettings();

  const {
    question,
    sheet,
    updateSheet,
    evaluateSheet,
    clearSheet,
    saveSheet,
    isLoading,
  } = useLearner();
  const [isAnswerModified, setIsAnswerModified] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [color, setColor] = useState("bg-uGrayLight");

  const handlePress = () => {
    if (sheet.score === null || isAnswerModified) evaluateSheet();
    else setIsResultVisible(true);
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

  useEffect(() => {
    setIsAnswerModified(sheet.committedAnswer !== sheet.trackedAnswer);
  }, [sheet]);

  return (
    <div className="flex flex-col w-full relative">
      <div className="flex flex-row justify-center w-full gap-4 mt-4">
        <ParagraphBox
          value={sheet.trackedAnswer}
          setValue={(e) =>
            updateSheet((prev) => ({ ...prev, trackedAnswer: e }))
          }
          disabled={isLoading}
          placeholder="Type the answer here..."
          containerClassname="flex-1"
          handleClear={clearSheet}
          withVoiceInput
          rows={7}
        />

        <div className="flex flex-col w-40 gap-2">
          {/** Evaluate Button */}
          <button
            className={clsx(
              `flex flex-1 rounded-md hover:brightness-110 items-center justify-center`,
              isLoading || sheet.trackedAnswer === ""
                ? "opacity-50 cursor-not-allowed"
                : "",
              color
            )}
            onClick={handlePress}
            disabled={
              isLoading || sheet.trackedAnswer === "" || question.tracked === ""
            }
          >
            {isLoading ? (
              <Loading size="medium" />
            ) : !isAnswerModified &&
              sheet.score !== null &&
              sheet.trackedAnswer !== "" ? (
              <div className="flex flex-col items-center">
                <p className="text-background text-4xl font-semibold">
                  {sheet.score}/10
                </p>
                <p className="text-background text-base font-semibold">SCORE</p>
              </div>
            ) : (
              <p className="text-background text-lg font-semibold">Evaluate</p>
            )}
          </button>

          {!isSaved &&
            !isAnswerModified &&
            sheet.score !== null &&
            sheet.justification &&
            !isLoading && (
              <button
                onClick={saveSheet}
                className={clsx(
                  "border border-uBlue p-2 rounded-md group",
                  "hover:brightness-110 hover:bg-uBlue",
                  "flex flex-col items-center"
                )}
              >
                <Save className="text-uBlue group-hover:text-background" />
              </button>
            )}
        </div>
      </div>

      <AIDetection
        text={sheet.committedAnswer}
        className={clsx(
          !sheet.committedAnswer.length || isLoading ? "hidden" : "mt-4"
        )}
      />

      {/** Floating UserName */}
      <div
        className={clsx(
          "absolute ml-4 bg-background border border-uGrayLight rounded-md px-4 resize-none",
          "text-base lg:text-lg text-uGrayLight font-mono",
          "hover:border hover:border-primary group",
          "flex flex-row gap-4 items-center"
        )}
      >
        <User className="text-uGrayLight w-4 h-4 group-hover:text-primary -mr-3" />
        {userName.middle.length
          ? `${userName.first} ${userName.middle} ${userName.last}`
          : `${userName.first} ${userName.last}`}
      </div>
      {/* UI Debug */}
      {/* <p className="text-xs text-gray-400 break-all">
        {JSON.stringify(
          {
            isLoading,
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
      <ModalResult
        isVisible={
          isResultVisible && sheet.justification !== "" && sheet.score !== null
        }
        score={sheet.score ?? 0}
        justification={sheet.justification}
        answer={sheet.committedAnswer}
        question={question.committed}
        onClose={(e) => {
          if (e?.re_evaluate) evaluateSheet();
          setIsResultVisible(false);
        }}
      />
    </div>
  );
};

export default AnswerSheet;
