import clsx from "clsx";
import { ChevronDown, User } from "lucide-react";
import { Student } from "@/types/models";

interface IStudentPicker {
  student?: Student;
  setStudent: (student?: Student) => void;
}

const StudentPicker = ({ student, setStudent }: IStudentPicker) => {
  setStudent();
  return (
    <div
      className={clsx(
        "bg-background border border-textBody rounded-md px-4 resize-none",
        "text-base lg:text-lg text-textBody font-mono",
        "hover:border hover:border-primary group",
        "flex flex-row gap-4 items-center"
      )}
    >
      <User className="text-textBody w-4 h-4 group-hover:text-primary -mr-3" />
      {student ? student.name : "Anonymous"}
      <ChevronDown className="text-textBody w-4 h-4 group-hover:text-primary" />
    </div>
  );
};

export default StudentPicker;
