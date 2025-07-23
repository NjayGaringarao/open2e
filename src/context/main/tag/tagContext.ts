import { createContext } from "react";
import { Tag } from "@/models";

export type TagContextType = {
  tagList: Tag[];
  fetchTagList: () => Promise<void>;
};

export const TagContext = createContext<TagContextType | null>(null);
