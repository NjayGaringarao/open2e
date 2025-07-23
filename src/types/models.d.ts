/**
 * NOTE: This is a legacy file and will be set to depreciated. DO NOT USE
 * TODO: DELETE THIS FILE and use src/models instead
 */

export type Tag = {
  id: number;
  label: string;
};

export type Student = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  tag?: Tag;
  remarks?: string;
};
