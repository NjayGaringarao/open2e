import { Student } from "./models";

//#region Dialog

type AlertMode = "INFO" | "SUCCESS" | "ERROR";
type ConfirmMode = "DEFAULT" | "CRITICAL";

type AlertOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  mode?: AlertMode;
  backdropOnClose?: boolean;
  displayTime?: number;
};

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  mode?: ConfirmMode;
};

export type DialogContextType = {
  alert: (options: AlertOptions) => Promise<void>;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

export type StudentData = Omit<Student, "tag_id"> & {
  tag: string | null; // tag.content as `tag`
};
