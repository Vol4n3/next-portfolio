import Editor from "@monaco-editor/react";

interface EditorWrapperProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export function EditorWrapper({
  language,
  value,
  onChange,
}: EditorWrapperProps) {
  const handleChange = (value: string | undefined) => {
    if (typeof value !== "undefined") {
      onChange(value);
    }
  };

  return (
    <Editor
      height={"calc(100vh - 30px)"}
      width={"50%"}
      defaultLanguage={language}
      theme="vs-dark"
      onChange={handleChange}
      value={value}
    />
  );
}

export default EditorWrapper;
