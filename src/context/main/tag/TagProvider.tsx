import { useState, useEffect } from "react";
import { getAll } from "@/utils/tag";
import { useDialog } from "@/context/dialog/useDialog";
import { Tag } from "@/models";
import { TagContext } from "./tagContext";
import { useSettings } from "../settings";

export const TagProvider = ({ children }: { children: React.ReactNode }) => {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const { alert } = useDialog();
  const { userRole } = useSettings();

  const fetchTagList = async () => {
    const { error, tags } = await getAll();

    if (error) {
      alert({
        title: "Failed to Initialize",
        description: error,
        mode: "ERROR",
      });
    }

    setTagList(tags ?? []);
  };

  useEffect(() => {
    if (userRole === "EVALUATOR") fetchTagList();
  }, []);

  return (
    <TagContext.Provider value={{ tagList, fetchTagList }}>
      {children}
    </TagContext.Provider>
  );
};
