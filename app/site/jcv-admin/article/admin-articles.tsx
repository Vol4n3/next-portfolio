"use client";
import { useRouter } from "next/navigation";
import { ArticleList } from "@features/article/article-list";
import { Article } from "@features/article/article";

export const AdminArticles = ({ article }: { article: Article[] }) => {
  const router = useRouter();
  return (
    <ArticleList
      articles={article}
      onClick={(article) =>
        router.push(`/site/jcv-admin/article/${article.id}`)
      }
    />
  );
};
