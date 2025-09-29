import RubricList from "@/components/rubric/RubricList";
import { ListTodo } from "lucide-react";

const Rubrics = () => {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="flex flex-1 flex-col w-full max-w-5xl p-6 overflow-y-auto">
        <div className="flex flex-row gap-4 py-8 items-center text-uGray text-4xl font-mono font-semibold">
          <ListTodo className="h-10 w-10" />
          Rubric Management
        </div>
        <RubricList />
      </div>
    </div>
  );
};

export default Rubrics;
