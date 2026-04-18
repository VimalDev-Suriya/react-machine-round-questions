import { ProductService } from "../../services/ProductService";
import AutoComplete from "./AutoComplete";

const AutoCompleteContainer = () => {
  const fetchSuggestions = async () => {
    return await new ProductService().getProducts();
  };

  return (
    <>
      <AutoComplete
        placeholder={"Whats in your mind?"}
        fetchSuggestions={fetchSuggestions}
        staticData={{}}
        dataKey={"title"}
        customeLoader={<h1>Loading...</h1>}
        onSelect={(input) => {}}
        onInputChange={(input) => {}}
        onBlur={(input) => {}}
        onFocus={(input) => {}}
        customStyles={(input) => {}}
        customeError={<div>Error</div>}
      />
    </>
  );
};

export default AutoCompleteContainer;
