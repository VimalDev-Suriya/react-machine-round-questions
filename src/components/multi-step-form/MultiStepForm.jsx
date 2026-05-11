import { useReducer } from 'react';
import { formReducer } from './form-reducer';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { NEXT_STEP, PERV_STEP, UPDATE_VALUES } from './contants';

const TOTAL_STEPS = 3;
const STEPS_KEYS = ['personal', 'education', 'review'];

const INITIAL_STATE = {
  step: 0,
  formData: {
    personal: { username: '', email: '', gender: '' },
    education: { degree: '', experience: '' },
    review: { consent: false },
  },
  error: {},
};

const MultiStepForm = () => {
  const [steps, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const { step, formData, error } = steps;

  const STEP_COMPONENTS = [Step1, Step2, Step3];
  const ActiveComponent = STEP_COMPONENTS[step];
  const currentStepFormFeilds = formData[STEPS_KEYS[step]];

  console.log('currentStepFormFeilds', currentStepFormFeilds);

  const handleInputChange = (key, name, value) => {
    dispatch({
      type: UPDATE_VALUES,
      data: { key, name, value },
    });
  };

  const handlePrev = () => {
    dispatch({
      type: PERV_STEP,
    });
  };

  const handleNext = () => {
    dispatch({
      type: NEXT_STEP,
    });
  };

  return (
    <div>
      {/* Progress Bar */}

      {/* Components */}
      <ActiveComponent
        {...currentStepFormFeilds}
        error={error}
        handleInputChange={handleInputChange}
      />

      {/* Navigations */}
      <div>
        <button onClick={handlePrev} disabled={step === 0}>
          Prev
        </button>

        {step === TOTAL_STEPS - 1 ? (
          <button>Submit</button>
        ) : (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
