import { cache } from "react";
import { Article } from "../../../../features";
import { CenteredContainer } from "@components/container/centered-container";
import { ArticleEditor } from "./article-editor";

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
      <ArticleEditor article={article} />
    </CenteredContainer>
  );
}
