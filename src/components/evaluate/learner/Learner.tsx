import AnswerSheet from "./AnswerSheet";
import { LearnerProvider } from "@/context/main/learner/LearnerProvider";
import Question from "./Question";

import { useLearner } from "@/context/main/learner/useLearner";
import ArticleItem from "./ArticleItem";

const LearnerContent = () => {
  const { articleList } = useLearner();
  return (
    <div className="flex flex-col p-6 flex-1 items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <Question />

        <div>
          <p className="text-uGrayLight text-xl mb-2 font-semibold">Answer</p>
          <div className="flex flex-col gap-4">
            <AnswerSheet />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">Explore Further</p>
          <div className="grid grid-cols-2 gap-2">
            {articleList.map((article) => (
              <ArticleItem article={article} />
            ))}
          </div>
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
