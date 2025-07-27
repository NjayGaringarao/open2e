import Database from "@tauri-apps/plugin-sql";

export const openEvaluatorDatabase = async () => {
  return await Database.load("sqlite:evaluator.db");
};

export const openLearnerDatabase = async () => {
  return await Database.load("sqlite:learner.db");
};
