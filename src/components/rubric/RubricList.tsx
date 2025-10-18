import { useState } from "react";
import { archiveRubric, Rubric } from "@/database/rubric";
import { useDialog } from "@/context/dialog";
import { useRubric } from "@/context/main/rubric";
import Button from "@/components/Button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/style";
import ModalView from "./ModalView";
import ModalCreate from "./ModalCreate";

const RubricList = () => {
  const { rubrics, loading, refreshRubrics, removeRubric } = useRubric();
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const { alert } = useDialog();

  const handleArchive = async (id: number, name: string) => {
    const { error } = await archiveRubric(id);
    if (error) {
      alert({
        title: "Error",
        description: `Failed to delete rubric: ${error}`,
        mode: "ERROR",
      });
    } else {
      removeRubric(id);
      alert({
        title: "Success",
        description: `Rubric "${name}" deleted successfully`,
        mode: "SUCCESS",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalCreateOpen(false);
    setSelectedRubric(null);
    refreshRubrics();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading rubrics...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-3">
        {rubrics.map((rubric) => (
          <div
            key={rubric.id}
            onClick={() => setSelectedRubric(rubric)}
            className={cn(
              "flex flex-row justify-between items-center",
              "p-4 shadow shadow-uGrayLight rounded-lg",
              "hover:bg-secondary cursor-pointer"
            )}
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{rubric.name}</h3>

              <p className="text-sm text-gray-600">
                Max Score: {rubric.total_score}
              </p>
            </div>

            {rubric.name !== "Default Rubric" && (
              <button
                onClick={() => handleArchive(rubric.id, rubric.name)}
                className="px-4"
              >
                <Trash2 className="w-6 h-6 text-uRed" />
              </button>
            )}
          </div>
        ))}
      </div>

      {rubrics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rubrics found. Create your first rubric to get started.
        </div>
      ) : (
        <div className="py-4">
          <Button
            className="w-full h-20 bg-transparent text-primary"
            onClick={() => setIsModalCreateOpen(true)}
          >
            <Plus className="w-7 h-7" /> Create New Rubric
          </Button>
        </div>
      )}
      <ModalView onClose={handleModalClose} rubric={selectedRubric} />
      <ModalCreate isOpen={isModalCreateOpen} onClose={handleModalClose} />
    </div>
  );
};

export default RubricList;
