import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type IntersectionObserverCallback = (params: IntersectionObserverEntry) => void;
export type IntersectionObserverProps = {
  element: Element;
  callback: IntersectionObserverCallback;
};
type IntersectionObserverContextProps = (
  options: IntersectionObserverProps
) => () => void;

const IntersectionObserverContext =
  createContext<IntersectionObserverContextProps>(() => {
    throw new Error("IntersectionObserverProvider is not mounted");
  });
export const useIntersectionObserver = () =>
  useContext(IntersectionObserverContext);

export function IntersectionObserverProvider({
  children,
  init,
}: PropsWithChildren<{ init?: IntersectionObserverInit }>) {
  const [listeners, setListeners] = useState<IntersectionObserverProps[]>([]);

  useEffect(() => {
    if (!listeners.length) return;
    const callBack = (entries: IntersectionObserverEntry[]) => {
      listeners.forEach((listener) => {
        entries.forEach((entry) => {
          if (entry.target === listener.element) {
            listener.callback(entry);
          }
        });
      });
    };

    const observable = new IntersectionObserver(callBack, init);
    listeners.forEach((options: IntersectionObserverProps) =>
      observable.observe(options.element)
    );
    return () => {
      observable.disconnect();
    };
  }, [listeners, init]);
  const addIntersectionObserver = useCallback(
    (options: IntersectionObserverProps) => {
      setListeners((prevState) => [...prevState, options]);
      return () =>
        setListeners((prevState) => prevState.filter((f) => f !== options));
    },
    []
  );
  return (
    <IntersectionObserverContext.Provider value={addIntersectionObserver}>
      {children}
    </IntersectionObserverContext.Provider>
  );
}
