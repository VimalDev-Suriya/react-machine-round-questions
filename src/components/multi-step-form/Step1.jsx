const Step1 = (props) => {
  const { username, email, gender, handleInputChange } = props;

  return (
    <div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) =>
            handleInputChange('personal', e.target.name, e.target.checked)
          }
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) =>
            handleInputChange('personal', e.target.name, e.target.value)
          }
        />
      </div>
      <div>
        <label>
          Male
          <input
            type="radio"
            name="gender"
            checked={gender === 'male'}
            onChange={(e) =>
              handleInputChange('personal', e.target.name, 'male')
            }
          />
        </label>
        <label>
          Female
          <input
            type="radio"
            name="gender"
            checked={gender === 'female'}
            onChange={(e) =>
              handleInputChange('personal', e.target.name, 'female')
            }
          />
        </label>
        <label>
          Other
          <input
            type="radio"
            name="gender"
            checked={gender === 'other'}
            onChange={(e) =>
              handleInputChange('personal', e.target.name, 'other')
            }
          />
        </label>
      </div>
    </div>
  );
};

export default Step1;
