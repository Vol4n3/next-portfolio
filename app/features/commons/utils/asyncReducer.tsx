import { useCallback, useState } from "react";

export function useAsyncReducer<TModel, TAction>(
  asyncReducer: (current: TModel, action: TAction) => Promise<TModel>,
  initialState: TModel,
): [TModel, (action: TAction) => Promise<void>] {
  const [state, setState] = useState(initialState);
  const dispatch = useCallback(
    async (action: TAction) => {
      const newState = await asyncReducer(state, action);
      setState(newState);
    },
    [asyncReducer, state],
  );
  return [state, dispatch];
}
