import { useSettings } from "@/context/main/settings";
import { UserRole as UserRoleType } from "@/types/config";
import { useEffect, useState } from "react";
import Button from "../Button";
import Select from "../Select";
import { useDialog } from "@/context/dialog";
import { toaster } from "@/components/ui/toaster";

const UserRole = () => {
  const { userRole, update } = useSettings();
  const { confirm } = useDialog();
  const [selection, setSelection] = useState<UserRoleType>(
    () => userRole ?? "LEARNER"
  );
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setSelection(userRole);
  };

  const handleUpdate = async () => {
    const isConfirmed = await confirm({
      title: "Apply Role Change?",
      description:
        "Switching roles will immediately update your interface and experience. Your existing data will remain intact and can be accessed by switching back to the previous role at any time.\n\nDo you want to proceed with this change?",
    });

    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await update({ userRole: selection });
      setIsLoading(false);
      toaster.create({
        title: "Updated Succesfully",
        description: "Succesfully updated the UI Mode.",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Error Encountered",
        description: "There was an error occurred updating the UI Mode.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelection(userRole ?? "LEARNER");
  }, [userRole]);

  useEffect(() => {
    setIsModified(selection !== userRole);
  }, [selection, userRole]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={selection}
          onChange={(e) => setSelection(e.target.value as UserRoleType)}
          className="col-span-2 text-lg"
        >
          <option key="LEARNER" value="LEARNER">
            Learner (Good for Student and Self-learner)
          </option>
          <option key="LEARNER" value="EVALUATOR">
            Evaluator (Good for Teacher, Instructor, and etc)
          </option>
        </Select>
      </div>
      {isModified && (
        <div className="w-full flex flex-row justify-end items-center gap-4">
          <Button
            title="Update"
            onClick={handleUpdate}
            disabled={isLoading}
            className="w-24"
          />
          <Button
            title="Reset"
            onClick={handleReset}
            disabled={isLoading}
            className="w-24"
            secondary
          />
        </div>
      )}
    </div>
  );
};

export default UserRole;
