import LocalSetup from "./LocalSetup";
import Welcome from "./Welcome";
import Eula from "./Eula";
import ConfirmSetup from "./ConfirmSetup";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";
import SkipLocalSetup from "./SkipLocalSetup";
import { RECOMMENDED_MEMORY } from "@/constant/memory";

const Layout = () => {
  const { step } = useSetupNavigation();
  const { systemMemory } = useSetupProcedure();

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Step content */}
      {step === 0 && <Welcome />}
      {step === 1 && <Eula />}
      {step === 2 && <ConfirmSetup />}
      {step === 3 &&
        (systemMemory >= RECOMMENDED_MEMORY ? (
          <LocalSetup />
        ) : (
          <SkipLocalSetup />
        ))}
    </div>
  );
};

export default Layout;
