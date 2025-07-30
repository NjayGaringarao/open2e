export const detectAI = async (
  answer: string,
  apiKey?: string
): Promise<{ percent: number; error?: string; message?: string }> => {
  try {
    const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: apiKey ?? "U8G04K0JL0FRHDXNSCMQM95AKJWUYSKN", // Development api key
        text: answer,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        percent: 0,
        error: `API error ${res.status}: ${errorText}`,
      };
    }

    const data = await res.json();

    console.log(data);
    return {
      percent: Math.round((data.score ?? 0) * 100),
      message: `We are ${(data.score * 100).toFixed(
        2
      )}% certain that the answer is AI generated.`,
    };
  } catch (err: any) {
    return {
      percent: 0,
      error: err.message || "Failed to connect to Sapling API.",
    };
  }
};
