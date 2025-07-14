import { useEffect, useState } from "react";
import ParagraphBox from "../ParagraphBox";
import Loading from "../Loading";
import ModalResult from "./ModalResult";
import { Save, Trash, User } from "lucide-react";
import clsx from "clsx";
import { AnswerSheetProp } from "@/types/types";

export interface IAnswerSheet {
  data: AnswerSheetProp;
  onUpdate: (updated: AnswerSheetProp) => void;
  onDelete?: (id: string) => void;
}

const AnswerSheet = ({ data, onUpdate, onDelete }: IAnswerSheet) => {
  const [form, setForm] = useState({ answer: data.answer ?? "" });
  const [score, setScore] = useState<number | null>(Number(data.score) || null);
  const [justification, setJustification] = useState(data.justification ?? "");
  const [isSaved, setIsSaved] = useState(data.isSaved === "true");
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [color, setColor] = useState("bg-textBody");

  const evaluate = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    const newScore = 5;
    const newJustification = "This is a sample justification...";
    const newAnswer = form.answer;

    setScore(newScore);
    setJustification(newJustification);
    setIsSaved(false);
    setIsModified(false);

    onUpdate({
      ...data,
      answer: newAnswer,
      score: String(newScore),
      justification: newJustification,
      isSaved: "false",
    });

    setIsLoading(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setIsModified(false);

    onUpdate({
      ...data,
      answer: form.answer,
      score: String(score ?? ""),
      justification: justification,
      isSaved: "true",
    });
  };

  const handleClear = () => {
    setForm({ answer: "" });
    setIsSaved(false);
    setIsModified(false);
    setScore(null);
    setJustification("");
    setColor("bg-textBody");

    onUpdate({
      ...data,
      answer: "",
      score: "",
      justification: "",
      isSaved: "false",
    });
  };

  const handlePress = () => {
    if (score === null || isModified) {
      evaluate();
    } else {
      setIsResultVisible(true);
    }
  };

  useEffect(() => {
    setIsModified(form.answer !== data.answer);
  }, [form.answer, data.answer]);

  useEffect(() => {
    if (score !== null && !isModified) {
      setColor(`bg-score-${score}`);
    } else {
      setColor("bg-textBody");
    }
  }, [score, isModified]);

  return (
    <div className="flex flex-col w-full relative">
      <div className="flex flex-row justify-center w-full gap-4 mt-4">
        <ParagraphBox
          value={form.answer}
          setValue={(e) => setForm({ answer: e })}
          disabled={isLoading}
          placeHolder="Type the answer here..."
          containerClassname="flex-1"
          handleClear={handleClear}
          withVoiceInput
          rows={3}
        />

        <div className="flex flex-col w-40 gap-2">
          <button
            className={clsx(
              `flex flex-1 rounded-md hover:brightness-110 items-center justify-center`,
              isLoading || form.answer === ""
                ? "opacity-50 cursor-not-allowed"
                : "",
              color
            )}
            onClick={handlePress}
            disabled={isLoading || form.answer === ""}
          >
            {isLoading ? (
              <Loading size="medium" />
            ) : !isModified && score !== null && form.answer !== "" ? (
              <div className="flex flex-col items-center">
                <p className="text-background text-4xl font-semibold">
                  {score}/10
                </p>
                <p className="text-background text-base font-semibold">SCORE</p>
              </div>
            ) : (
              <p className="text-background text-lg font-semibold">Evaluate</p>
            )}
          </button>

          <div className="flex flex-row gap-2">
            {!isSaved && score !== null && !isModified && (
              <button
                onClick={handleSave}
                className={clsx(
                  "border border-uBlue p-2 rounded-md group",
                  "hover:brightness-110 hover:bg-uBlue",
                  "flex-1 flex flex-col items-center"
                )}
              >
                <Save className="text-uBlue group-hover:text-background" />
              </button>
            )}

            <button
              onClick={() => onDelete?.(data.id)}
              className={clsx(
                "border border-uRed p-2 rounded-md group",
                "hover:brightness-110 hover:bg-uRed",
                "flex-1 flex flex-col items-center"
              )}
            >
              <Trash className="text-uRed group-hover:text-background" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "absolute ml-4 bg-background border border-textBody rounded-md px-4 resize-none",
          "text-base lg:text-lg text-textBody font-mono",
          "hover:border hover:border-primary group",
          "flex flex-row gap-4 items-center"
        )}
      >
        <User className="text-textBody w-4 h-4 group-hover:text-primary -mr-3" />
        {data.student.middle_name
          ? `${data.student.first_name} ${data.student.middle_name} ${data.student.last_name}`
          : `${data.student.first_name} ${data.student.last_name}`}
      </div>
      <ModalResult
        isVisible={isResultVisible && justification !== "" && score !== null}
        score={score ?? 0}
        justification={justification}
        answer={form.answer}
        question={data.question}
        onClose={(e) => {
          if (e?.re_evaluate) evaluate();
          setIsResultVisible(false);
        }}
      />
    </div>
  );
};

export default AnswerSheet;
