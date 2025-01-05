import React from 'react';

const SoftwareResources = () => {
  const categories = [
    {
      name: "Development Tools",
      software: [
        {
          name: "Visual Studio Code",
          description: "Popular code editor with extensive plugin support",
          url: "https://code.visualstudio.com/",
          license: "Free",
          requirements: "Windows 7+ / macOS 10.11+ / Linux",
        },
        {
          name: "IntelliJ IDEA Ultimate",
          description: "Powerful Java IDE (free for students)",
          url: "https://www.jetbrains.com/idea/",
          license: "Free with student email",
          requirements: "Windows / macOS / Linux",
        },
        // Add more development tools
      ]
    },
    {
      name: "Design Software",
      software: [
        {
          name: "Figma",
          description: "Collaborative interface design tool",
          url: "https://www.figma.com/education/",
          license: "Free for students",
          requirements: "Web-based",
        },
        // Add more design software
      ]
    },
    // Add more categories
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Software Resources</h1>

      {categories.map((category, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.software.map((software, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{software.name}</h3>
                  <p className="text-gray-600 mb-4">{software.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">License:</span>
                      <span className="text-sm text-gray-600">{software.license}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Requirements:</span>
                      <span className="text-sm text-gray-600">{software.requirements}</span>
                    </div>
                  </div>
                  
                  <a
                    href={software.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 rounded-xl p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Student Software Benefits</h2>
        <div className="prose max-w-none">
          <ul className="list-disc list-inside space-y-4">
            <li>
              <span className="font-medium">GitHub Student Pack:</span>
              <p className="ml-6 mt-2">
                Get access to developer tools and services worth thousands of dollars.
                Sign up with your student email.
              </p>
            </li>
            <li>
              <span className="font-medium">Microsoft Azure for Students:</span>
              <p className="ml-6 mt-2">
                Free access to Azure services and developer tools.
              </p>
            </li>
            {/* Add more benefits */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SoftwareResources; 