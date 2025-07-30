export const validateApiKey = async (
  api: string
): Promise<{ error?: string }> => {
  try {
    const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: api,
        text: "Test sentence to validate API key.",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      const message = data?.msg || res.statusText;

      if (message.toLowerCase().includes("invalid api key")) {
        return { error: "Invalid or unauthorized API key." };
      }

      return { error: `Unexpected error: ${message}` };
    }

    return {}; // no error, valid key
  } catch (err: any) {
    return { error: "Failed to reach Sapling API." };
  }
};
