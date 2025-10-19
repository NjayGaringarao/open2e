import { useState } from "react";
import { archiveRubric, Rubric } from "@/database/rubric";
import { useDialog } from "@/context/dialog";
import { useRubric } from "@/context/main/rubric";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import ModalView from "./ModalView";
import ModalCreate from "./ModalCreate";
import RubricItem from "./RubricItem";

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
          <RubricItem
            key={rubric.id}
            rubric={rubric}
            setSelectedRubric={setSelectedRubric}
            handleArchive={handleArchive}
          />
        ))}
      </div>

      {rubrics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rubrics found. Create your first rubric to get started.
        </div>
      ) : (
        <div className="py-4">
          <Button
            className="w-full h-20 bg-transparent text-primary hover:bg-secondary"
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
