import React, { useEffect, useState } from "react";
import { RubricContext } from "./RubricContext";
import { getAllRubrics, Rubric } from "@/database/rubric";

export const RubricProvider = ({ children }: { children: React.ReactNode }) => {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRubrics = async () => {
    setLoading(true);
    try {
      const { rubrics, error } = await getAllRubrics();
      if (error) {
        console.error(`RubricProvider.loadRubrics :: ${error}`);
      } else {
        setRubrics(rubrics);
      }
    } catch (error) {
      console.error(`RubricProvider.loadRubrics :: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshRubrics = async () => {
    await loadRubrics();
  };

  const addRubric = (rubric: Rubric) => {
    setRubrics((prev) => [...prev, rubric]);
  };

  const removeRubric = (id: number) => {
    setRubrics((prev) => prev.filter((rubric) => rubric.id !== id));
  };

  const updateRubric = (updatedRubric: Rubric) => {
    setRubrics((prev) =>
      prev.map((rubric) =>
        rubric.id === updatedRubric.id ? updatedRubric : rubric
      )
    );
  };

  useEffect(() => {
    loadRubrics();
  }, []);

  return (
    <RubricContext.Provider
      value={{
        rubrics,
        loading,
        refreshRubrics,
        addRubric,
        removeRubric,
        updateRubric,
      }}
    >
      {children}
    </RubricContext.Provider>
  );
};
