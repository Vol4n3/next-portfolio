import { CenteredContainer } from "@components/container/centered-container";
import { PaginatedResults } from "@commons/types/types";
import { Article } from "@features/article/article";
import { ArticleList } from "@features/article/article-list";
import { Routes } from "@features/routes/routes";
import { fetchJson } from "@features/fetch/fetch";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
const getArticles = async () => {
  return fetchJson<PaginatedResults<Article>>(
    `${process.env.URI}${Routes.apiArticles}`,
    {
      cache: "no-cache",
    },
  );
};
export default async function AdminArticlesPage() {
  const query: PaginatedResults<Article> = await getArticles().catch(() => {
    notFound();
  });
  return (
    <CenteredContainer maxWidth={"1600px"}>
      <ArticleList isAdmin={true} articles={query.results} />
    </CenteredContainer>
  );
}
