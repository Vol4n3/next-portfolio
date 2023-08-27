import { ArticleList } from "@features/article/article-list";
import { cache } from "react";
import { PaginatedResults } from "@commons/types/types";
import { Article } from "@features/article/article";
import { Routes } from "@features/routes/routes";

export const revalidate = 5;

const getArticles = cache(async () => {
  const uri = new URL(`${process.env.URI}${Routes.apiArticles}`);
  uri.searchParams.append("published", "true");
  const res = await fetch(uri);

  return res.json();
});
export default async function HomePage() {
  const query: PaginatedResults<Article> = await getArticles();
  return <ArticleList articles={query.results} />;
}
