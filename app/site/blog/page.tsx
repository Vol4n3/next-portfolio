import { ArticleList } from "@features/article/article-list";
import { cache } from "react";
import { Article } from "../../features";
import { PaginatedResults } from "@commons/types/types";

export const revalidate = 5;

const getArticles = cache(async () => {
  const res = await fetch(`${process.env.URI}/api/articles`);
  return res.json();
});
export default async function HomePage() {
  const query: PaginatedResults<Article> = await getArticles();
  return <ArticleList articles={query.results} />;
}
