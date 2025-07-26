import InputBox from "@/components/InputBox";
import AnswerSheet from "./AnswerSheet";
import { LearnerProvider } from "@/context/main/learner/LearnerProvider";
import { useLearner } from "@/context/main/learner/useLearner";

const LearnerContent = () => {
  const { setQuestion, question, sheet } = useLearner();

  return (
    <div className="flex flex-col p-6 flex-1 items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <div>
          <p className="text-uGrayLight text-xl mb-2 font-semibold">Question</p>
          <InputBox
            value={question}
            setValue={setQuestion}
            placeholder="Type the question here..."
            withVoiceInput
            inputClassName="p-4"
          />
        </div>

        <div>
          <p className="text-uGrayLight text-xl mb-2 font-semibold">Answer</p>
          <div className="flex flex-col gap-4">
            <AnswerSheet />
          </div>
        </div>

        <div>
          <p>Suggested Query: {sheet.suggested_query}</p>
        </div>
      </div>
    </div>
  );
};

const Learner = () => (
  <LearnerProvider>
    <LearnerContent />
  </LearnerProvider>
);

export default Learner;
