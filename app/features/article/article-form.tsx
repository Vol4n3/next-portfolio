"use client";
import { Button } from "@components/button/button";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@features/article/article";
import { useFormControl } from "@commons/utils/form-control";
import { TextField } from "@components/text-field/text-field";
import { TextAreaField } from "@components/text-area-field/text-area-field";
import { Routes } from "@features/routes/routes";
import { fetchJson } from "@features/fetch/fetch";

const defaultArticle: Omit<Article, "updated" | "created"> = {
  content: "",
  creator: "Vol4n3",
  description: "",
  id: "",
  imageUri: "",
  keywords: [],
  published: false,
  title: "",
};
export const ArticleForm = ({ article }: { article?: Article }) => {
  const requiredMessage = "Champ requis";
  const router = useRouter();
  const { values, setValues, errors, validateForm } = useFormControl(
    article || defaultArticle,
    {
      title: ({ title }) => (title ? null : requiredMessage),
      id: ({ id }) => (id ? null : requiredMessage),
      content: ({ content }) => (content ? null : requiredMessage),
    },
  );
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await fetchJson<Article>(
      `${Routes.apiArticles}${article ? "/" + article.id : ""}`,
      {
        body: JSON.stringify(values),
        method: article ? "PATCH" : "POST",
        headers: new Headers({
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        }),
      },
    )
      .then((value) => {
        window.open(`${Routes.blog}/${value.id}`);
        router.push(`${Routes.adminArticlesEdit}/${value.id}`);
      })
      .catch((reason) => {
        console.error(reason);
      });
  };
  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>
      <form onSubmit={submit}>
        <TextField
          label={"Titre de l’article"}
          value={values.title || ""}
          caption={errors.title}
          error={!!errors.title}
          onChange={(title) =>
            setValues({
              title,
              id: title.toLowerCase().replace(/[\s'’.,]/g, "-") || "",
            })
          }
        />
        <TextField
          label={"Id"}
          value={values.id || ""}
          caption={errors.id}
          error={!!errors.id}
          onChange={(id) => setValues({ id })}
        />
        <div style={{ display: "flex" }}>
          <input value={""} onChange={() => {}} type={"file"} />
          <TextField
            label={"Image Uri"}
            type={"url"}
            value={values.imageUri || ""}
            caption={errors.imageUri}
            error={!!errors.imageUri}
            onChange={(imageUri) => setValues({ imageUri })}
          />
        </div>

        <TextField
          label={"Description"}
          value={values.description || ""}
          caption={errors.description}
          error={!!errors.description}
          onChange={(description) => setValues({ description })}
        />
        <TextAreaField
          label={"Content"}
          value={values.content || ""}
          caption={errors.content}
          error={!!errors.content}
          onChange={(content) => setValues({ content })}
        />
        <div>
          <label>
            Publié ?
            <input
              type={"checkbox"}
              checked={values.published}
              onChange={() => setValues({ published: !values.published })}
            />
          </label>
        </div>

        <Button theme={"primary"} type={"submit"}>
          {article ? "Modifier" : "Créer"}
        </Button>
      </form>
    </>
  );
};
