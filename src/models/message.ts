export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "system" | "assistant";
  content: string;
  status: "SENT" | "SUCCESS" | "FAILED";
  created_at: string;
  updated_at: string;
};
