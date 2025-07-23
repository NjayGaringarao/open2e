import { createContext } from "react";
import { Student } from "@/models";

export type StudentContextType = {
  studentList: Student[];
  fetchStudentList: () => Promise<void>;
};

export const StudentContext = createContext<StudentContextType | null>(null);
