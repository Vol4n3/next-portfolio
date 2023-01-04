import { HTMLProps, PropsWithChildren } from "react";
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
  style,
  ...props
}: PropsWithChildren<
  FlexProps & Omit<HTMLProps<HTMLDivElement>, "width" | "height">
>) {
  const propsNames = [
    { propValue: width, name: "width", defaultValue: "100%" },
    { propValue: height, name: "height" },
    {
      propValue: alignItems,
      name: "align-items",
    },
    { propValue: justifyContent, name: "justify-content" },
    { propValue: direction, name: "direction" },
    {
      propValue: columnGap,
      name: "column-gap",
    },
    { propValue: rowGap, name: "row-gap" },
    { propValue: wraps, name: "flex-wrap", defaultValue: "wrap" },
  ].filter((f) => !!f.propValue);
  const appendStyle = propsNames.reduce(
    (prev, { propValue, defaultValue, name }) => {
      if (!propValue) {
        if (!defaultValue) return prev;
        return { ...prev, [`--flex_${name}_1`]: defaultValue };
      }
      if (typeof propValue === "string") {
        return { ...prev, [`--flex_${name}_1`]: propValue };
      }
      if (!Array.isArray(propValue) || !propValue.length) return prev;
      return {
        ...prev,
        ...(propValue as string[]).reduce((prevProp, currentProp, i) => {
          return currentProp
            ? { ...prevProp, [`--flex_${name}_${i + 1}`]: currentProp }
            : prevProp;
        }, {}),
      };
    },
    {}
  );

  return (
    <div
      className={[styles.flex, className].filter((f) => !!f).join(" ")}
      style={{ ...appendStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
