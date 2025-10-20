import { Rubric } from "@/database/rubric";
import { cn } from "@/utils/style";
import { Edit, Trash2 } from "lucide-react";

interface RubricItemProps {
  rubric: Rubric;
  setSelectedRubric: (rubric: Rubric) => void;
  handleArchive: (id: number, name: string) => void;
  handleEdit: (rubric: Rubric) => void;
}

const RubricItem = ({
  rubric,
  setSelectedRubric,
  handleArchive,
  handleEdit,
}: RubricItemProps) => {
  return (
    <div
      key={rubric.id}
      className={cn(
        "flex flex-row justify-between items-center",
        "border border-uGrayLightLight rounded-lg",
        "hover:bg-secondary cursor-pointer"
      )}
    >
      <div className="flex-1 p-4" onClick={() => setSelectedRubric(rubric)}>
        <h3 className="text-lg font-semibold">{rubric.name}</h3>

        <p className="text-sm text-gray-600">Max Score: {rubric.total_score}</p>
      </div>

      {rubric.created_by === "USER" ? (
        <div className="flex flex-row gap-4 px-4">
          <button
            onClick={() => handleEdit(rubric)}
            className="flex-2 py-4"
            title="Edit"
          >
            <Edit className="w-6 h-6 text-uGrayLight hover:text-uRed" />
          </button>
          <button
            onClick={() => handleArchive(rubric.id, rubric.name)}
            className="flex-2 py-4"
            title="Delete"
          >
            <Trash2 className="w-6 h-6 text-uGrayLight hover:text-uRed" />
          </button>
        </div>
      ) : (
        <p className="text-sm text-uGrayLightLight px-4">
          Created by {rubric.created_by}
        </p>
      )}
    </div>
  );
};

export default RubricItem;
