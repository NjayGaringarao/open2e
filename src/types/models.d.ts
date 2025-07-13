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
