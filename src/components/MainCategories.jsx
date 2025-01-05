import React, { useState } from "react";
import { Link } from "react-router-dom";

const MainCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { title: "All Posts", link: "/" },
    { title: "Course Resources", link: "/resources" },
    { title: "BRACU Clubs", link: "/Clublist" },
    { title: "BRACU Utility tols", link: "/utils" },
    { title: "Trends | News", link: "/CurrentTrends" },
    { title: "Thesis Research Project", link: "/thesis" },
  ];

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex items-center gap-5 flex-wrap">
      {/* Keep the original search input but make it functional */}
      <input
        type="text"
        placeholder="Search in BracVerse"
        value={searchTerm}
        onChange={handleSearch}
        className="p-3 flex-1 rounded-full border-none outline-none bg-[#F3F3F7]"
      />

      {/* Show filtered categories */}
      {filteredCategories.map((category, index) => (
        <Link
          key={index}
          to={category.link}
          className={`py-2 px-4 rounded-3xl ${
            index === 0 ? "bg-[#1D1F4E] text-white" : "bg-[#F3F3F7]"
          }`}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default MainCategories;