"use client";
import { Button } from "@components/button/button";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@features/article/article";
import { useFormControl } from "@commons/utils/form-control";
import { TextField } from "@components/text-field/text-field";
import { TextAreaField } from "@components/text-area-field/text-area-field";

export const ArticleEdit = ({ article }: { article?: Article }) => {
  const requiredMessage = "Champ requis";
  const router = useRouter();
  const { values, setValues, isDirty, getFieldError, validateForm } =
    useFormControl<Partial<Article>>(article || {}, {
      title: ({ title }) => !title && requiredMessage,
    });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await fetch(`/api/articles${article ? "/" + article.id : ""}`, {
      body: JSON.stringify({
        ...values,
        creator: "Vol4N3",
        id: encodeURI(values.title?.replace(" ", "-") || ""),
      }),
      method: article ? "PATCH" : "POST",
      headers: new Headers({
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      }),
    });
  };
  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>
      <form onSubmit={submit}>
        <TextField
          label={"Title"}
          value={values.title || ""}
          error={isDirty && getFieldError("title")}
          onChange={(title) => setValues({ title })}
        />
        <TextField
          label={"Image Uri"}
          type={"url"}
          value={values.imageUri || ""}
          error={isDirty && getFieldError("imageUri")}
          onChange={(imageUri) => setValues({ imageUri })}
        />
        <TextField
          label={"Description"}
          value={values.description || ""}
          error={isDirty && getFieldError("description")}
          onChange={(description) => setValues({ description })}
        />
        <TextAreaField
          label={"Content"}
          value={values.content || ""}
          error={isDirty && getFieldError("content")}
          onChange={(content) => setValues({ content })}
        />

        <Button theme={"primary"} type={"submit"}>
          Valid
        </Button>
      </form>
    </>
  );
};
