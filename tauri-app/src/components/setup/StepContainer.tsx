import Button from "@/components/Button";

interface StepContainerProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  children: React.ReactNode;
  nextLabel?: string;
  backLabel?: string;
  hideBack?: boolean;
  disabledBack?: boolean;
  disabledNext?: boolean;
}

const StepContainer = ({
  onBack,
  onNext,
  children,
  nextLabel = "Next",
  backLabel = "Back",
  hideBack = false,
  disabledBack = false,
  disabledNext = false,
}: StepContainerProps) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-background select-none">
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-12 py-4 gap-4">
        {children}
      </div>

      {/* Footer */}
      <div className="flex flex-row justify-end items-center w-full py-4 px-12 bg-panel">
        <div className="flex gap-4">
          {!hideBack && (
            <Button
              title={backLabel}
              className="w-32 h-10"
              onClick={onBack}
              disabled={disabledBack}
            />
          )}
          <Button
            title={nextLabel}
            className="w-32 h-10"
            onClick={onNext}
            disabled={disabledNext}
          />
        </div>
      </div>
    </div>
  );
};

export default StepContainer;
