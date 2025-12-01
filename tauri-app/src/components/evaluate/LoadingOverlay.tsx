import Loading from "../Loading";
import clsx from "clsx";

interface LoadingOverlayProps {
  isVisible: boolean;
  prompt: string;
}

const LoadingOverlay = ({ isVisible, prompt }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        "absolute inset-0 z-50",
        "bg-background/80 backdrop-blur-sm",
        "flex items-center justify-center"
      )}
    >
      <Loading size="large" prompt={prompt} />
    </div>
  );
};

export default LoadingOverlay;
