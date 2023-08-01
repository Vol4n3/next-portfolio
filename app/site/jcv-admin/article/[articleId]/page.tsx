import { cache } from "react";
import { CenteredContainer } from "@components/container/centered-container";
import { ArticleEdit } from "./article-edit";
import { Article } from "@features/article/article";

const getArticles = cache(async (id: string) => {
  const res = await fetch(`${process.env.URI}/api/articles/${id}`);
  return res.json();
});
export default async function AdminArticleEditorPage({
  params: { articleId },
}: {
  params: { articleId: string };
}) {
  const article: Article = await getArticles(articleId);
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <ArticleEdit article={article} />
    </CenteredContainer>
  );
}
