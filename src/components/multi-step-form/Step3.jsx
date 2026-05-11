const Step3 = (props) => {
  const { formData, concent, handleInputChange } = props;

  return (
    <div>
      <div>Summary {JSON.stringify(formData)}</div>
      <div>
        <label>Consent:</label>
        <input
          type="checkbox"
          name="concent"
          value={concent}
          onChange={(e) =>
            handleInputChange('review', e.target.name, e.target.checked)
          }
        />
      </div>
    </div>
  );
};

export default Step3;
