"use client";
import { InOut } from "@components/in-out/in-out";
import { CenteredContainer } from "@components/container/centered-container";
import { Card } from "@components/card/card";
import { Responsive } from "@components/responsive/responsive";
import { Article } from "@features/article/article";

interface ArticleListProps {
  articles: Article[];
  onClick?: (article: Article) => void;
}

export const ArticleList = ({ articles, onClick }: ArticleListProps) => {
  return (
    <InOut show={true} starting={true}>
      <header></header>
      <CenteredContainer maxWidth={"1280px"}>
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
            <Card key={article.id} onClick={() => onClick && onClick(article)}>
              <div>{article.title}</div>
              <div>{article.description}</div>
            </Card>
          ))}
        </Responsive>
      </CenteredContainer>
    </InOut>
  );
};
