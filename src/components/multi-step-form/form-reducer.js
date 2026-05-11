import { UPDATE_VALUES, NEXT_STEP, PERV_STEP, TOTAL_STEPS } from './contants';

export const formReducer = (currentState, payload) => {
  const { type, data } = payload;

  switch (type) {
    case UPDATE_VALUES: {
      const { key, name, value } = data;

      return {
        ...currentState,
        formData: {
          ...currentState.formData,
          [key]: {
            ...currentState.formData[key],
            [name]: value,
          },
        },
        error: {
          ...currentState.error,
          [name]: '',
        },
      };
    }

    case NEXT_STEP:
      return {
        ...currentState,
        step: Math.min(currentState.step + 1, TOTAL_STEPS - 1),
        error: {},
      };

    case PERV_STEP:
      return {
        ...currentState,
        step: Math.max(currentState.step - 1, 0),
        error: {},
      };

    default:
      return currentState;
  }
};
