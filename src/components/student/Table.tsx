import { Student } from "@/models";
import { useState } from "react";
import { useStudent } from "@/context/main/student";
import { useDialog } from "@/context/dialog";
import * as student from "@/utils/student";
import ModalEditStudent from "./ModalEditStudent";
import StudentTable from "../table/StudentTable";

const Table = () => {
  const { confirm } = useDialog();
  const { fetchStudentList } = useStudent();
  const [selected, setSelected] = useState<Student[]>([]);
  const [onEditStudent, setOnEditStudent] = useState<Student | null>(null);

  const handleDelete = async () => {
    if (
      !confirm({
        title: "Confirm Delete",
        description: "Are you sure you want to delete this student?",
        mode: "CRITICAL",
      })
    )
      return;

    await Promise.all(selected.map((s) => student.remove(s.id)));
    await fetchStudentList();
    setSelected([]);
  };

  return (
    <>
      <div className="relative flex flex-col gap-4 max-w-full overflow-y-auto">
        <StudentTable
          mode="MAIN"
          onRowClick={(s) => setOnEditStudent(s)}
          onSelectionChange={setSelected}
        />
      </div>

      {selected.length > 0 && (
        <div className="absolute bottom-0 bg-panel p-4 w-full flex justify-between items-center shadow-md z-50 rounded-md border border-primary">
          <p className="text-base text-uGrayLight">
            {selected.length} selected
          </p>
          <button
            className="px-4 py-2 bg-uRed text-white rounded-md hover:brightness-110"
            onClick={handleDelete}
          >
            Delete Selected
          </button>
        </div>
      )}

      <ModalEditStudent
        onEditStudent={onEditStudent}
        setOnEditStudent={setOnEditStudent}
        refreshHandler={fetchStudentList}
      />
    </>
  );
};

export default Table;
