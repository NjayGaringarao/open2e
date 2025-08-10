import StepContainer from "@/components/setup/StepContainer";
import { useDialog } from "@/context/dialog";
import { useLocalSetup } from "@/context/setup/local";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";

const ConfirmSetup = () => {
  const { navigate, step, totalSteps } = useSetupNavigation();
  const { username, systemMemory } = useSetupProcedure();
  const { startInstallation } = useLocalSetup();
  const { confirm } = useDialog();

  const handleOnNext = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Setup",
      description:
        "Your configuration will be saved. Would you like to continue?",
      mode: "CRITICAL",
    });

    if (!isConfirmed) return;

    if (systemMemory >= 8) {
      startInstallation();
      navigate.next();
    } else {
      navigate.next();
    }
  };
  return (
    <StepContainer
      step={step}
      totalSteps={totalSteps}
      onNext={handleOnNext}
      onBack={navigate.back}
      nextLabel="Confirm"
    >
      <div className="flex-1 flex flex-col justify-center gap-4">
        <h1 className="text-5xl font-semibold text-primary">
          Hello {username.first}!
        </h1>
        <p className="text-uGrayLight text-lg">
          {systemMemory >= 8
            ? "You're almost there! Confirm your setup below to proceed with installing the necessary application dependencies"
            : "You're almost done! Confirm your setup below to complete the initialization."}
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
              <td className="border border-uGrayLightLight px-4 py-2 ">
                AVAILABLE TOOLS
              </td>
              <td className="border border-uGrayLightLight px-4 py-2">
                <ul className=" text-uGray text-base font-semibold list-disc list-inside">
                  <li>Question & Answer Evaluation</li>
                  <li>AI Chat</li>
                  <li>Performance Analytics</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="border border-uGrayLightLight px-4 py-2 ">
                RESOURCES
              </td>
              <td className="border border-uGrayLightLight px-4 py-2 font-semibold">
                <ul className=" text-uGray text-base font-semibold list-disc list-inside">
                  <li>Cloud Service (Openai's GPT4o)</li>
                  {systemMemory >= 8 && (
                    <li>Local Resources (Microsoft's Phi4-mini)</li>
                  )}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </StepContainer>
  );
};

export default ConfirmSetup;
