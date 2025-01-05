import React from 'react';

const ThesisResources = () => {
  const thesisResources = [
    {
      title: "IEEE Xplore",
      description: "Digital library of technical content for engineering and technology.",
      url: "https://ieeexplore.ieee.org/",
      category: "Research Database",
      icon: "library_books"
    },
    {
      title: "Google Scholar",
      description: "Search across many disciplines and sources: articles, theses, books.",
      url: "https://scholar.google.com/",
      category: "Search Engine",
      icon: "school"
    },
    {
      title: "ResearchGate",
      description: "Professional network for scientists and researchers.",
      url: "https://www.researchgate.net/",
      category: "Academic Network",
      icon: "groups"
    },
    {
      title: "arXiv",
      description: "Open access archive for scholarly articles in various fields.",
      url: "https://arxiv.org/",
      category: "Repository",
      icon: "article"
    },
    {
      title: "ScienceDirect",
      description: "Leading platform of peer-reviewed literature.",
      url: "https://www.sciencedirect.com/",
      category: "Research Database",
      icon: "science"
    },
    {
      title: "ACM Digital Library",
      description: "Research database for computing and technology.",
      url: "https://dl.acm.org/",
      category: "Research Database",
      icon: "computer"
    },
    {
      title: "Springer Link",
      description: "Access scientific documents from journals, books, series, protocols and reference works.",
      url: "https://link.springer.com/",
      category: "Research Database",
      icon: "menu_book"
    },
    {
      title: "Mendeley",
      description: "Reference manager and academic social network.",
      url: "https://www.mendeley.com/",
      category: "Research Tool",
      icon: "bookmark"
    },
    {
      title: "Overleaf",
      description: "Online LaTeX editor for writing research papers.",
      url: "https://www.overleaf.com/",
      category: "Writing Tool",
      icon: "edit"
    },
    {
      title: "Connected Papers",
      description: "Explore connected papers in a visual graph.",
      url: "https://www.connectedpapers.com/",
      category: "Research Tool",
      icon: "account_tree"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thesis Research Resources</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thesisResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="material-icons text-blue-600 text-2xl mb-2">
                      {resource.icon}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-3">
                      {resource.category}
                    </span>
                    <p className="text-gray-600">
                      {resource.description}
                    </p>
                  </div>
                  <span className="material-icons text-gray-400">open_in_new</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips for Research</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="material-icons text-green-500 mr-2">check_circle</span>
              <span>Start with broad searches and gradually narrow down your topic</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-green-500 mr-2">check_circle</span>
              <span>Use multiple databases to ensure comprehensive coverage</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-green-500 mr-2">check_circle</span>
              <span>Keep track of your references from the beginning</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-green-500 mr-2">check_circle</span>
              <span>Focus on recent papers (last 3-5 years) for current trends</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThesisResources; 