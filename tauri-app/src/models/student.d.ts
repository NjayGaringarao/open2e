import { Tag } from "./tag";

export type Student = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  tag?: Tag;
  remarks?: string;
};
