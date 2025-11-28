import { getAllConversations } from "@/database/chat";
import { Conversation, Message } from "@/models";
import * as msgDB from "@/database/chat/message";

export const createConversationName = async (): Promise<string> => {
  const { conversations, error } = await getAllConversations();
  if (error || !conversations) return "# New Conversation";

  let maxNumber = 0;

  conversations.forEach((c) => {
    const match = c.title.match(/^# New Conversation(?: (\d+))?$/);
    if (match) {
      const num = match[1] ? parseInt(match[1], 10) : 0;
      if (num >= maxNumber) {
        maxNumber = num;
      }
    }
  });

  const next = maxNumber + 1;
  return next === 1 ? "# New Conversation" : `# New Conversation ${next}`;
};

export const updateMessageDB = async (message: Message): Promise<void> => {
  const { error } = await msgDB.update(message);
  if (error) console.warn(`${error}`);
};

export const addMessageDB = async (message: Message): Promise<void> => {
  const { error } = await msgDB.add(message);
  if (error) console.warn(`${error}`);
};

export const fetchMessagesByConversationFromDB = async (
  convo: Conversation
): Promise<Message[]> => {
  const { messages, error } = await msgDB.getAllByConversation(convo.id);
  if (!error && messages) {
    return messages;
  } else {
    console.warn(`${error}`);
    return [];
  }
};
