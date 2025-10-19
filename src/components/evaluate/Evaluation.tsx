import AnswerSheet from "./AnswerSheet";
import { EvaluationProvider } from "@/context/main/EvaluationProvider";
import QuestionBox from "./QuestionBox";
import { nanoid } from "nanoid";
import { useEvaluation } from "@/context/main/useEvaluation";
import ArticleItem from "./ArticleItem";
import RubricPicker from "../rubric/RubricPicker";
import clsx from "clsx";

const EvaluationContent = () => {
  const {
    articleList,
    question,
    selectedRubric,
    updateSelectedRubric,
    isLoading,
  } = useEvaluation();
  return (
    <div className="w-full flex flex-col gap-8">
      <RubricPicker
        selectedRubricId={selectedRubric?.id || null}
        onRubricSelect={updateSelectedRubric}
        disabled={isLoading}
      />

      <QuestionBox />

      <div>
        <p className="text-uGrayLight text-xl mb-2 font-semibold">Answer</p>
        <div className="flex flex-col gap-4">
          <AnswerSheet />
        </div>
      </div>

      <div
        className={clsx(
          "flex flex-col gap-4",
          question.committed === question.tracked && articleList.length
            ? "block"
            : "hidden"
        )}
      >
        <p className="text-xl font-semibold">Explore Further</p>
        <div className="grid grid-cols-2 gap-2">
          {articleList.map((article) => (
            <ArticleItem key={nanoid()} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Evaluation = () => (
  <EvaluationProvider>
    <EvaluationContent />
  </EvaluationProvider>
);

export default Evaluation;
