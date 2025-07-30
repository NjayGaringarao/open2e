import InputBox from "@/components/InputBox";
import { Question } from "@/models";
import { useLearner } from "@/context/main/learner/useLearner";
import { useEffect, useRef, useState } from "react";
import {
  getSimilarQuestions,
  getTopQuestions,
} from "@/database/question/learner";
import clsx from "clsx";

const QuestionBox = () => {
  const { question, updateQuestion, isLoading } = useLearner();
  const [isFocus, setIsFocus] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [suggestionList, setSuggestionList] = useState<Question[]>([]);
  const suggestionClickedRef = useRef(false);

  const fetchSimilarQuestion = async (question: string) => {
    setSuggestionList([]);
    const { questions, error } = await getSimilarQuestions(question);

    if (error) {
      console.warn(error);
    } else {
      setSuggestionList(questions);
    }
  };

  const fetchTopQuestion = async () => {
    // this will query top asked questions
    setSuggestionList([]);
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
        inputClassName="p-4"
        disabled={isLoading}
        onFocus={() => setIsFocus(true)}
        onBlur={handleOnBlur}
      />

      {isFocus && (
        <div
          className={clsx(
            "absolute bg-uGray w-full mt-2 rounded-md z-50",
            "flex flex-col"
          )}
        >
          <p>{isFilled ? "Similar Questions:" : "Suggested Questions:"}</p>
          {suggestionList.map((question) => (
            <button
              id={question.id.toString()}
              onMouseDown={() => handleSuggestionClick(question.content)}
            >
              {question.content}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBox;
