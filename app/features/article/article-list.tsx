"use client";
import { InOut } from "@components/in-out/in-out";
import { CenteredContainer } from "@components/container/centered-container";
import { Card } from "@components/card/card";
import { Responsive } from "@components/responsive/responsive";
import { Article } from "@features/article/article";
import { Button } from "@components/button/button";
import { useRouter } from "next/navigation";
import { Routes } from "@features/routes/routes";
import Image from "next/image";

interface ArticleListProps {
  articles: Article[];
  isAdmin?: boolean;
}

export const ArticleList = ({ articles, isAdmin }: ArticleListProps) => {
  const router = useRouter();
  return (
    <InOut show={true} starting={true}>
      {isAdmin && (
        <Button
          theme={"primary"}
          onClick={() => router.push(Routes.adminArticlesCreate)}
        >
          Créer un article
        </Button>
      )}
      <CenteredContainer maxWidth={"1600px"}>
        <Responsive
          rules={[
            {
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(1,1fr)",
            },
            {
              gridTemplateColumns: "repeat(2,1fr)",
            },
            { gap: "30px", gridTemplateColumns: "repeat(3,1fr)" },
            { gap: "40px", gridTemplateColumns: "repeat(4,1fr)" },
          ]}
        >
          {articles.map((article) => (
            <Card
              key={article.id}
              onClick={() =>
                router.push(
                  `${isAdmin ? Routes.adminArticlesEdit : Routes.blog}/${
                    article.id
                  }`,
                )
              }
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
            </Card>
          ))}
        </Responsive>
      </CenteredContainer>
    </InOut>
  );
};
