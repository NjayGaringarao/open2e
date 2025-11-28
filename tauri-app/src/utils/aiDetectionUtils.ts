export const getAIDetectionColor = (score: number) => {
  const percentage = Math.round(score * 100);
  if (percentage >= 85) return "bg-red-100 text-red-700";
  if (percentage >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
};

export const getAIDetectionCategory = (
  score: number
): "low" | "medium" | "high" => {
  const percentage = Math.round(score * 100);
  if (percentage >= 85) return "high";
  if (percentage >= 60) return "medium";
  return "low";
};

export const getAIDetectionIcon = (score: number) => {
  const category = getAIDetectionCategory(score);
  switch (category) {
    case "high":
      return "🔴";
    case "medium":
      return "🟡";
    case "low":
      return "🟢";
  }
};

export const formatAIDetectionScore = (score: number): string => {
  return `${Math.round(score * 100)}%`;
};

export const getAIDetectionLabel = (score: number): string => {
  const category = getAIDetectionCategory(score);
  switch (category) {
    case "high":
      return "High Risk";
    case "medium":
      return "Medium Risk";
    case "low":
      return "Low Risk";
  }
};

export const getAIDetectionTooltip = (score: number): string => {
  const percentage = Math.round(score * 100);
  if (percentage >= 85) return "High probability of AI generation (85%+)";
  if (percentage >= 60) return "Medium probability of AI generation (60-84%)";
  return "Low probability of AI generation (<60%)";
};
