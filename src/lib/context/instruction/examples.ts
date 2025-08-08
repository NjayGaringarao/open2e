export interface EvaluationExample {
  role: "user" | "assistant";
  content: string; // contains both QUESTION and ANSWER
}

export const evaluationExamples: EvaluationExample[] = [
  // Example 1
  {
    role: "user",
    content:
      "QUESTION: How do I know if my PC is compatible with Windows 11? \nANSWER: If the PC has a processor of Intel Core series 8th generation. Or an AMD equivalent, a TPM 2.0 and 8GB of RAM. It is compatible.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 10,
        justification: [
          "- Correctly identifies key requirements: processor type, TPM 2.0, and RAM.",
          "- Shows clear understanding of the topic relevant to the question.",
          "- While some requirements (like storage or graphics) are missing, the answer is sufficient for basic literacy.",
        ].join("\n\n"),
      },
      suggested_query:
        "hardware requirements for Windows 11 compatibility check",
      error: null,
    }),
  },

  // Example 2
  {
    role: "user",
    content:
      "QUESTION: What is phishing?\nANSWER: It's when you eat fish during work time.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 0,
        justification: [
          "- The answer is completely unrelated and nonsensical.",
          "- Shows no understanding of the topic.",
          "- Contains fabricated or joking content.",
        ].join("\n\n"),
      },
      suggested_query: "what is phishing in computer security for beginners",
      error: null,
    }),
  },

  // Example 3
  {
    role: "user",
    content:
      "QUESTION: What is the role of a system administrator?\nANSWER: To manage the computers and make sure they work.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 8,
        justification: [
          "- Shows basic understanding of the system administrator's responsibility.",
          "- Lacks specific details like user management, network configuration, or security.",
          "- Still relevant and valid for a basic answer.",
        ].join("\n\n"),
      },
      suggested_query: "roles and responsibilities of a system administrator",
      error: null,
    }),
  },

  // Example 4:
  {
    role: "user",
    content:
      "QUESTION: What is the function of Microsoft Excel?\nANSWER: It is used to make tables and do calculations.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 9,
        justification: [
          "- Correctly identifies two core functions: tabular data and calculations.",
          "- Could be slightly improved by mentioning features like formulas, charts, or data analysis.",
        ].join("\n\n"),
      },
      suggested_query: "uses of Microsoft Excel in office tasks",
      error: null,
    }),
  },

  // Example 5:
  {
    role: "user",
    content:
      "QUESTION: Give examples of 5 input devices.\nANSWER: The mouse, keyboard, Windows 10, MS Word, music",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 4, // 2 out of 5 expected answers × 10
        justification: [
          "- Mentions 5 input devices: mouse and keyboard.",
          "- The question requires 5 valid input devices but only the mouse and keyboard are valid",
          "- Applying proportional scoring: 2/5 x 10 = 4.",
        ].join("\n\n"),
      },
      suggested_query: "list of common input devices in computer basics",
      error: null,
    }),
  },

  // Example 6:
  {
    role: "user",
    content:
      "QUESTION: Who are examples of peopleware in computing?\nANSWER: The user and the technician.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 10,
        justification: [
          "- Identifies two accurate examples of people involved in computer use and maintenance.",
          "- Could include additional roles like software developers or system administrators.",
          "- Clear and relevant for basic understanding of peopleware.",
        ].join("\n\n"),
      },
      suggested_query: "examples of peopleware in computer systems",
      error: null,
    }),
  },

  // Example 7:
  {
    role: "user",
    content:
      "QUESTION: What is Microsoft Word used for?\nANSWER: To make documents.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 7,
        justification: [
          "- Answer is correct but overly vague.",
          "- Could mention editing, formatting, or printing text-based documents.",
          "- A bit too short to reflect full understanding.",
        ].join("\n\n"),
      },
      suggested_query: "common uses of Microsoft Word",
      error: null,
    }),
  },

  // Example 8:
  {
    role: "user",
    content:
      "QUESTION: What are the parts of Computer?\nANSWER: - Monitor\n- Keyboard\n- Mouse",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      result: {
        score: 10,
        justification: [
          "- The given answers are valid.",
          "- Applying proportional scoring: 3/2 (expected answer not provided, the question is in plural form, therefore 2) x 10 = 15, rounded down to 10.",
          "- Sufficient enough for very basic computer literacy.",
        ].join("\n\n"),
      },
      suggested_query: "basic parts of a computer",
      error: null,
    }),
  },
];
