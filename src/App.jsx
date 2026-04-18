import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserInputDebounce from "./components/Debounce/UserInputDebounce";
import TicTacToe from "./components/TicTacToe/TicTacToe";
import ToastContainer from "./components/Toast/ToastContainer";
import ToastProvider from "./components/Toast/ToastProvider";
import FileExplorer from "./components/FileExplorer/FileExplorer";
import Accordion from "./components/Accordion/Accordion";
import CheckboxContainer from "./components/MultiCheckbox/CheckboxContainer";
import CheckboxOptimzedContainer from "./components/MultiCheckbox/FlattenDate_Optimzed/CheckboxOptimizedContainer";
import Container from "./components/Model/Container";
import AutoCompleteContainer from "./components/AutoComplete/AutoCompleteContainer";

function App() {
  return (
    <div className="container">
      <ToastProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TicTacToe />} />
            <Route path="/user-input" element={<UserInputDebounce />} />
            <Route path="/file-explorer" element={<FileExplorer />} />
            <Route path="/accordion" element={<Accordion />} />
            <Route path="/checkbox" element={<CheckboxContainer />} />
            <Route
              path="/checkbox-op"
              element={<CheckboxOptimzedContainer />}
            />
            <Route path="/modal" element={<Container />} />
            <Route path="/autocomplete" element={<AutoCompleteContainer />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </div>
  );
}

export default App;
