import LocalSetup from "./LocalSetup";
import Name from "./Name";
import Welcome from "./Welcome";
import Eula from "./Eula";
import ConfirmSetup from "./ConfirmSetup";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";
import SkipLocalSetup from "./SkipLocalSetup";

const Layout = () => {
  const { step } = useSetupNavigation();
  const { systemMemory } = useSetupProcedure();

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Step content */}
      {step === 0 && <Welcome />}
      {step === 1 && <Eula />}
      {step === 2 && <Name />}
      {step === 3 && <ConfirmSetup />}
      {step === 4 && (systemMemory >= 8 ? <LocalSetup /> : <SkipLocalSetup />)}
    </div>
  );
};

export default Layout;
