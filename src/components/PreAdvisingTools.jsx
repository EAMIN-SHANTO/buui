import React from 'react';

const PreAdvisingTools = () => {
  const tools = [
    {
      name: "BRACU Routine Generator",
      url: "https://bracuroutine.com",
      description: "Generate conflict-free class routines before advising",
      features: [
        "Drag and drop interface",
        "Automatic conflict detection",
        "Save multiple routines",
        "Export to PDF"
      ]
    },
    {
      name: "BRACU Course Planner",
      url: "https://bracucourseplanner.com",
      description: "Plan your courses for the entire program",
      features: [
        "Prerequisite visualization",
        "Credit hour calculation",
        "Semester-wise planning",
        "Grade tracking"
      ]
    },
    // Add more tools here
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pre-Advising Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              
              <h4 className="font-medium mb-2">Key Features:</h4>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                {tool.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Visit Tool
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">How to Use Pre-Advising Tools</h2>
        <div className="prose max-w-none">
          <ol className="list-decimal list-inside space-y-4">
            <li>
              <span className="font-medium">Plan Early:</span>
              <p className="ml-6 mt-2">
                Start planning your courses at least a week before advising begins.
                This gives you time to explore different combinations and consult with advisors.
              </p>
            </li>
            <li>
              <span className="font-medium">Check Prerequisites:</span>
              <p className="ml-6 mt-2">
                Ensure you've completed all prerequisites for the courses you want to take.
                Use the course planner to visualize prerequisites.
              </p>
            </li>
            <li>
              <span className="font-medium">Generate Multiple Routines:</span>
              <p className="ml-6 mt-2">
                Create several possible routines as backup options in case your preferred sections fill up during advising.
              </p>
            </li>
            {/* Add more steps */}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PreAdvisingTools; 