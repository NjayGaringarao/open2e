export type Article = {
  title: string;
  subtitle: string;
  url: string;
};

export type ArticleResult = {
  articles: { title: string; subtitle: string; url: string }[];
};
