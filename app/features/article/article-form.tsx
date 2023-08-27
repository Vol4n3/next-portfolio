"use client";
import { Button } from "@components/button/button";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@features/article/article";
import { useFormControl } from "@commons/utils/form-control";
import { TextField } from "@components/text-field/text-field";
import { TextAreaField } from "@components/text-area-field/text-area-field";
import { Responsive } from "@components/responsive/responsive";

export const ArticleForm = ({ article }: { article?: Article }) => {
  const requiredMessage = "Champ requis";
  const router = useRouter();
  const { values, setValues, errors, validateForm } = useFormControl<
    Partial<Article>
  >(article || {}, {
    title: ({ title }) => (title ? null : requiredMessage),
    id: ({ id }) => (id ? null : requiredMessage),
  });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await fetch(`/api/articles${article ? "/" + article.id : ""}`, {
      body: JSON.stringify({
        ...values,
        creator: "Vol4N3",
      }),
      method: article ? "PATCH" : "POST",
      headers: new Headers({
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      }),
    })
      .then<Article>((blob) => blob.json())
      .then((value) => {
        window.open(`/site/blog/${value.id}`);
        router.push(`/jcv-admin/article/edit/${value.id}`);
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
          label={"Id"}
          value={values.id || ""}
          caption={errors.id}
          error={!!errors.id}
          onChange={(id) => setValues({ id })}
        />
        <TextField
          label={"Title"}
          value={values.title || ""}
          caption={errors.title}
          error={!!errors.title}
          onChange={(title) =>
            setValues({
              title,
              id: title.toLowerCase().replace(/\s/g, "-") || "",
            })
          }
        />
        <Responsive rules={[{ display: "flex" }]}>
          <input value={""} onChange={() => {}} type={"file"} />
          <TextField
            label={"Image Uri"}
            type={"url"}
            value={values.imageUri || ""}
            caption={errors.imageUri}
            error={!!errors.imageUri}
            onChange={(imageUri) => setValues({ imageUri })}
          />
        </Responsive>

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
          Valid
        </Button>
      </form>
    </>
  );
};
