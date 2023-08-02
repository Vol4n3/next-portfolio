import React, { Component, PropsWithChildren, Suspense } from "react";
import { Spinner } from "@components/spinner/spinner";
import { compileSync, runSync } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<PropsWithChildren, State> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <h1>Something went wrong: {this.state.error.message}</h1>;
    }

    return this.props.children;
  }
}

export const FrontMdxRemote = ({ source }: { source: string }) => {
  let Content = null;
  try {
    const code = String(
      compileSync(source, {
        outputFormat: "function-body",
        development: false,
      }),
    );
    const result = runSync(code, runtime);
    Content = result.default;
  } catch (e) {
    console.log(e);
  }

  return Content ? (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary>
        <MDXProvider>
          <Content />
        </MDXProvider>
      </ErrorBoundary>
    </Suspense>
  ) : null;
};
