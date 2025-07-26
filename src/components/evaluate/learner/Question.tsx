import InputBox from "@/components/InputBox";
import { useLearner } from "@/context/main/learner/useLearner";

const Question = () => {
  const { question, updateQuestion, isLoading } = useLearner();

  return (
    <div>
      <p className="text-uGrayLight text-xl mb-2 font-semibold">Question</p>
      <InputBox
        value={question.tracked}
        setValue={(e) => updateQuestion((prev) => ({ ...prev, tracked: e }))}
        placeholder="Type the question here..."
        withVoiceInput
        inputClassName="p-4"
        disabled={isLoading}
      />
    </div>
  );
};

export default Question;
