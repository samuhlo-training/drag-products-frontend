import React from "react";
import CategoryEditorView from "./features/category-editor/CategoryEditorView";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryEditorView />
    </div>
  );
};

export default App;
