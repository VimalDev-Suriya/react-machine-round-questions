# Multi-Step Form — Implementation Guide (Interview-Ready)

## What we are building

A 4-step form with all field types, per-step validation, a progress bar, a custom hook, and performance best practices. Every decision below has a "Why" so you can explain it in an interview.

---

## Final folder structure

```
src/components/multi-step-form/
├── constants.js                  ← action type strings
├── formConfig.js                 ← initial state + step metadata
├── formReducer.js                ← pure reducer
├── validators.js                 ← per-step validation rules
├── hooks/
│   └── useMultiStepForm.js       ← custom hook (all logic lives here)
├── components/
│   ├── FormField.jsx             ← label + input slot + error message
│   └── ProgressBar.jsx           ← step dots + fill bar
├── steps/
│   ├── Step1PersonalInfo.jsx     ← text, email, tel inputs
│   ├── Step2Education.jsx        ← select dropdown + radio buttons
│   ├── Step3Preferences.jsx      ← checkboxes + range slider + select
│   └── Step4Review.jsx           ← read-only summary + textarea + consent
├── MultiStepForm.jsx             ← thin orchestrator (just renders)
└── MultiStepForm.module.css      ← all styles (scoped CSS module)
```

> Old files to delete: `form-reducer.js`, `contants.js`, `Step1.jsx`, `Step2.jsx`, `Step3.jsx`

---

## Step 1 — `constants.js`

### What it contains

```js
export const UPDATE_FIELD = 'FORM/UPDATE_FIELD';
export const SET_ERRORS   = 'FORM/SET_ERRORS';
export const NEXT_STEP    = 'NAV/NEXT';
export const PREV_STEP    = 'NAV/PREV';
export const RESET_FORM   = 'FORM/RESET';
```

### Why we need it

- Typos in raw action strings cause **silent bugs** — the switch case simply falls through to `default` with no error. A named constant gives you a JS reference error immediately.
- The namespace prefix (`FORM/`, `NAV/`) prevents collisions and makes Redux DevTools readable.
- **Interview answer:** "I use constants so a misspelling is caught at import time, not at runtime."

---

## Step 2 — `formConfig.js`

### What it contains

```js
export const TOTAL_STEPS = 4;

export const STEP_KEYS = ['personal', 'education', 'preferences', 'review'];

export const STEP_LABELS = [
  'Personal Info', 'Education', 'Preferences', 'Review & Submit'
];

export const INITIAL_STATE = {
  step: 0,
  formData: {
    personal:    { firstName: '', lastName: '', email: '', phone: '' },
    education:   { degree: '', fieldOfStudy: '', experience: 'junior', employmentType: 'full-time' },
    preferences: { skills: [], salaryRange: 50, remoteWork: false, availability: '' },
    review:      { coverLetter: '', consent: false },
  },
  errors: {},
};
```

### Why we need it

- `TOTAL_STEPS` and `STEP_KEYS` are the **single source of truth**. Adding a 5th step means editing one array, not hunting across 5 files.
- `step: 0` (0-indexed) matches array index lookups directly — the existing bug in the old code was `step: 1` but keys `step_1..step_3`, so the reducer always wrote to the wrong key.
- Semantic keys (`personal`, `education`) survive step reordering without renaming anything.
- **Interview answer:** "All step metadata lives here. I never hardcode `4` or `'personal'` anywhere else."

---

## Step 3 — `formReducer.js`

### What it contains

```js
import { UPDATE_FIELD, SET_ERRORS, NEXT_STEP, PREV_STEP, RESET_FORM } from './constants';
import { INITIAL_STATE, TOTAL_STEPS } from './formConfig';

export const formReducer = (state, action) => {
  switch (action.type) {

    case UPDATE_FIELD: {
      const { stepKey, name, value } = action.payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          [stepKey]: { ...state.formData[stepKey], [name]: value },
        },
        errors: { ...state.errors, [name]: '' }, // clear this field's error on change
      };
    }

    case SET_ERRORS:
      return { ...state, errors: action.payload };

    case NEXT_STEP:
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS - 1), errors: {} };

    case PREV_STEP:
      return { ...state, step: Math.max(state.step - 1, 0), errors: {} };

    case RESET_FORM:
      return INITIAL_STATE;

    default:
      return state; // ← the old code was missing this `return`, causing React to crash
  }
};
```

