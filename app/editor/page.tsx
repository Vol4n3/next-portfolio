"use client";

import { useSearchParams } from "next/navigation";
import { Editor } from "./components/editor";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  return <Editor projectId={projectId} />;
}
