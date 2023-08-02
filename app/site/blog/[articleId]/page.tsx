import { cache } from "react";
import { CenteredContainer } from "@components/container/centered-container";
import { Article } from "@features/article/article";
import { ServerMdxRemote } from "@features/mdx/server-mdx-remote";

export const revalidate = 5;

const getArticles = cache(async (id: string) => {
  const uri = new URL(`${process.env.URI}/api/articles/${id}`);
  const res = await fetch(uri.href);
  return res.json();
});
export default async function BlogArticlePage({
  params: { articleId },
}: {
  params: { articleId: string };
}) {
  const article: Article = await getArticles(articleId);
  return (
    <CenteredContainer maxWidth={"1600px"}>
      <h2>{article.title}</h2>
      <ServerMdxRemote source={article.content}></ServerMdxRemote>
    </CenteredContainer>
  );
}
