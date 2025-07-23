export type InputMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type OutputMessage = {
  role: "assistant";
  content: string;
};
