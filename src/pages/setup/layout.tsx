import OnlineSetup from "./OnlineSetup";
import LocalSetup from "./LocalSetup";
import Mode from "./Mode";
import Name from "./Name";
import Role from "./Role";
import Welcome from "./Welcome";
import Eula from "./Eula";
import ConfirmSetup from "./ConfirmSetup";
import { useSetupNavigation } from "@/context/setup/navigation";
import { useSetupProcedure } from "@/context/setup/procedure";

const Layout = () => {
  const { step } = useSetupNavigation();
  const { mode } = useSetupProcedure();

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Step content */}
      {step === 0 && <Welcome />}
      {step === 1 && <Eula />}
      {step === 2 && <Name />}
      {step === 3 && <Role />}
      {step === 4 && <Mode />}
      {step === 5 && <ConfirmSetup />}
      {step === 6 && (mode === "ONLINE" ? <OnlineSetup /> : <LocalSetup />)}
    </div>
  );
};

export default Layout;