### Why `useReducer` over multiple `useState` calls?

| `useState` approach | `useReducer` approach |
|---|---|
| 4+ state variables that must update together | One atomic state object |
| Logic scattered across event handlers | Logic centralised in one pure function |
| Hard to test without React | Trivial to unit-test — it is just a function |

### Why these specific decisions

- `Math.min` / `Math.max` are cleaner boundary guards than `if (step >= 3)` — they also automatically adapt if `TOTAL_STEPS` changes.
- Clearing `errors: {}` on `NEXT_STEP` and `PREV_STEP` means stale error messages never carry over to a different step.
- Clearing only the changed field's error in `UPDATE_FIELD` (`errors: { ...state.errors, [name]: '' }`) gives instant feedback as the user fixes a field.

---

## Step 4 — `validators.js`

### What it contains

```js
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const STEP_VALIDATORS = {
  0: ({ firstName, lastName, email, phone }) => {
    const errors = {};
    if (!firstName.trim())              errors.firstName = 'First name is required';
    if (!lastName.trim())               errors.lastName  = 'Last name is required';
    if (!email.trim())                  errors.email     = 'Email is required';
    else if (!EMAIL_REGEX.test(email))  errors.email     = 'Enter a valid email address';
    if (!phone.trim())                  errors.phone     = 'Phone number is required';
    else if (!PHONE_REGEX.test(phone.replace(/\D/g, '')))
                                        errors.phone     = 'Enter a valid 10-digit phone number';
    return errors;
  },
  1: ({ degree, fieldOfStudy }) => {
    const errors = {};
    if (!degree)              errors.degree       = 'Please select your degree';
    if (!fieldOfStudy.trim()) errors.fieldOfStudy = 'Field of study is required';
    return errors;
  },
  2: ({ skills, availability }) => {
    const errors = {};
    if (skills.length === 0) errors.skills       = 'Select at least one skill';
    if (!availability)       errors.availability = 'Please select your availability';
    return errors;
  },
  3: ({ consent }) => {
    const errors = {};
    if (!consent) errors.consent = 'You must agree to the terms to submit';
    return errors;
  },
};

export const validateStep = (stepIndex, data) =>
  STEP_VALIDATORS[stepIndex]?.(data) ?? {};

export const hasErrors = (errors) =>
  Object.values(errors).some(Boolean);
```

### Why we need it

- Each step owns its own validation rules — add a new field in Step 2 and you only touch `STEP_VALIDATORS[1]`.
- Keeping validators outside the reducer keeps the reducer **pure** — no string messages, no regex in state logic.
- `validateStep` returns `{}` (safe default) for unknown step indices via optional chaining + nullish coalescing.
- `hasErrors` is a one-liner predicate reused in both `goNext` and `handleSubmit`.
- **Interview answer:** "Validators are a map from step index to a function. I call the right one before allowing navigation forward."

---

## Step 5 — `hooks/useMultiStepForm.js` (the custom hook)

### What it contains

```js
import { useReducer, useCallback, useMemo } from 'react';
import { formReducer } from '../formReducer';
import { INITIAL_STATE, TOTAL_STEPS, STEP_KEYS } from '../formConfig';
import { validateStep, hasErrors } from '../validators';
import { UPDATE_FIELD, SET_ERRORS, NEXT_STEP, PREV_STEP, RESET_FORM } from '../constants';

export const useMultiStepForm = (onSubmitSuccess) => {
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const { step, formData, errors } = state;

  const currentStepKey = STEP_KEYS[step];

  const handleChange = useCallback((stepKey, name, value) => {
    dispatch({ type: UPDATE_FIELD, payload: { stepKey, name, value } });
  }, []); // stable forever — dispatch never changes

  const goNext = useCallback(() => {
    const stepErrors = validateStep(step, formData[currentStepKey]);
    if (hasErrors(stepErrors)) {
      dispatch({ type: SET_ERRORS, payload: stepErrors });
      return;
    }
    dispatch({ type: NEXT_STEP });
  }, [step, formData, currentStepKey]);

  const goPrev = useCallback(() => {
    dispatch({ type: PREV_STEP });
  }, []); // stable forever

  const handleSubmit = useCallback(() => {
    const stepErrors = validateStep(step, formData[currentStepKey]);
    if (hasErrors(stepErrors)) {
      dispatch({ type: SET_ERRORS, payload: stepErrors });
      return;
    }
    onSubmitSuccess?.(formData);
    dispatch({ type: RESET_FORM });
  }, [step, formData, currentStepKey, onSubmitSuccess]);

  const progress = useMemo(
    () => Math.round(((step + 1) / TOTAL_STEPS) * 100),
    [step]
  );

  return {
    step,
    formData,
    errors,
    progress,
    isFirst: step === 0,
    isLast:  step === TOTAL_STEPS - 1,
    currentStepKey,
    handleChange,
    goNext,
    goPrev,
    handleSubmit,
  };
};
```

