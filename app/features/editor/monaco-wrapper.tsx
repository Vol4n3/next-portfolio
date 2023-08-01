import Editor from "@monaco-editor/react";

interface EditorWrapperProps {
  language: string;
  value: string;
  className?: string;
  width?: string;
  onChange: (value: string) => void;
}

export function EditorWrapper({
  language,
  value,
  width,
  onChange,
  className,
}: EditorWrapperProps) {
  const handleChange = (value: string | undefined) => {
    if (typeof value !== "undefined") {
      onChange(value);
    }
  };

  return (
    <Editor
      height={"calc(100vh - 30px)"}
      width={width || "100%"}
      className={className}
      defaultLanguage={language}
      theme="vs-dark"
      onChange={handleChange}
      value={value}
    />
  );
}

export default EditorWrapper;
