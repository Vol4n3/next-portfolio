import {
  HTMLProps,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
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
  wraps,
  ...props
}: PropsWithChildren<
  FlexProps & Omit<HTMLProps<HTMLDivElement>, "width" | "height">
>) {
  const refDiv = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState<boolean>(false);
  const propsNames = [
    { prop: width, name: "width", defaultValue: "100%" },
    { prop: height, name: "height" },
    {
      prop: alignItems,
      name: "align-items",
    },
    { prop: justifyContent, name: "justify-content" },
    { prop: direction, name: "direction" },
    {
      prop: columnGap,
      name: "column-gap",
    },
    { prop: rowGap, name: "row-gap" },
    { prop: wraps, name: "flex-wrap", defaultValue: "wrap" },
  ];
  useEffect(() => {
    const div = refDiv.current;
    if (!div) {
      return;
    }
    propsNames.forEach(({ prop, name, defaultValue }) => {
      if (!prop) {
        if (!defaultValue) return;
        div.style.setProperty(`--flex_${name}_1`, defaultValue);
        return;
      }
      if (typeof prop === "string") {
        div.style.setProperty(`--flex_${name}_1`, prop);
      }
      if (typeof prop !== "object" || !prop.length) return;
      prop.forEach((w, i) => {
        if (w) {
          div.style.setProperty(`--flex_${name}_${i + 1}`, w);
        }
      });
    });
    setReady(true);
  }, [refDiv]);

  return (
    <div ref={refDiv} className={[styles.flex, className].join(" ")} {...props}>
      {ready && children}
    </div>
  );
}
