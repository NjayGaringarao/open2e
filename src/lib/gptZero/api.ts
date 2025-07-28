export const validateApiKey = async (
  api: string
): Promise<{ error?: string }> => {
  try {
    const res = await fetch("https://api.gptzero.me/v3/usage", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${api}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { error: "Invalid or unauthorized API key." };
      }
      return { error: `Unexpected error: ${res.statusText}` };
    }

    const data = await res.json();
    if (!data?.character_usage) {
      return { error: "Malformed response from GPTZero API." };
    }

    // Optionally, return success info if needed
    return {}; // no error means valid
  } catch (err) {
    return { error: "Failed to reach GPTZero API." };
  }
};
