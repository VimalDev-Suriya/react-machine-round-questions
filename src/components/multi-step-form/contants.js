export const UPDATE_VALUES = 'FORM/FIELD_UPDATE';
export const SET_ERRORS = 'FORM/SET_ERRORS';
export const RESET_FORM = 'FORM/RESET';
export const NEXT_STEP = 'NAV/NEXT';
export const PERV_STEP = 'NAV/PREV';

export const TOTAL_STEPS = 3;
export const STEPS_KEYS = ['personal', 'education', 'review'];

export const INITIAL_STATE = {
  step: 0,
  formData: {
    personal: { username: '', email: '', gender: '' },
    education: { degree: '', experience: '' },
    review: { consent: false },
  },
  error: {},
};
