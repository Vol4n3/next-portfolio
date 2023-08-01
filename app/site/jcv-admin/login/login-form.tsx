"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
export const LoginForm = () => {
  const router = useRouter();
  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as EventTarget & {
      client: HTMLInputElement;
      secret: HTMLInputElement;
    };
    fetch("/api/jwt", {
      method: "POST",
      body: JSON.stringify({
        client: target.client.value,
        secret: target.secret.value,
      }),
    })
      .then((blob) => blob.json())
      .then((data) => {
        window.sessionStorage.setItem("token", data.token);
        window.sessionStorage.setItem("token_expire", data.expire);
        router.push("/site/jcv-admin/article");
      })
      .catch(() => {
        console.log("invalid");
      });
  };
  return (
    <form onSubmit={submitForm}>
      <div>
        <input name={"client"} required />
      </div>
      <div>
        <input name={"secret"} type={"password"} required />
      </div>
      <button type={"submit"}>Login</button>
    </form>
  );
};
