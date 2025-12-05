import React, { useState } from "react";

const SearchTodo = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send to Dashboard
  };

  return (
    <div className="w-full flex items-center gap-2">
      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-700 outline-none"
      />
    </div>
  );
};

export default SearchTodo;
