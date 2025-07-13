import Database from "@tauri-apps/plugin-sql";

export const openMainDatabase = async () => {
  return await Database.load("sqlite:main.db");
};
