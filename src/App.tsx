import React from "react";
import CategoryEditorView from "./features/category-editor/CategoryEditorView";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 flex flex-col items-center justify-center gap-4">
        <img src="/src/assets/zara_logo.svg" alt="Zara Logo" className="w-64" />
        <h1 className="text-xl uppercase font-thin">Editor de Categorías</h1>
      </header>
      <CategoryEditorView />
    </div>
  );
};

export default App;
