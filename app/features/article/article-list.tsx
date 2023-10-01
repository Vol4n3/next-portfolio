import { CenteredContainer } from "@components/container/centered-container";
import { Article } from "@features/article/article";
import styles from "./article-list.module.scss";
import { ArticleCard } from "@features/article/article-card";
import { LinkButton } from "@components/button/button";
import { Routes } from "@features/routes/routes";

interface ArticleListProps {
  articles: Article[];
  isAdmin?: boolean;
}

export const ArticleList = ({ articles, isAdmin }: ArticleListProps) => {
  return (
    <CenteredContainer maxWidth={"1600px"}>
      {isAdmin && (
        <LinkButton theme={"primary"} href={Routes.adminArticlesCreate}>
          Créer un article
        </LinkButton>
      )}
      <div className={styles.grid}>
        {articles.map((article) => (
          <ArticleCard isAdmin={isAdmin} article={article} key={article.id} />
        ))}
      </div>
    </CenteredContainer>
  );
};
