import Loading from "../Loading";
import Button from "../Button";
import clsx from "clsx";
import { useEvaluation } from "@/context/main/useEvaluation";

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => {
  const { isEvaluating, cancelEvaluation, evaluationModelName } =
    useEvaluation();

  if (!isVisible || !isEvaluating) return null;

  return (
    <div
      className={clsx(
        "absolute inset-0 z-50",
        "bg-background/80 backdrop-blur-sm",
        "flex flex-col items-center justify-center gap-6"
      )}
    >
      <Loading
        size="large"
        prompt={`Evaluating using ${evaluationModelName}`}
      />
      <Button
        onClick={cancelEvaluation}
        className=" absolute bottom-4 right-4 w-34"
        title="Cancel"
      ></Button>
    </div>
  );
};

export default LoadingOverlay;
