import Database from "@tauri-apps/plugin-sql";

export const openDatabase = async () => {
  return await Database.load("sqlite:main.db");
};
