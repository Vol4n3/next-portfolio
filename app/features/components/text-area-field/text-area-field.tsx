import {
  ChangeEvent,
  HTMLProps,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styles from "@components/text-field/text-field.module.scss";

type eventNames = "onChange" | "onCut" | "onPaste" | "onDrop" | "onKeyDown";

export interface TextareaFieldProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, "value" | "onChange"> {
  noResize?: boolean;
  value: string;
  label: string;
  onChange: (value: string, originalEvent: ChangeEvent) => void;
  error?: boolean | string;
}

export const TextAreaField = ({
  error,
  label,
  onChange,
  value,
  noResize,
  className,
  ...rest
}: TextareaFieldProps) => {
  const refTextArea = useRef<HTMLTextAreaElement>(null);
  const resize = useCallback((): void => {
    if (noResize) {
      return;
    }
    const textarea = refTextArea.current as HTMLTextAreaElement;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [refTextArea]);
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
    <>
      <label>
        <div className={styles.label}>{label}</div>
        <textarea
          {...rest}
          value={value}
          className={[styles.textField, className].join(" ")}
          ref={refTextArea}
          onChange={(e) => handler("onChange", e)}
          onCut={(e) => handler("onCut", e)}
          onPaste={(e) => handler("onPaste", e)}
          onDrop={(e) => handler("onDrop", e)}
          onKeyDown={(e) => handler("onKeyDown", e)}
        />
      </label>
      <div className={styles.captionError}></div>
    </>
  );
};
