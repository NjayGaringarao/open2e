import { useEffect, useState } from "react";
import * as respondentDB from "@/utils/respondent";
import { Respondent as RespondentType } from "@/types/models";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import InputBox from "@/components/InputBox";
import Button from "@/components/Button";

const Respondent = () => {
  const [respondents, setRespondents] = useState<RespondentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newForm, setNewForm] = useState({
    id: "",
    name: "",
  });
  const [editForm, setEditForm] = useState<{ id: string | null; name: string }>(
    {
      id: "",
      name: "",
    }
  );

  const refresh = async () => {
    const { respondents, error } = await respondentDB.getAll();
    if (respondents) setRespondents(respondents);
    if (error) setError(error);
  };

  const handleAdd = async () => {
    if (!newForm.name.trim() || !newForm.id.trim()) return;

    setLoading(true);

    const { error } = await respondentDB.add(
      newForm.id.trim(),
      newForm.name.trim()
    );

    if (!error) {
      setNewForm({
        id: "",
        name: "",
      });
      await refresh();
      setError("");
    } else {
      setError(error);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    const { error } = await respondentDB.update(id, editForm.name.trim());
    if (!error) {
      setEditForm((prev) => ({ ...prev, id: null }));
      await refresh();
      setError("");
    } else {
      setError(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this respondent?")) return;
    setLoading(true);
    const { error } = await respondentDB.remove(id);
    if (!error) {
      await refresh();
      setError("");
    } else {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex h-screen flex-row gap-6">
      <div className="flex flex-col p-6 flex-1 items-center">
        {/* This is the main content area of the page */}
        <div className="w-full max-w-5xl flex flex-col gap-4">
          {/* Add Form */}
          <div className="flex flex-row gap-2">
            <InputBox
              value={newForm.id}
              setValue={(e) => setNewForm((prev) => ({ ...prev, id: e }))}
              placeHolder="Enter respondent ID"
              containerClassname="w-1/4"
              inputClassName="text-base lg:text-base text-textBody md:py-1 lg:py-1"
            />
            <InputBox
              value={newForm.name}
              setValue={(e) => setNewForm((prev) => ({ ...prev, name: e }))}
              placeHolder="Enter respondent name"
              containerClassname="flex-1"
              inputClassName="text-base lg:text-base text-textBody md:py-1 lg:py-1"
            />
            <Button
              onClick={handleAdd}
              disabled={loading || !newForm.name.trim() || !newForm.id.trim()}
              className="bg-primary hover:brightness-110 text-white px-4 py-2 rounded-md flex items-center gap-1 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          {/* Table */}
          <table className="w-full border-collapse text-left rounded-md overflow-hidden">
            <thead className="bg-primary text-base text-background">
              <tr className="">
                <th className="p-3 border-b w-48">ID</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b w-24"></th>
              </tr>
            </thead>
            <tbody>
              {respondents.map((r) => (
                <tr
                  key={r.respondent_id}
                  className="border-b hover:bg-secondary"
                >
                  <td className="p-3 font-mono text-base">{r.respondent_id}</td>
                  <td className="p-3 font-mono text-base">
                    {editForm.id === r.respondent_id ? (
                      <InputBox
                        value={editForm.name}
                        setValue={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            name: e,
                          }))
                        }
                        containerClassname="flex-1"
                        inputClassName="text-base lg:text-base text-textBody md:py-0 lg:py-0"
                      />
                    ) : (
                      <span>{r.name}</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    {editForm.id === r.respondent_id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(r.respondent_id)}
                          className="text-base text-primary hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditForm({ id: null, name: "" })}
                          className="text-sm text-uRed hover:text-red-600"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditForm({ id: r.respondent_id, name: r.name });
                          }}
                          className="text-sm text-uGray hover:text-primary"
                        >
                          <Pencil className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.respondent_id)}
                          className="text-sm text-uRed hover:text-red-600"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {respondents.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-uGray">
                    No respondents yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* This is the sidebar for usage information */}
      <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
    </div>
  );
};

export default Respondent;
