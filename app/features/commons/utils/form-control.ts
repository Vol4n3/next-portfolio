import { useEffect, useState } from "react";

export type ErrorFields<T> = { [key in keyof T]?: string };

function hasErrorField<T>(
  errorsFields: ErrorFields<T>,
  key?: keyof T,
): string | undefined {
  if (key) {
    return errorsFields[key];
  }
  return Object.keys(errorsFields).join(",");
}

export type ControlField<T> = {
  [K in keyof T]?: (values: T) => string | null | undefined;
};

function applyControls<T>(
  controls: ControlField<T> = {},
  values: T,
): ErrorFields<T> {
  let temp: ErrorFields<T> = {};
  Object.keys(controls).forEach((controlKey) => {
    const callBack = controls[controlKey as keyof T];
    if (callBack) {
      const reason = callBack(values);
      if (reason) {
        temp = { ...temp, [controlKey]: reason };
      }
    }
  });
  return temp;
}

export function useFormControl<T extends {}>(
  defaultFormValues: T,
  controls: ControlField<T> = {},
) {
  const [isDirty, setDirty] = useState<boolean>(false);
  const [values, setFormValues] = useState<T>(defaultFormValues);
  const [errors, setFormErrors] = useState<ErrorFields<T>>({});

  /**
   * Validate the form and check errors
   */
  function validateForm() {
    setDirty(true);
    setFormErrors({});
    const errors = applyControls<T>(controls, values);
    setFormErrors((prev) => ({ ...prev, ...errors }));
    return !hasErrorField(errors);
  }

  useEffect(() => {
    setDirty(false);
  }, [values]);

  const setValues = (values: Partial<T>) => {
    setFormValues((prev) => ({
      ...prev,
      ...values,
    }));
  };
  const resetValues = () => {
    setFormValues(defaultFormValues);
  };
  return {
    values,
    setValues,
    resetValues,
    validateForm,
    isDirty,
    errors,
  };
}
