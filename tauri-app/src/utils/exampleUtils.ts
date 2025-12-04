export interface ParsedUserContent {
  question: string;
  answer: string;
}

export interface ParsedAssistantContent {
  score: number;
  justification: string;
  suggested_query: string;
  error: string | null;
}

export interface ExampleFormData {
  question: string;
  answer: string;
  score: number;
  justification: string;
  suggested_query: string;
}

/**
 * Parse user_content string to extract QUESTION and ANSWER
 */
export const parseUserContent = (userContent: string): ParsedUserContent => {
  // Match QUESTION: followed by content until ANSWER: or end of string
  const questionMatch = userContent.match(
    /QUESTION:\s*([\s\S]*?)(?:\n\s*ANSWER:|$)/i
  );
  // Match ANSWER: followed by content until end of string
  const answerMatch = userContent.match(/ANSWER:\s*([\s\S]*?)$/is);

  return {
    question: questionMatch ? questionMatch[1].trim() : "",
    answer: answerMatch ? answerMatch[1].trim() : "",
  };
};

/**
 * Parse assistant_content JSON string to extract evaluation data
 */
export const parseAssistantContent = (
  assistantContent: string
): ParsedAssistantContent => {
  try {
    const parsed = JSON.parse(assistantContent);
    return {
      score: parsed.result?.score ?? 0,
      justification: parsed.result?.justification ?? "",
      suggested_query: parsed.suggested_query ?? "",
      error: parsed.error ?? null,
    };
  } catch (error) {
    return {
      score: 0,
      justification: "",
      suggested_query: "",
      error: "Failed to parse assistant content",
    };
  }
};

/**
 * Format question and answer into user_content format
 */
export const formatUserContent = (question: string, answer: string): string => {
  return `QUESTION: ${question.trim()}\nANSWER: ${answer.trim()}`;
};

/**
 * Format evaluation data into assistant_content JSON string
 */
export const formatAssistantContent = (
  score: number,
  justification: string,
  suggestedQuery: string
): string => {
  return JSON.stringify({
    result: {
      score,
      justification: justification.trim(),
    },
    suggested_query: suggestedQuery.trim(),
    error: null,
  });
};

/**
 * Validate example form data
 */
export const validateExample = (
  example: ExampleFormData,
  totalScore: number
): { isValid: boolean; error?: string } => {
  if (!example.question.trim()) {
    return { isValid: false, error: "Question is required" };
  }

  if (!example.answer.trim()) {
    return { isValid: false, error: "Answer is required" };
  }

  if (example.score < 0 || example.score > totalScore) {
    return {
      isValid: false,
      error: `Score must be between 0 and ${totalScore}`,
    };
  }

  if (!example.justification.trim()) {
    return { isValid: false, error: "Justification is required" };
  }

  return { isValid: true };
};
