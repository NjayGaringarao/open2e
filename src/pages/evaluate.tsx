import { useState } from "react";
import InputBox from "../components/InputBox";
import AnswerSheet from "../components/evaluate/AnswerSheet";

export default function Evaluate() {
  const [question, setQuestion] = useState("");
  return (
    <div className="flex h-screen flex-row gap-6">
      <div className="flex flex-col p-6 flex-1 items-center">
        {/* This is the main content area of the page */}
        <div className="w-full max-w-5xl flex flex-col gap-4">
          <div>
            <p className="text-textBody text-xl mb-2 font-semibold">Question</p>
            <InputBox
              value={question}
              setValue={setQuestion}
              placeHolder="Type the question here..."
              withVoiceInput
            />
          </div>
          <div>
            <p className="text-textBody text-xl mb-2 font-semibold">Answers</p>
            <AnswerSheet question={question} />
          </div>
        </div>
      </div>

      {/* This is the sidebar for usage information */}
      <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
    </div>
  );
}
