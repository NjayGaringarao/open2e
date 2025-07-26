import InputBox from "@/components/InputBox";
import { useEvaluator } from "@/context/main/evaluator/useEvaluator";

import { useState } from "react";
import { Student } from "@/models";
import { nanoid } from "nanoid";
import Button from "@/components/Button";
import ModalStudentSelector from "../ModalStudentSelector";
import EvaluatorSheet from "./EvaluatorSheet";

export default function Evaluator() {
  const { state, setQuestion, addSheet, evaluateAllSheet, saveAllSheet } =
    useEvaluator();
  const [isSelectorVisible, setSelectorVisible] = useState(false);

  const handleAddSheet = () => {
    setSelectorVisible(true);
  };

  const handleSubmit = (selectedStudents: Student[]) => {
    selectedStudents.forEach((student) => {
      addSheet({
        id: nanoid(),
        student: student,
        trackedAnswer: "",
        committedAnswer: "",
        status: "NOT_EVALUATED",
        isEvaluationSaved: false,
      });
    });
  };
  return (
    <div className="flex flex-col p-6 flex-1 items-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/** QUESTION */}
        <div>
          <p className="text-uGrayLight text-xl mb-2 font-semibold">Question</p>
          <InputBox
            value={state.question}
            setValue={setQuestion}
            placeholder="Type the question here..."
            withVoiceInput
            inputClassName="p-2"
          />
        </div>

        {/** ANSWERS */}
        <div className="flex flex-col gap-4 w-full">
          <p className="text-uGrayLight text-xl font-semibold">Answers</p>
          {state.sheets.map((sheet) => (
            <EvaluatorSheet key={sheet.student.id} sheet={sheet} />
          ))}
        </div>

        {/** CONTROLLER */}
        {state.sheets.length ? (
          <div className="flex flex-row gap-4">
            <Button
              title="Add Sheet"
              onClick={handleAddSheet}
              className="flex-1"
            />
            {state.sheets.length > 1 && (
              <>
                <Button
                  title="Evaluate All"
                  onClick={evaluateAllSheet}
                  className="flex-1"
                  secondary
                />
                <Button
                  title="Save All"
                  onClick={saveAllSheet}
                  className="flex-1"
                  secondary
                />
              </>
            )}
          </div>
        ) : (
          <div className="h-24 2-full bg-panel rounded-lg flex flex-row gap-2 items-center justify-center">
            <p className="text-uGrayLight text-lg">No answer to evaluate.</p>
            <button
              onClick={handleAddSheet}
              className="text-primary text-lg hover:underline underline-offset-2"
            >
              Add Answer Sheet
            </button>
          </div>
        )}
      </div>
      <ModalStudentSelector
        isVisible={isSelectorVisible}
        setIsVisible={setSelectorVisible}
        selectionMode="multiple"
        onSubmit={handleSubmit}
        disabledStudentIds={state.sheets.map((sheet) => sheet.student.id)}
      />
    </div>
  );
}
