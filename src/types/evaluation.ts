export type SheetData = {
  id: string;
  trackedAnswer: string;
  committedAnswer: string;
  score: number | null;
  justification: string;
  isEvaluationSaved: boolean;
  detectedAI?: number;
};

export type Result = {
  result: {
    score: number | null;
    justification: string;
  };
  error?: string | null;
  suggested_query: string;
};

export type Article = {
  title: string;
  subtitle: string;
  url: string;
};

export type ArticleResult = {
  articles: { title: string; subtitle: string; url: string }[];
};
