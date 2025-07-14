import { useState, useEffect } from "react";
import { Student } from "@/types/models";
import * as student from "@/utils/student";
import { useDialog } from "@/context/dialog/useDialog";
import { StudentContext } from "./studentContext";

export const StudentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const { alert } = useDialog();

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
    fetchStudentList();
  }, []);

  return (
    <StudentContext.Provider value={{ studentList, fetchStudentList }}>
      {children}
    </StudentContext.Provider>
  );
};
