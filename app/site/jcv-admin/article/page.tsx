import { CenteredContainer } from "@components/container/centered-container";
import { cache } from "react";
import { PaginatedResults } from "@commons/types/types";
import { Article } from "../../../features";
import { AdminArticles } from "./admin-articles";
export const revalidate = 5;
const getArticles = cache(async () => {
  const res = await fetch(`${process.env.URI}/api/articles`, {
    cache: "no-cache",
  });
  return res.json();
});
export default async function AdminArticlesPage() {
  const query: PaginatedResults<Article> = await getArticles();
  return (
    <CenteredContainer maxWidth={"800px"}>
      <AdminArticles article={query.results} />
    </CenteredContainer>
  );
}
