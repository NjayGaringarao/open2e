import InputBox from "@/components/InputBox";
import { Question } from "@/models";
import { useEvaluation } from "@/context/main/useEvaluation";
import { useEffect, useRef, useState } from "react";
import { getSimilarQuestions, getTopQuestions } from "@/database/question";
import clsx from "clsx";

const QuestionBox = () => {
  const { question, updateQuestion, isLoading } = useEvaluation();
  const [isFocus, setIsFocus] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [suggestionList, setSuggestionList] = useState<Question[]>([]);
  const suggestionClickedRef = useRef(false);

  const fetchSimilarQuestion = async (question: string) => {
    const { questions, error } = await getSimilarQuestions(question);

    if (error) {
      console.warn(error);
    } else {
      setSuggestionList(questions);
    }
  };

  const fetchTopQuestion = async () => {
    // this will query top asked questions

    const { questions, error } = await getTopQuestions();

    if (error) {
      console.warn(error);
    } else {
      setSuggestionList(questions);
    }
  };

  const handleSuggestionClick = (question: string) => {
    suggestionClickedRef.current = true;
    updateQuestion((prev) => ({ ...prev, tracked: question }));
    setIsFocus(false);
  };

  const handleOnBlur = async () => {
    setTimeout(() => {
      if (!suggestionClickedRef.current) {
        setIsFocus(false);
      }
      suggestionClickedRef.current = false;
    }, 100);
  };

  useEffect(() => {
    const _isFilled = !!question.tracked.length;
    setIsFilled(_isFilled);

    // Debounce
    const handler = setTimeout(() => {
      setSuggestionList([]);
      if (isFilled) {
        fetchSimilarQuestion(question.tracked);
      } else {
        fetchTopQuestion();
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [question]);

  return (
    <div className="relative">
      <p className="text-uGrayLight text-xl mb-2 font-semibold">Question</p>
      <InputBox
        value={question.tracked}
        setValue={(e) => updateQuestion((prev) => ({ ...prev, tracked: e }))}
        placeholder="Type the question here..."
        withVoiceInput
        inputClassName="p-4 text-base"
        disabled={isLoading}
        onFocus={() => setIsFocus(true)}
        onBlur={handleOnBlur}
      />

      <div
        className={clsx(
          "absolute bg-panel mt-2 p-2 rounded-md z-50",
          "shadow-md shadow-background",
          "flex-col items-start",
          "animate-fadeIn",
          isFocus && !!suggestionList.length ? "flex" : "hidden"
        )}
      >
        <p className="text-sm text-uGrayLight">
          {isFilled ? "Similar Questions:" : "Suggested Questions:"}
        </p>
        {suggestionList.map((question) => (
          <button
            key={question.id.toString()}
            onMouseDown={() => handleSuggestionClick(question.content)}
            className="px-4 text-uGrayLight text-lg"
          >
            {question.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionBox;