### Why a custom hook?

- **Separation of concerns:** The component file becomes almost entirely JSX. All business logic lives here.
- **Testability:** You can test navigation, validation gating, and submission with `renderHook` from Testing Library — no component rendering needed.
- **Reusability:** Another component can use `useMultiStepForm` without duplicating logic.

### Why `useCallback` on every handler?

- Handlers are passed as props to `React.memo` step components. Without `useCallback`, a new function reference is created on every render → memo is defeated → every step re-renders on every keystroke.
- `handleChange` and `goPrev` have empty dependency arrays — they are stable for the entire lifetime of the component.

### Why `useMemo` on `progress`?

- `progress` is **derived state** (computable from `step`). The React golden rule: *never store what you can compute*.
- `useMemo` memoizes the result so it is only recomputed when `step` changes, not on every render.

### Why `onSubmitSuccess` callback?

- The hook does not know about UI (routing, success screens). The parent decides what to do after submission. This follows the principle of **inversion of control**.

---

## Step 6 — `components/FormField.jsx`

### What it contains

```jsx
import React from 'react';
import styles from '../MultiStepForm.module.css';

const FormField = ({ label, error, required, children }) => (
  <div className={`${styles.fieldGroup} ${error ? styles.fieldGroupError : ''}`}>
    {label && (
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
    )}
    {children}
    {error && <span className={styles.errorMsg}>{error}</span>}
  </div>
);

export default React.memo(FormField);
```

### Why we need it

- Every field repeats the same pattern: label → input → error message. Without this wrapper you write that structure 12+ times.
- `children` as a slot makes it work for `<input>`, `<select>`, `<textarea>`, radio groups, and checkbox grids — no API changes needed.
- `error` drives a CSS class on the wrapper div so you can style the entire group (border, background) not just the error text.
- `React.memo` wraps it once — all 12+ instances benefit.

---

## Step 7 — `components/ProgressBar.jsx`

### What it contains

```jsx
import React from 'react';
import { STEP_LABELS } from '../formConfig';
import styles from '../MultiStepForm.module.css';

const ProgressBar = ({ step, progress }) => (
  <div className={styles.progressContainer}>
    <div className={styles.stepIndicators}>
      {STEP_LABELS.map((label, index) => (
        <div
          key={label}
          className={[
            styles.stepDot,
            index <= step ? styles.stepDotActive : '',
            index <  step ? styles.stepDotCompleted : '',
          ].join(' ')}
        >
          <span className={styles.stepDotNumber}>
            {index < step ? '✓' : index + 1}
          </span>
          <span className={styles.stepDotLabel}>{label}</span>
        </div>
      ))}
    </div>

    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
    </div>
    <p className={styles.progressText}>{progress}% Complete</p>
  </div>
);

export default React.memo(ProgressBar);
```

### Why we need it

- `React.memo` — `step` and `progress` are primitives; this only re-renders when navigation happens, not on every keystroke.
- The `✓` vs step number logic gives instant visual confirmation of completed steps.
- The fill bar uses a CSS `transition: width 0.4s ease` for a smooth animation — this is **impossible with inline styles** alone, which is one strong reason to use a CSS module.
- **Interview answer:** "Progress is derived — `((step + 1) / totalSteps) * 100`. I compute it in the hook with `useMemo` and pass it down as a plain number."

