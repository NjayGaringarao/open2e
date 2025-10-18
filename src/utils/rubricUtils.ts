import { ScoreBracket } from "@/types/rubric";

/**
 * Validates that all score brackets cover the complete range from 0 to totalScore
 */
export const validateCompleteCoverage = (
  brackets: ScoreBracket[],
  totalScore: number
): { isValid: boolean; missingRanges: { min: number; max: number }[] } => {
  if (brackets.length === 0) {
    return {
      isValid: false,
      missingRanges: [{ min: 0, max: totalScore }],
    };
  }

  const sortedBrackets = [...brackets].sort((a, b) => a.minScore - b.minScore);
  const missingRanges: { min: number; max: number }[] = [];

  // Check if coverage starts from 0
  if (sortedBrackets[0].minScore > 0) {
    missingRanges.push({ min: 0, max: sortedBrackets[0].minScore - 1 });
  }

  // Check for gaps between brackets
  for (let i = 0; i < sortedBrackets.length - 1; i++) {
    const currentBracket = sortedBrackets[i];
    const nextBracket = sortedBrackets[i + 1];

    if (currentBracket.maxScore + 1 < nextBracket.minScore) {
      missingRanges.push({
        min: currentBracket.maxScore + 1,
        max: nextBracket.minScore - 1,
      });
    }
  }

  // Check if coverage ends at totalScore
  const lastBracket = sortedBrackets[sortedBrackets.length - 1];
  if (lastBracket.maxScore < totalScore) {
    missingRanges.push({
      min: lastBracket.maxScore + 1,
      max: totalScore,
    });
  }

  return {
    isValid: missingRanges.length === 0,
    missingRanges,
  };
};

/**
 * Validates that no score brackets overlap
 */
export const validateNoOverlaps = (brackets: ScoreBracket[]): boolean => {
  const sortedBrackets = [...brackets].sort((a, b) => a.minScore - b.minScore);

  for (let i = 0; i < sortedBrackets.length - 1; i++) {
    const currentBracket = sortedBrackets[i];
    const nextBracket = sortedBrackets[i + 1];

    if (currentBracket.maxScore >= nextBracket.minScore) {
      return false;
    }
  }

  return true;
};

/**
 * Converts score brackets to markdown string for storage
 */
export const convertBracketsToContent = (brackets: ScoreBracket[]): string => {
  if (brackets.length === 0) {
    return "";
  }

  const sortedBrackets = [...brackets].sort((a, b) => a.minScore - b.minScore);

  let content = "Scoring Rubric:\n\n";
  content += "| **Score Range** | **Criteria** |\n";
  content += "| --------------- | ------------ |\n";

  sortedBrackets.forEach((bracket) => {
    const range =
      bracket.minScore === bracket.maxScore
        ? `${bracket.minScore}`
        : `${bracket.minScore}-${bracket.maxScore}`;
    content += `| **${range}** | ${bracket.criteria} |\n`;
  });

  return content;
};

/**
 * Parses markdown content back to score brackets (for editing existing rubrics)
 */
export const parseContentToBrackets = (content: string): ScoreBracket[] => {
  const brackets: ScoreBracket[] = [];
  const lines = content.split("\n");

  let inTable = false;
  let idCounter = 0;

  for (const line of lines) {
    if (line.includes("| **Score Range** |")) {
      inTable = true;
      continue;
    }

    if (inTable && line.startsWith("|") && line.includes("**")) {
      const parts = line
        .split("|")
        .map((p) => p.trim())
        .filter((p) => p);

      if (parts.length >= 2) {
        const scoreRange = parts[0].replace(/\*\*/g, "").trim();
        const criteria = parts[1].trim();

        // Parse score range
        let minScore: number, maxScore: number;
        if (scoreRange.includes("-")) {
          const [min, max] = scoreRange
            .split("-")
            .map((s) => parseInt(s.trim()));
          minScore = min;
          maxScore = max;
        } else {
          minScore = maxScore = parseInt(scoreRange);
        }

        if (!isNaN(minScore) && !isNaN(maxScore)) {
          brackets.push({
            id: `bracket-${idCounter++}`,
            minScore,
            maxScore,
            criteria,
          });
        }
      }
    }
  }

  return brackets;
};

/**
 * Gets the coverage percentage of score brackets
 */
export const getCoveragePercentage = (
  brackets: ScoreBracket[],
  totalScore: number
): number => {
  if (brackets.length === 0) return 0;

  const sortedBrackets = [...brackets].sort((a, b) => a.minScore - b.minScore);
  let coveredPoints = 0;

  for (const bracket of sortedBrackets) {
    coveredPoints += bracket.maxScore - bracket.minScore + 1;
  }

  return Math.round((coveredPoints / (totalScore + 1)) * 100);
};
