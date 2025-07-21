import StepContainer from "@/components/setup/StepContainer";
import { useSetup } from "@/context/SetupProvider";

const ConfirmSetup = () => {
  const { navigate, step, totalSteps, username, mode, userRole } = useSetup();

  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={navigate.next}
      onBack={navigate.back}
      nextLabel="Confirm"
    >
      <div className="flex-1 flex flex-col justify-center gap-4">
        <h1 className="text-5xl font-semibold text-primary">
          Hello {username.first}!
        </h1>
        <p className="text-uGrayLight text-lg">
          {mode === "ONLINE"
            ? "You're almost done! Confirm your setup below to complete the initialization."
            : "You're almost there! Confirm your setup below to proceed with installing the necessary application dependencies."}
        </p>
        <table className="bg-panel text-uGray rounded-md overflow-hidden mt-8">
          <tbody>
            <tr>
              <td className="border border-uGrayLightLight px-4 py-2 ">
                USERNAME
              </td>
              <td className="border border-uGrayLightLight px-4 py-2  text-uGray text-base font-semibold">
                {username.middle
                  ? `${username.first} ${username.middle} ${username.last}`
                  : `${username.first} ${username.last}`}
              </td>
            </tr>
            <tr>
              <td className="border border-uGrayLightLight px-4 py-2 ">ROLE</td>
              <td className="border border-uGrayLightLight px-4 py-2 text-uGray text-base font-semibold">
                {userRole === "EVALUATOR"
                  ? "Evaluator (Teacher, Instructor, and etc.)"
                  : "Learner (Student and Self-learner)"}
              </td>
            </tr>
            <tr>
              <td className="border border-uGrayLightLight px-4 py-2 ">
                AVAILABLE TOOLS
              </td>
              <td className="border border-uGrayLightLight px-4 py-2">
                {userRole === "EVALUATOR" ? (
                  <ul className=" text-uGray text-base font-semibold list-disc list-inside">
                    <li>Question & Answer Evaluation</li>
                    <li>AI Chat</li>
                    <li>Performance Analytics</li>
                  </ul>
                ) : (
                  <ul className=" text-uGray text-base font-semibold list-disc list-inside">
                    <li>Question & Answer Evaluation</li>
                    <li>AI Chat</li>
                    <li>Performance Analytics</li>
                  </ul>
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-uGrayLightLight px-4 py-2 ">
                RESOURCES
              </td>
              <td className="border border-uGrayLightLight px-4 py-2 font-semibold">
                {mode === "ONLINE"
                  ? "OpenAI's GPT4o (Internet Required)"
                  : "Microsoft's Phi4-mini (Uses system resources)"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </StepContainer>
  );
};

export default ConfirmSetup;
