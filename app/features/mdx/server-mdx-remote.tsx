import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import { Spinner } from "@components/spinner/spinner";
import { IframeEditor } from "@features/editor/iframe-editor";

export const ServerMdxRemote = ({ source }: { source: string }) => {
  return (
    <Suspense fallback={<Spinner />}>
      <MDXRemote
        components={{
          IframeEditor: (props: any) => <IframeEditor {...props} />,
        }}
        source={source}
      />
    </Suspense>
  );
};
