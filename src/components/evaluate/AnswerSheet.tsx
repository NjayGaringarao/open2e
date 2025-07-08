import { useEffect, useState } from "react";
import ParagraphBox from "../ParagraphBox";
import Loading from "../Loading";
import ModalResult from "./ModalResult";
import { Save, Trash } from "lucide-react";
import clsx from "clsx";
import RespondentPicker from "./RespondentPicker";
import { Respondent } from "@/types/models";

interface IAnswerSheet {
  question?: string;
}

const AnswerSheet = ({ question }: IAnswerSheet) => {
  const [answer, setAnswer] = useState("");
  const [form, setForm] = useState({
    answer: "",
  });
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [justification, setJustification] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [color, setColor] = useState("bg-textBody");
  const [respondent, setRespondent] = useState<Respondent>();

  const evaluate = async () => {
    // Simulate an API call or evaluation process
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setScore(5); // Example score
    setJustification(
      "This is a sample justification for the score given based on the answer provided. It explains how the score was derived and what aspects were considered."
    );
    setAnswer(form.answer);
    setIsLoading(false);
  };

  const handlePress = () => {
    if (score === null || isModified) {
      evaluate();
    } else {
      setIsResultVisible(true);
    }
  };

  const handleDeleteMe = () => {};

  const handleClear = () => {
    setForm({ answer: "" });
    setIsModified(false);
    setIsSaved(false);
    setScore(null);
    setJustification(null);
    setAnswer("");
    setColor("bg-textBody");
  };
  const handleSave = () => {
    // Logic to save the answer
    setIsSaved(true);
    setIsModified(false);
    // You can also reset the form or perform other actions after saving
  };

  useEffect(() => {
    if (form.answer !== answer) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [form, answer]);

  useEffect(() => {
    if (score !== null && answer !== "" && form.answer !== "" && !isModified) {
      setColor(`bg-score-${score}`);
    } else {
      setColor("bg-textBody");
    }
  }, [score]);
  return (
    <div className=" flex flex-row justify-center w-full gap-4">
      <div className="relative flex-1 flex flex-col">
        <ParagraphBox
          value={form.answer}
          setValue={(e) => setForm({ ...form, answer: e })}
          disabled={isLoading}
          placeHolder="Type the answer here..."
          containerClassname="flex-1 mt-4 lg:mt-5"
          handleClear={handleClear}
        />
        <div className="absolute flex flex-row items-center left-4 max-w-96">
          <RespondentPicker
            respondent={respondent}
            setRespondent={setRespondent}
          />
        </div>
      </div>
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
          ) : !isModified &&
            score !== null &&
            answer !== "" &&
            form.answer !== "" ? (
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
            onClick={handleDeleteMe}
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

      <ModalResult
        isVisible={isResultVisible && !!justification && score !== null}
        score={score ?? 0}
        justification={justification ?? ""}
        answer={answer}
        question={question}
        onClose={(e) => {
          if (e && e.re_evaluate) evaluate();
          setIsResultVisible(false);
        }}
      />
    </div>
  );
};

export default AnswerSheet;
