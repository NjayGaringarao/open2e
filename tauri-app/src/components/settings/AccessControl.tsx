import InputBox from "@/components/InputBox";
import Button from "@/components/Button";
import { useState } from "react";
import { useSettings } from "@/context/main/settings";

export default function AccessControl() {
  const { isAdminLoggedIn, adminPasswordHash, updateAdminPassword } = useSettings();
  const [newPassword, setNewPassword] = useState("");

  const canChange = isAdminLoggedIn || !adminPasswordHash;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-uGrayLight text-sm">
        {canChange
          ? "Set or change the evaluator password (used to unlock evaluator features)."
          : "You must be logged in as evaluator to change the password."}
      </p>
      <InputBox
        placeholder="Enter new evaluator password"
        value={newPassword}
        setValue={setNewPassword}
        isPassword
        disabled={!canChange}
        inputClassName="py-2 px-3"
      />
      <div className="flex flex-row gap-2">
        <Button
          title="Save Password"
          onClick={async () => {
            if (!newPassword) return;
            await updateAdminPassword(newPassword);
            setNewPassword("");
            alert("Evaluator password saved.");
          }}
          disabled={!canChange || newPassword.length === 0}
        />
      </div>
    </div>
  );
}
