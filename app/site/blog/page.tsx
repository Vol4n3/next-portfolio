"use client";

export default function HomePage() {
  return (
    <>
      <header></header>
      <iframe
        style={{ width: "100%", height: "250px" }}
        src={"/editor?projectId=webgl"}
      ></iframe>
    </>
  );
}
