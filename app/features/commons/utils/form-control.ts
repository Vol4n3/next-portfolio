import { useEffect, useReducer, useState } from "react";

export const UPDATE_VALUE = "UPDATE_VALUE";
type ActionUpdateFormValues<T> = {
  type: typeof UPDATE_VALUE;
  payload: Partial<T>;
};

export type ErrorFields<T> = { [key in keyof T]?: boolean | string };
export const ADD_ERROR = "ADD_ERROR";

type ActionAddError<T> = {
  type: typeof ADD_ERROR;
  fieldName: keyof T;
  message?: boolean | string;
};
export const CLEAR_ERRORS = "CLEAR_ERRORS";

type ActionResetError = {
  type: typeof CLEAR_ERRORS;
};
type FormErrorActions<T> = ActionAddError<T> | ActionResetError;
const formErrorDispatch = <T>(
  previous: ErrorFields<T>,
  action: FormErrorActions<T>,
): ErrorFields<T> => {
  switch (action.type) {
    case CLEAR_ERRORS:
      return {};
    case ADD_ERROR:
      return { ...previous, [action.fieldName]: action.message ?? true };
  }
};

function formHasError<T>(
  errorsFields: ErrorFields<T>,
  key?: keyof T,
): string | boolean | undefined {
  if (key) {
    return errorsFields[key];
  }
  return !!Object.keys(errorsFields).length;
}

export const RESET_FORM = "RESET_FORM";
type ResetAction = {
  type: typeof RESET_FORM;
};
type FormRegisterActions<T> = ActionUpdateFormValues<T> | ResetAction;
export type ControlField<T> = {
  [K in keyof T]?: (values: T) => boolean | string;
};

export function useFormControl<T>(
  defaultFormValues: T,
  invalidControls: ControlField<T> = {},
) {
  const formValuesDispatch = (
    previous: T,
    action: FormRegisterActions<T>,
  ): T => {
    switch (action.type) {
      case RESET_FORM:
        return defaultFormValues;
      case UPDATE_VALUE:
        return { ...previous, ...action.payload };
    }
  };
  const [isDirty, setDirty] = useState<boolean>(false);
  const [values, setFormValues] = useReducer(
    formValuesDispatch,
    defaultFormValues,
  );
  const [errors, setErrors] = useReducer<typeof formErrorDispatch<T>>(
    formErrorDispatch,
    {},
  );

  function addFormError(errors: ErrorFields<T>) {
    Object.keys(errors).forEach((errorKey) => {
      setErrors({
        type: ADD_ERROR,
        message: errors[errorKey as keyof T],
        fieldName: errorKey as keyof T,
      });
    });
  }
  function getErrors(): ErrorFields<T> {
    let temp: ErrorFields<T> = {};
    Object.keys(invalidControls).forEach((controlKey) => {
      const callBack = invalidControls[controlKey as keyof T];
      if (callBack) {
        const invalid = callBack(values);
        if (invalid) {
          temp = { ...temp, [controlKey]: invalid };
        }
      }
    });
    return temp;
  }
  function validateForm() {
    setDirty(true);
    setErrors({ type: CLEAR_ERRORS });
    return !formHasError(getErrors());
  }
  function getFieldError(key?: keyof T) {
    return formHasError(
      {
        ...errors,
        ...getErrors(),
      },
      key,
    );
  }

  useEffect(() => {
    setDirty(false);
  }, [values]);
  const setValues = (values: Partial<T>) => {
    setFormValues({
      type: UPDATE_VALUE,
      payload: values,
    });
  };
  const resetValues = () => {
    setFormValues({
      type: RESET_FORM,
    });
  };
  return {
    values,
    setValues,
    resetValues,
    getFieldError,
    addFormError,
    validateForm,
    isDirty,
    getErrors,
  };
}
