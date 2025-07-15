import { Student } from "@/types/models";
import { useMemo, useState } from "react";
import { useStudent } from "@/context/student";
import { useDialog } from "@/context/dialog";
import * as student from "@/utils/student";
import InputBox from "../InputBox";
import CreateStudent from "./CreateStudent";
import ModalEditStudent from "./ModalEditStudent";
import StudentTable from "../table/StudentTable";
import { SearchIcon } from "lucide-react";

const Table = () => {
  const { confirm } = useDialog();
  const { studentList, fetchStudentList } = useStudent();
  const [globalFilter, setGlobalFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [selected, setSelected] = useState<Student[]>([]);
  const [onEditStudent, setOnEditStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    const base =
      tagFilter === "All"
        ? studentList
        : studentList.filter((s) => s.tag?.label === tagFilter);

    const lower = globalFilter.toLowerCase();
    return base.filter(
      (s) =>
        `${s.first_name} ${s.middle_name ?? ""} ${s.last_name}`
          .toLowerCase()
          .includes(lower) || s.tag?.label.toLowerCase().includes(lower)
    );
  }, [studentList, globalFilter, tagFilter]);

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
        <div className="flex gap-2 w-full justify-between">
          <div className="flex flex-row gap-2 items-center group">
            <SearchIcon className="text-textBody h-10 w-10 group-hover:text-primary" />
            <InputBox
              placeholder="Search here..."
              value={globalFilter}
              setValue={setGlobalFilter}
              inputClassName="py-1 px-2 group-hover:border-primary"
              containerClassname="col-span-2"
            />
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-2 py-1 border border-textBody rounded-md text-sm lg:text-base w-auto min-w-44 outline-none focus:border-primary focus:border-2"
            >
              <option value="All">All Tags</option>
              {[
                ...new Set(
                  studentList.map((s) => s.tag?.label).filter(Boolean)
                ),
              ].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <CreateStudent refreshHandler={fetchStudentList} />
        </div>

        <StudentTable
          mode="MAIN"
          data={filteredStudents}
          selectionMode="multiple"
          onRowClick={(s) => setOnEditStudent(s)}
          onSelectionChange={setSelected}
          height="  "
        />
      </div>

      {selected.length > 0 && (
        <div className="absolute bottom-0 bg-panel p-4 w-full flex justify-between items-center shadow-md z-50 rounded-md border border-primary">
          <p className="text-base text-textBody">{selected.length} selected</p>
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
