import { useState } from "react";
import { deleteRubric, Rubric } from "@/database/rubric";
import { useDialog } from "@/context/dialog";
import { useRubric } from "@/context/main/rubric";
import Button from "@/components/Button";
import RubricModal from "./RubricModal";
import { Plus, Trash } from "lucide-react";

const RubricList = () => {
  const { rubrics, loading, refreshRubrics, removeRubric } = useRubric();
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { alert } = useDialog();

  const handleDelete = async (id: number, name: string) => {
    const { error } = await deleteRubric(id);
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

  const handleViewRubric = (rubric: Rubric) => {
    setSelectedRubric(rubric);
    setIsModalOpen(true);
  };

  const handleCreateRubric = () => {
    setSelectedRubric(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
            className="flex flex-row justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{rubric.name}</h3>
              <p className="text-sm text-gray-500">
                Created: {new Date(rubric.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleViewRubric(rubric)}>View</Button>
              {rubric.name !== "Default Rubric" && (
                <Button
                  onClick={() => handleDelete(rubric.id, rubric.name)}
                  secondary
                >
                  <Trash className="w-5 h-5 text-uRed" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {rubrics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rubrics found. Create your first rubric to get started.
        </div>
      ) : (
        <div className="py-4">
          <Button className="w-full" onClick={handleCreateRubric}>
            <Plus className="w-7 h-7" /> Create New Rubric
          </Button>
        </div>
      )}

      <RubricModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        rubric={selectedRubric}
      />
    </div>
  );
};

export default RubricList;
