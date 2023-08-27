import { CenteredContainer } from "@components/container/centered-container";
import { ArticleForm } from "@features/article/article-form";

export default async function AdminArticleEditorPage() {
  return (
    <CenteredContainer maxWidth={"1600px"}>
      <h2>Création d’article</h2>
      <ArticleForm />
    </CenteredContainer>
  );
}
