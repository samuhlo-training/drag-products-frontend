import React from "react";
import CategoryEditorView from "./features/category-editor/CategoryEditorView";
import PreviewPage from "./features/category-editor/PreviewPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white p-4 flex flex-col items-center justify-center gap-4">
          <img
            src="/src/assets/logo_not.svg"
            alt="Zara Logo"
            className="w-64"
          />
        </header>
        <Routes>
          <Route path="/" element={<CategoryEditorView />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
