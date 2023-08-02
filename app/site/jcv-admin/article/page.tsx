import { CenteredContainer } from "@components/container/centered-container";
import { PaginatedResults } from "@commons/types/types";
import { Article } from "@features/article/article";
import { ArticleList } from "@features/article/article-list";

const getArticles = async () => {
  const res = await fetch(`${process.env.URI}/api/articles`, {
    cache: "no-cache",
  });
  return res.json();
};
export default async function AdminArticlesPage() {
  const query: PaginatedResults<Article> = await getArticles();
  return (
    <CenteredContainer maxWidth={"1600px"}>
      <ArticleList isAdmin={true} articles={query.results} />
    </CenteredContainer>
  );
}
