import { ChangeEvent, HTMLProps, useState } from "react";

interface FileFieldProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {}

export const FileField = ({ ...rest }: FileFieldProps) => {
  const [local, setLocal] = useState<string>("");
  const emitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocal(event.target.value);
  };
  return (
    <div>
      <input {...rest} type={"file"} value={local} onChange={emitChange} />
    </div>
  );
};