---

## Step 8 — Step components

### Pattern applied to all four steps

```jsx
const StepN = React.memo(({ data, errors, onChange }) => {
  // Local handler — stable because `onChange` is stable (from useCallback in hook)
  const handleChange = useCallback((e) => {
    onChange('stepKey', e.target.name, e.target.value);
  }, [onChange]);

  return (
    <FormField label="Field Label" required error={errors.fieldName}>
      <input
        type="text"
        name="fieldName"
        value={data.fieldName}
        onChange={handleChange}
        className={`${styles.input} ${errors.fieldName ? styles.inputError : ''}`}
      />
    </FormField>
  );
});
```

### Field types used per step

| Step | Field types |
|---|---|
| **Step 1 — Personal Info** | `type="text"` (firstName, lastName), `type="email"`, `type="tel"` |
| **Step 2 — Education** | `<select>` (degree), `type="text"` (fieldOfStudy), `type="radio"` groups (experience level, employment type) |
| **Step 3 — Preferences** | `type="checkbox"` grid (skills — multi-select), `type="range"` (salary slider), `<select>` (availability), single `type="checkbox"` (remote work) |
| **Step 4 — Review** | Read-only summary sections for all previous steps, `<textarea>` (cover letter), `type="checkbox"` (consent — required to submit) |

### Why `React.memo` on every step?

Without memo, every keystroke in Step 1 causes all 4 step components to execute their render function. With memo:
- Only Step 1 re-renders (its `data` prop changed).
- Steps 2–4 skip rendering because their props are unchanged (different `formData` slice, same stable `errors: {}`, same stable `onChange` reference).

### Why local `useCallback` inside each step?

```js
const handleChange = useCallback((e) => {
  onChange('personal', e.target.name, e.target.value);
}, [onChange]);
```

`onChange` from the hook is stable. This local wrapper pre-fills `stepKey` and is also stable. So `<input onChange={handleChange}>` never receives a new function reference between renders → React skips diffing those DOM nodes.

### Step 4 — Review step specifically

Step 4 receives **full `formData`** (all 4 step objects) to render a summary of everything entered. It also has the only two editable fields on that step: `coverLetter` (textarea) and `consent` (checkbox). This is the final gate — you cannot submit without checking consent.

---

## Step 9 — `MultiStepForm.jsx` (thin orchestrator)

### What it contains

```jsx
import { useState, useCallback } from 'react';
import { useMultiStepForm } from './hooks/useMultiStepForm';
import ProgressBar from './components/ProgressBar';
import Step1PersonalInfo from './steps/Step1PersonalInfo';
import Step2Education    from './steps/Step2Education';
import Step3Preferences  from './steps/Step3Preferences';
import Step4Review       from './steps/Step4Review';
import styles from './MultiStepForm.module.css';

// ← The component map pattern
const STEP_COMPONENTS = [Step1PersonalInfo, Step2Education, Step3Preferences, Step4Review];
const STEP_KEYS       = ['personal', 'education', 'preferences', 'review'];

const MultiStepForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitSuccess = useCallback((data) => {
    console.log('Submitted:', data);
    setSubmitted(true);
  }, []);

  const { step, formData, errors, progress, isFirst, isLast,
          handleChange, goNext, goPrev, handleSubmit } =
    useMultiStepForm(handleSubmitSuccess);

  if (submitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2>Application Submitted!</h2>
        <p>Thank you. We will be in touch soon.</p>
        <button className={styles.btnPrimary} onClick={() => setSubmitted(false)}>
          Submit Another
        </button>
      </div>
    );
  }

  const ActiveStep = STEP_COMPONENTS[step];

  return (
    <div className={styles.formContainer}>
      <ProgressBar step={step} progress={progress} />

      <div className={styles.card}>
        <ActiveStep
          data={step < 3 ? formData[STEP_KEYS[step]] : undefined}
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />

        <div className={styles.navButtons}>
          {!isFirst && (
            <button className={styles.btnSecondary} onClick={goPrev}>
              ← Back
            </button>
          )}
          {isLast ? (
            <button className={styles.btnPrimary} onClick={handleSubmit}>
              Submit Application
            </button>
          ) : (
            <button className={styles.btnPrimary} onClick={goNext}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
```

