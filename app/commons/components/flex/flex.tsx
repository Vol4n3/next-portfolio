import { HTMLProps, PropsWithChildren, useEffect, useRef } from "react";
import styles from "./flex.module.scss";
import {
  AlignItemProps,
  FlexColumnGapProps,
  FlexDirectionProps,
  FlexHeightProps,
  FlexRowGapProps,
  FlexWidthProps,
  FlexWrapProps,
  JustifyContentProps,
} from "./flex-type";

type FlexProps = FlexWrapProps &
  AlignItemProps &
  JustifyContentProps &
  FlexDirectionProps &
  FlexWidthProps &
  FlexHeightProps &
  FlexColumnGapProps &
  FlexRowGapProps;

export function Flex({
  children,
  className,
  width,
  height,
  alignItems,
  justifyContent,
  direction,
  columnGap,
  rowGap,
  ...props
}: PropsWithChildren<
  FlexProps & Omit<HTMLProps<HTMLDivElement>, "width" | "height">
>) {
  const refDiv = useRef<HTMLDivElement>(null);
  const propsNames = [
    { prop: width, name: "width" },
    { prop: height, name: "height" },
    {
      prop: alignItems,
      name: "alignItems",
    },
    { prop: justifyContent, name: "justifyContent" },
    { prop: direction, name: "direction" },
    {
      prop: columnGap,
      name: "columnGap",
    },
    { prop: rowGap, name: "rowGap" },
    { prop: width, name: "width" },
  ];
  useEffect(() => {
    const div = refDiv.current;
    if (!div) {
      return;
    }
    propsNames.forEach(({ prop, name }) => {
      if (prop) {
        if (typeof prop === "string") {
          div.style.setProperty(`--flex_${name}_1`, prop);
        }
        if (typeof prop === "object") {
          if (prop.length) {
            prop.forEach((w, i) => {
              if (w) {
                div.style.setProperty(`--flex_${name}_${i + 1}`, w);
              }
            });
          }
        }
      }
    });
  });

  return (
    <div ref={refDiv} className={[styles.flex, className].join(" ")} {...props}>
      {children}
    </div>
  );
}
