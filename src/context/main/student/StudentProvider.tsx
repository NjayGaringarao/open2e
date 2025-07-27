import { useState, useEffect } from "react";
import { Student } from "@/models";
import * as student from "@/database/student";
import { useDialog } from "@/context/dialog/useDialog";
import { StudentContext } from "./studentContext";
import { useSettings } from "../settings";

export const StudentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const { alert } = useDialog();
  const { userRole } = useSettings();

  const fetchStudentList = async () => {
    const { error, students } = await student.getAll();

    if (error) {
      if (error) {
        alert({
          title: "Failed to Initialize",
          description: error,
          mode: "ERROR",
        });
      }
    }
    setStudentList(students ?? []);
  };

  useEffect(() => {
    if (userRole === "EVALUATOR") fetchStudentList();
  }, []);

  return (
    <StudentContext.Provider value={{ studentList, fetchStudentList }}>
      {children}
    </StudentContext.Provider>
  );
};
