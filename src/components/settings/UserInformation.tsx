import { useEffect, useState } from "react";
import InputBox from "../InputBox";
import { Name } from "@/types/config";
import { useSettings } from "@/context/main/settings";
import Button from "../Button";
import { DEFAULT_USERNAME } from "@/constant/default";
import { useDialog } from "@/context/dialog";
import { toaster } from "../ui/toaster";

const UserInformation = () => {
  const { userName, update } = useSettings();
  const [form, setForm] = useState<Name>(DEFAULT_USERNAME);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { confirm } = useDialog();
  const handleReset = () => {
    setForm(userName);
  };

  const handleUpdate = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Changes",
      description:
        "This will update your username. Do you want to proceed with this change?",
    });

    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await update({ userName: form });
      setIsLoading(false);
      toaster.create({
        title: "Updated Succesfully",
        description: "Succesfully updated Username.",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Error Encountered",
        description: "There was an error occurred updating the Username.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleReset();
  }, [userName]);

  useEffect(() => {
    if (
      form.first !== userName.first ||
      form.middle !== userName.middle ||
      form.last !== userName.last
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [form]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-3 gap-2">
        <InputBox
          title="First Name"
          value={form.first ?? ""}
          setValue={(e) => setForm((prev) => ({ ...prev, first: e }))}
          disabled={isLoading}
          inputClassName="py-1 px-2 text-lg"
        />

        <InputBox
          title="Middle Name"
          value={form.middle ?? ""}
          setValue={(e) => setForm((prev) => ({ ...prev, middle: e }))}
          disabled={isLoading}
          inputClassName="py-1 px-2 text-lg"
        />

        <InputBox
          title="Last Name"
          value={form.last ?? ""}
          setValue={(e) => setForm((prev) => ({ ...prev, last: e }))}
          disabled={isLoading}
          inputClassName="py-1 px-2 text-lg"
        />
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

export default UserInformation;
