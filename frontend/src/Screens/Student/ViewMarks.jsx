import React from "react";

const ViewMarks = () => {
  return (
    <div>
      <h2>Marks</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Subject</th>
            <th className="px-4 py-2 border">Marks Obtained</th>
            <th className="px-4 py-2 border">Max Marks</th>
            <th className="px-4 py-2 border">Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">Mathematics</td>
            <td className="px-4 py-2 border">85</td>
            <td className="px-4 py-2 border">100</td>
            <td className="px-4 py-2 border">B</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Computer Science</td>
            <td className="px-4 py-2 border">90</td>
            <td className="px-4 py-2 border">100</td>
            <td className="px-4 py-2 border">A</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewMarks;
