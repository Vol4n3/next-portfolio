import {
  ChangeEvent,
  forwardRef,
  HTMLProps,
  SyntheticEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import styles from "./text-area-field.module.scss";
import { InputWrapper } from "@components/input-wrapper/input-wrapper";
import { ArrayToClassName } from "@commons/utils/utils";

type eventNames = "onChange" | "onCut" | "onPaste" | "onDrop" | "onKeyDown";

export interface TextareaFieldProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, "value" | "onChange"> {
  noResize?: boolean;
  value: string;
  label: string;
  onChange: (value: string, originalEvent: ChangeEvent) => void;
  error?: boolean;
  caption?: string;
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextAreaField(
  { error, label, onChange, value, noResize, className, caption, ...rest },
  ref,
) {
  const refTextArea = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => refTextArea.current!, [refTextArea]);
  const resize = useCallback((): void => {
    if (noResize) {
      return;
    }
    const textarea = refTextArea.current;
    if (!textarea) return;
    textarea.style.height = textarea.scrollHeight + "px";
  }, [refTextArea, noResize]);
  useEffect(() => {
    resize();
  }, [resize]);
  const handler = (
    name: eventNames,
    event: SyntheticEvent<HTMLTextAreaElement>,
  ): void => {
    window.setTimeout(() => {
      resize();
    }, 0);
    if (name === "onChange") {
      onChange(
        (event as ChangeEvent<HTMLTextAreaElement>).target.value,
        event as ChangeEvent<HTMLTextAreaElement>,
      );
      return;
    }
    const eventFn = rest[name];
    if (eventFn) {
      eventFn(event as any);
    }
  };
  return (
    <InputWrapper label={label} error={error} caption={caption}>
      <textarea
        {...rest}
        value={value}
        className={ArrayToClassName([
          styles.textAreaField,
          className,
          error && "error",
        ])}
        ref={refTextArea}
        onChange={(e) => handler("onChange", e)}
        onCut={(e) => handler("onCut", e)}
        onPaste={(e) => handler("onPaste", e)}
        onDrop={(e) => handler("onDrop", e)}
        onKeyDown={(e) => handler("onKeyDown", e)}
      />
    </InputWrapper>
  );
});
