import { useState } from "react";
import { archiveRubric, Rubric } from "@/database/rubric";
import { useDialog } from "@/context/dialog";
import { useRubric } from "@/context/main/rubric";
import { Plus } from "lucide-react";
import ModalView from "./ModalView";
import ModalCreate from "./ModalCreate";
import ModalEdit from "./ModalEdit";
import RubricItem from "./RubricItem";
import { cn } from "@/utils/style";

const RubricList = () => {
  const { rubrics, loading, refreshRubrics, removeRubric } = useRubric();
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [editingRubric, setEditingRubric] = useState<Rubric | null>(null);
  const { alert, confirm } = useDialog();

  const handleArchive = async (id: number, name: string) => {
    const confirmed = await confirm({
      title: "Confirm Deletion",
      description: `You will not be able to use this rubric but this will remain in your saved evaluations. Are you sure you want to delete the rubric "${name}"? `,
      confirmText: "Delete",
      cancelText: "Cancel",
      mode: "CRITICAL",
    });

    if (!confirmed) {
      return;
    }

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

  const handleEdit = (rubric: Rubric) => {
    setEditingRubric(rubric);
  };

  const handleModalClose = () => {
    setIsModalCreateOpen(false);
    setSelectedRubric(null);
    setEditingRubric(null);
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
            handleEdit={handleEdit}
          />
        ))}
      </div>

      {rubrics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rubrics found. Create your first rubric to get started.
        </div>
      ) : (
        <div className="py-4">
          <button
            className={cn(
              "w-full h-20 bg-panel text-primary",
              "hover:bg-secondary",
              "border border-uGrayLightLight rounded-lg ",
              "flex flex-row items-center justify-center gap-2"
            )}
            onClick={() => setIsModalCreateOpen(true)}
          >
            <Plus className="w-7 h-7" /> Create New Rubric
          </button>
        </div>
      )}
      <ModalView onClose={handleModalClose} rubric={selectedRubric} />
      <ModalCreate isOpen={isModalCreateOpen} onClose={handleModalClose} />
      <ModalEdit
        isOpen={!!editingRubric}
        onClose={handleModalClose}
        rubric={editingRubric}
      />
    </div>
  );
};

export default RubricList;
