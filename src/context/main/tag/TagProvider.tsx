import { useState, useEffect } from "react";
import { getAll } from "@/utils/tag";
import { useDialog } from "@/context/dialog/useDialog";
import { Tag } from "@/models";
import { TagContext } from "./tagContext";

export const TagProvider = ({ children }: { children: React.ReactNode }) => {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const { alert } = useDialog();

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
    fetchTagList();
  }, []);

  return (
    <TagContext.Provider value={{ tagList, fetchTagList }}>
      {children}
    </TagContext.Provider>
  );
};
