import { cache } from "react";
import { CenteredContainer } from "@components/container/centered-container";
import { Article } from "@features/article/article";
import { ServerMdxRemote } from "@features/mdx/server-mdx-remote";
import { Routes } from "@features/routes/routes";
import { Metadata } from "next";

export const revalidate = 5;
export const dynamic = "force-dynamic";
const getArticles = cache(async (id: string): Promise<Article> => {
  const uri = new URL(`${process.env.URI}${Routes.apiArticles}/${id}`);
  const res = await fetch(uri.href);
  return res.json();
});
type params = {
  params: { articleId: string };
};
export async function generateMetadata(
  { params: { articleId } }: params,
  /*  parent: ResolvingMetadata,*/
): Promise<Metadata> {
  // fetch data
  const article = await getArticles(articleId);

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
  };
}
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
      <time dateTime={article.created}></time>
    </CenteredContainer>
  );
}
