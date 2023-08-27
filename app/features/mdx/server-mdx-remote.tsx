import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import { Spinner } from "@components/spinner/spinner";
import { CodeEditor } from "@features/editor/code-editor";

export const ServerMdxRemote = ({ source }: { source: string }) => {
  return (
    <Suspense fallback={<Spinner />}>
      <MDXRemote
        components={{
          CodeEditor: (props: any) => <CodeEditor {...props} />,
        }}
        source={source}
      />
    </Suspense>
  );
};
