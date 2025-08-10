export const detectAI = async (
  answer: string
): Promise<{ percent: number; error?: string; message?: string }> => {
  try {
    const res = await fetch(`${OPEN2E_BACKEND}/api/detectAI/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    if (!res.ok) {
      return { percent: 0, error: await res.text(), message: "" };
    }

    return await res.json();
  } catch (error: any) {
    return {
      percent: 0,
      error: error.message || "Network error",
      message: "",
    };
  }
};
