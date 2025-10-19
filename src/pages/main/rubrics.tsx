import MainContentBox from "@/components/container/MainContentBox";
import RubricList from "@/components/rubric/RubricList";
import { ListTodo } from "lucide-react";
import { HelpPanel } from "@/components/HelpPanel";
import RubricHelp from "@/constant/helpContent/RubricHelp";

const Rubrics = () => {
  return (
    <div className="flex-1 flex flex-row h-screen">
      <MainContentBox className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 py-8 items-center text-uGray text-4xl font-mono font-semibold">
          <ListTodo className="h-10 w-10" />
          Rubric Management
        </div>
        <RubricList />
      </MainContentBox>
      <HelpPanel>
        <RubricHelp />
      </HelpPanel>
    </div>
  );
};

export default Rubrics;
