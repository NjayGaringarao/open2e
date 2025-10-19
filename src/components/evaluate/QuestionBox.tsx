import InputBox from "@/components/InputBox";
import { Question } from "@/models";
import { useEvaluation } from "@/context/main/useEvaluation";
import { useEffect, useRef, useState } from "react";
import { getSimilarQuestions, getTopQuestions } from "@/database/question";
import { cn } from "@/utils/style";
import { Popover, PopoverPanel, Transition } from "@headlessui/react";

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

      <Popover className="relative">
        <InputBox
          value={question.tracked}
          setValue={(e) => updateQuestion((prev) => ({ ...prev, tracked: e }))}
          placeholder="Type the question here..."
          withVoiceInput
          inputClassName="px-4 py-3 text-base"
          disabled={isLoading}
          onFocus={() => setIsFocus(true)}
          onBlur={handleOnBlur}
        />

        <Transition
          show={isFocus && !!suggestionList.length}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <PopoverPanel
            static
            className={cn(
              "absolute bg-panel mt-2 p-2 rounded-md z-50 min-w-52 max-w-full",
              "overflow-x-hidden",
              "shadow-md shadow-background",
              "flex flex-col items-start"
            )}
          >
            <p className="text-sm text-uGrayLight">
              {isFilled ? "Similar Questions:" : "Suggested Questions:"}
            </p>
            {suggestionList.map((question) => (
              <button
                key={question.id.toString()}
                onMouseDown={() => handleSuggestionClick(question.content)}
                className="px-4 py-2 text-uGrayLight text-base text-nowrap text-ellipsis truncate w-full text-left hover:bg-secondary"
              >
                {question.content}
              </button>
            ))}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
};

export default QuestionBox;
