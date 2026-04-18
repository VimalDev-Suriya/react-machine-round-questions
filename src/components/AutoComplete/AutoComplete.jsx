import { useEffect, useState } from "react";
import "./AutoComplete.scss";
import { useDebounce } from "../../hooks/useDebounce";
import Suggestions from "./Suggestions";

const AutoComplete = (props) => {
  const {
    placeholder,
    fetchSuggestions,
    onSelect,
    onInputChange,
    onBlur,
    onFocus,
    dataKey,
    customeLoader,
    customeError,
  } = props;
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState({
    loading: false,
    data: [],
    error: null,
  });
  const debouncedValue = useDebounce(input, 3000);

  console.log("custome", customeLoader);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onInputChange?.(e.target.value);
  };

  const handleSuggestionSelect = (e) => {
    // Final API call
    console.log(e);
    onSelect?.();
  };

  const handleApiCall = async () => {
    if (input) {
      setSuggestions((prev) => ({
        ...prev,
        loading: true,
      }));

      try {
        const data = await fetchSuggestions();
        setSuggestions((prev) => ({
          ...prev,
          data,
        }));
      } catch (error) {
        setSuggestions((prev) => ({
          ...prev,
          error,
        }));
      } finally {
        setSuggestions((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    }
  };

  useEffect(() => {
    if (debouncedValue) {
      handleApiCall();
    }
  }, [debouncedValue]);

  return (
    <div className="autocomplete-container">
      <div className="search-container">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          name="auto-suggestion-input"
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <button onClick={handleSuggestionSelect}>search</button>
      </div>

      <Suggestions
        error={suggestions.error}
        data={suggestions.data}
        loading={suggestions.loading}
        customeLoader={customeLoader}
        input={input}
        dataKey={dataKey}
        customeError={customeError}
      />
    </div>
  );
};

export default AutoComplete;
