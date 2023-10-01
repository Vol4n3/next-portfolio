import { ArticleList } from "@features/article/article-list";
import { cache } from "react";
import { PaginatedResults } from "@commons/types/types";
import { Article } from "@features/article/article";
import { Routes } from "@features/routes/routes";
import { fetchJson } from "@features/fetch/fetch";
import { notFound } from "next/navigation";

export const revalidate = 5;
export const dynamic = "force-dynamic";
const getArticles = cache(async () => {
  const uri = new URL(`${process.env.URI}${Routes.apiArticles}`);
  uri.searchParams.append("published", "true");
  return fetchJson<PaginatedResults<Article>>(uri);
});
export default async function HomePage() {
  const query: PaginatedResults<Article> = await getArticles().catch(() => {
    notFound();
  });
  return <ArticleList articles={query.results} />;
}