### Why the component map pattern?

```js
// ❌ Old approach — does not scale
{formData.step === 0 ? <Step1 ... /> : null}
{formData.step === 1 ? <Step2 ... /> : null}
{formData.step === 2 ? <Step3 ... /> : null}

// ✅ Component map — add a step by pushing one entry
const STEP_COMPONENTS = [Step1, Step2, Step3, Step4];
const ActiveStep = STEP_COMPONENTS[step]; // O(1) lookup
```

- Adding a 5th step = push one entry to `STEP_COMPONENTS`. Zero new if-branches.
- **Interview answer:** "This is the strategy pattern — the array maps a step index to the component responsible for that step."

### Why only `submitted` state in the component?

Everything else (step, formData, errors) lives in the hook. The component only needs to know whether to show the form or the success screen — that is genuinely UI-only state, so `useState` is correct here.

---

## Step 10 — `MultiStepForm.module.css`

### Why CSS Modules over inline styles?

| Feature | Inline styles | CSS Modules |
|---|---|---|
| Scoped class names | N/A | ✓ auto-scoped |
| `:hover`, `:focus` pseudo-selectors | ✗ | ✓ |
| `:has(:checked)` for radio/checkbox pills | ✗ | ✓ |
| CSS `transition` / `animation` | ✗ | ✓ |
| Runtime cost | Zero | Zero (compiled) |

Key styles to write:

```css
/* Progress fill — smooth animation */
.progressFill {
  transition: width 0.4s ease;
}

/* Radio/Checkbox pills — highlight when selected using :has() */
.radioLabel:has(.radioInput:checked) {
  border-color: #4f46e5;
  background: #ede9fe;
  color: #4f46e5;
  font-weight: 600;
}

/* Input error state */
.inputError {
  border-color: #ef4444;
}
.inputError:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

- **Interview answer:** "CSS Modules give me component-level scoping with zero runtime cost and full CSS feature support — things like `:has()` and `transition` that inline styles cannot do."

---

## Summary — interview talking points

| Concept | Where it appears | What to say |
|---|---|---|
| `useReducer` | `formReducer.js` + hook | "6 state values that must update atomically — reducer makes each transition explicit and testable" |
| `useCallback` | Hook handlers + step handleChange | "Handlers are props to memo components — without useCallback, memo is defeated on every keystroke" |
| `useMemo` | `progress` in hook | "Progress is derived from step — I never store what I can compute" |
| `React.memo` | All step components, FormField, ProgressBar | "Without memo, all 4 steps re-render on every keystroke; with memo only the active step does" |
| Custom hook | `useMultiStepForm` | "All logic is in the hook — the component file is almost entirely JSX, and the hook is testable with renderHook" |
| Derived state | `progress`, `isFirst`, `isLast` | "These are computed from step — storing them separately would create sync bugs" |
| Validation gate | `goNext` calls `validateStep` before dispatching | "Validation runs on Next click; errors are cleared field-by-field as the user types" |
| Component map | `STEP_COMPONENTS[step]` | "The strategy pattern — adding a 5th step is one array push, zero new branches" |
| Single source of truth | `formConfig.js` | "TOTAL_STEPS and STEP_KEYS are defined once; everything else derives from them" |
| CSS Modules | Scoped styles + :has() + transitions | "Scoped names, full CSS support, zero runtime cost" |

---

## Verification checklist (after implementation)

- [ ] Navigate to `/multi-step-form` — form renders with step 1 visible
- [ ] Click **Next** on empty Step 1 — all 4 error messages appear inline
- [ ] Fill in valid data → Next → Step 2 loads
- [ ] Click **Back** on Step 2 → Step 1 data is preserved
- [ ] Fill all steps → **Submit** → success screen appears; console shows full `formData`
- [ ] Open React DevTools Profiler → type in Step 1 → confirm Steps 2, 3, 4 show "did not render"
- [ ] Click **Submit Another** → form resets to Step 1 with empty fields
