const Step2 = (props) => {
  const { degree, experience, handleInputChange } = props;
  return (
    <div>
      <div>
        <label>Degree:</label>
        <select
          name="degree"
          value={degree}
          onChange={(e) =>
            handleInputChange('education', e.target.name, e.target.value)
          }
        >
          <option value={'B.E'}>B.E</option>
          <option value={'M.E'}>M.E</option>
        </select>
      </div>
      <div>
        <label>Experience:</label>
        <input
          type="text"
          name="experience"
          value={experience}
          onChange={(e) =>
            handleInputChange('education', e.target.name, e.target.value)
          }
        />
      </div>
    </div>
  );
};

export default Step2;
