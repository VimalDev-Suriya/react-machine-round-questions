const Suggestions = (props) => {
  const { loading, data, error, dataKey, customeLoader, customeError, input, onSuggestionSelect } =
    props;

  const highlightedText = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));

    return <span>
      {
        parts.map((part, index) => {
          return part.toLowerCase() === query.toLowerCase() ? <b key={index}>{part}</b> : part
        })
      }
    </span>
  };

  return (
    <div className="suggestion-container">
      {loading ? customeLoader : null}
      {error ? customeError : null}

      <ul className="list">
        {data.length > 0
          ? data.map((suggestion) => {
            const suggestedText = suggestion[dataKey] || suggestion;

            return suggestedText.includes(input) ? (
              <li className="list-item" key={suggestedText} onClick={() => onSuggestionSelect(suggestedText)}>
                {highlightedText(suggestedText, input)}
              </li>
            ) : null;
          })
          : null}
      </ul>
    </div>
  );
};

export default Suggestions;
