const Suggestions = (props) => {
  const { loading, data, error, dataKey, customeLoader, customeError, input } =
    props;

    

  return (
    <div className="suggestion-container">
      {loading ? customeLoader : null}
      {error ? customeError : null}

      <ul className="list">
        {data.length > 0
          ? data.map((suggestion) => {
              const suggestedText = suggestion[dataKey] || suggestion;

              return suggestedText.includes(input) ? (
                <li className="list-item" key={suggestedText}>
                  {suggestedText}
                </li>
              ) : null;
            })
          : null}
      </ul>
    </div>
  );
};

export default Suggestions;
