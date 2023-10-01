"use client";
import {
  CSSProperties,
  HTMLProps,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "./responsive.module.scss";
import { ArrayToClassName } from "@commons/utils/utils";

interface ResponsiveProps extends HTMLProps<HTMLDivElement> {
  rules: CSSProperties[];
  breakpoints?: { min?: number; max?: number }[];
}
function progressiveMerge<T>(list: T[]): T[] {
  return list.reduce((acc: T[], current: T, i: number) => {
    if (i > 0) {
      const previous = { ...acc[i - 1] };
      for (const key in previous) {
        if (current[key] === undefined) {
          current[key] = previous[key];
        }
      }
    }
    acc.push(current);
    return acc;
  }, []);
}

export const Responsive = ({
  rules,
  breakpoints = [
    { max: 576 },
    { min: 577, max: 768 },
    { min: 769, max: 992 },
    { min: 993, max: 1279 },
    { min: 1280 },
  ],
  children,
  className,
  ...props
}: PropsWithChildren<ResponsiveProps>) => {
  const [currentStyle, setCurrentStyle] = useState<CSSProperties>({});
  const applyStyle = useCallback(
    (index: number) => {
      const mergedRules = progressiveMerge(rules);
      const indexRules =
        index > mergedRules?.length - 1 ? mergedRules?.length - 1 : index;
      setCurrentStyle(mergedRules?.at(indexRules) || {});
    },
    [rules],
  );

  useEffect(() => {
    if (!breakpoints) return;

    const items = breakpoints?.map(({ min, max }, index) => ({
      media: window.matchMedia(
        [
          typeof min !== "undefined" ? `(min-width: ${min}px)` : null,
          typeof max !== "undefined" ? `(max-width: ${max}px)` : null,
        ]
          .filter((f) => !!f)
          .join(" and "),
      ),
      callback: (event: MediaQueryListEvent) => {
        if (!event.matches) return;
        applyStyle(index);
      },
    }));
    items?.forEach((item, index) => {
      item.media.addEventListener("change", item.callback);
      if (item.media.matches) {
        applyStyle(index);
      }
    });
    return () => {
      items?.forEach((item) =>
        item.media.removeEventListener("change", item.callback),
      );
    };
  }, [applyStyle, breakpoints]);
  return (
    <div
      {...props}
      className={ArrayToClassName([styles.responsive, className])}
      style={currentStyle}
    >
      {children}
    </div>
  );
};
