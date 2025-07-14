import { useState } from "react";
import InputBox from "@/components/InputBox";
import AnswerSheet from "@/components/evaluate/AnswerSheet";
import Button from "@/components/Button";
import { AnswerSheetProp } from "@/types/types";
import { Student } from "@/types/models";
import ModalStudentSelector from "@/components/evaluate/ModalStudentSelector";
import { nanoid } from "nanoid";
import { useStudent } from "@/context/student";
import { useTag } from "@/context/tag/useTag";

export default function Evaluate() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerList, setAnswerList] = useState<AnswerSheetProp[]>([]);
  const { studentList } = useStudent();
  const { tagList } = useTag();
  const handleUpdate = (updated: AnswerSheetProp) => {
    setAnswerList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDelete = (id: string) => {
    setAnswerList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  const handleStudentsSubmit = (students: Student[]) => {
    const existingStudentIds = new Set(answerList.map((a) => a.student.id));

    const newAnswerSheets: AnswerSheetProp[] = students
      .filter((student) => !existingStudentIds.has(student.id))
      .map((student) => ({
        id: nanoid(),
        question: question,
        answer: "",
        score: "",
        justification: "",
        isSaved: "false",
        student: student,
      }));

    setAnswerList((prev) => [...prev, ...newAnswerSheets]);
    setIsModalVisible(false);
  };

  return (
    <div className="flex h-screen flex-row gap-6">
      <div className="flex flex-col p-6 flex-1 items-center">
        <div className="w-full max-w-5xl flex flex-col gap-4">
          <div>
            <p className="text-textBody text-xl mb-2 font-semibold">Question</p>
            <InputBox
              value={question}
              setValue={setQuestion}
              placeholder="Type the question here..."
              withVoiceInput
              inputClassName="p-2"
            />
          </div>

          <div>
            <p className="text-textBody text-xl mb-2 font-semibold">Answers</p>
            <div className="flex flex-col gap-4">
              {answerList.map((a) => (
                <AnswerSheet
                  key={a.id}
                  data={a}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
              {answerList.length ? (
                <Button
                  onClick={handleAddClick}
                  title="Add Answer Sheet"
                  className="py-2"
                />
              ) : (
                <div className="h-24 2-full bg-panel rounded-lg flex flex-row gap-2 items-center justify-center">
                  <p className="text-textBody text-lg">
                    No answer to evaluate.
                  </p>
                  <button
                    onClick={handleAddClick}
                    className="text-primary text-lg hover:underline underline-offset-2"
                  >
                    Add Answer Sheet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <ModalStudentSelector
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          students={studentList}
          tags={tagList}
          selectionMode="multiple"
          onSubmit={handleStudentsSubmit}
          disabledStudentIds={answerList.map((a) => a.student.id)}
        />
      </div>

      {/* Sidebar for usage info */}
      <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
    </div>
  );
}
