"use client";
import { Button } from "@components/button/button";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@features/article/article";

export const ArticleEditor = ({ article }: { article: Article }) => {
  const router = useRouter();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as EventTarget & {
      content: HTMLTextAreaElement;
      title: HTMLInputElement;
      description: HTMLTextAreaElement;
      imageUri: HTMLInputElement;
    };

    await fetch("/api/articles", {
      body: JSON.stringify({
        title: target.title.value,
        content: target.content.value,
        creator: "Vol4N3",
        description: target.description.value,
        imageUri: target.description.value,
        id: encodeURI(target.title.value.replace(" ", "-")),
      } as Article),
      method: "POST",
    });
  };
  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>
      <form onSubmit={submit}>
        <div>
          <label>
            <div>Title</div>
            <input name={"title"} required={true} />
          </label>
        </div>
        <div>
          <label>
            <div>Image Uri</div>
            <input name={"imageUri"} type={"url"} />
          </label>
        </div>
        <div>
          <label>
            <div>Content</div>
            <textarea name={"content"} />
          </label>
        </div>
        <div>
          <label>
            <div>description</div>
            <textarea name={"description"} />
          </label>
        </div>
        <Button type={"submit"}>Valid</Button>
      </form>
    </>
  );
};
