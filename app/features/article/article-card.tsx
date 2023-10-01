import { Article } from "@features/article/article";
import Image from "next/image";
import { LinkCard } from "@components/card/card";
import { Routes } from "@features/routes/routes";

interface ArticleCardProps {
  isAdmin?: boolean;
  article: Article;
}

export function ArticleCard({ isAdmin, article }: ArticleCardProps) {
  return (
    <LinkCard
      href={`${isAdmin ? Routes.adminArticlesEdit : Routes.blog}/${article.id}`}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{article.title}</h3>
        <p>{isAdmin && article.published && "Publié"}</p>
      </div>
      <p>{article.description}</p>
      {article.imageUri && (
        <Image
          src={article.imageUri}
          alt={`Image d'article de ${article.title}`}
          width={50}
          height={50}
          style={{ width: "100%", height: "auto" }}
          placeholder={"empty"}
          priority={false}
        />
      )}
    </LinkCard>
  );
}
