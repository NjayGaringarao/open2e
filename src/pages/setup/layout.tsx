import Final from "./Final";
import LocalSetup from "./LocalSetup";
import Mode from "./Mode";
import Name from "./Name";
import OpenAIKey from "./OpenAIKey";
import Role from "./Role";
import Welcome from "./Welcome";
import Eula from "./Eula";
import { useSetup } from "@/context/SetupProvider";
import { LocalSetupProvider } from "@/context/LocalSetup/LocalSetupProvider";

const Layout = () => {
  const { mode, step } = useSetup();

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Step content */}
      {step === 0 && <Welcome />}
      {step === 1 && <Eula />}
      {step === 2 && <Name />}
      {step === 3 && <Role />}
      {step === 4 && <Mode />}
      {step === 5 &&
        (mode ? (
          mode === "ONLINE" ? (
            <OpenAIKey />
          ) : (
            <LocalSetupProvider>
              <LocalSetup />
            </LocalSetupProvider>
          )
        ) : null)}
      {step === 6 && <Final />}
    </div>
  );
};

export default Layout;
