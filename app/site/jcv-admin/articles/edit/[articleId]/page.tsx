import { cache } from "react";
import { CenteredContainer } from "@components/container/centered-container";
import { ArticleForm } from "@features/article/article-form";
import { Article } from "@features/article/article";
import { Routes } from "@features/routes/routes";

const getArticles = cache(async (id: string) => {
  const res = await fetch(`${process.env.URI}${Routes.apiArticles}/${id}`, {
    cache: "no-cache",
  });
  return res.json();
});
export default async function AdminArticleEditorPage({
  params: { articleId },
}: {
  params: { articleId: string };
}) {
  const article: Article = await getArticles(articleId);
  return (
    <CenteredContainer maxWidth={"1600px"}>
      <h2>Edition d’article</h2>
      <ArticleForm article={article} />
    </CenteredContainer>
  );
}
