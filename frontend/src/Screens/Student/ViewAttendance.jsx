import React from "react";

const ViewAttendance = () => {
  return (
    <div>
      <h2>Attendance</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Subject</th>
            <th className="px-4 py-2 border">Total Classes</th>
            <th className="px-4 py-2 border">Classes Attended</th>
            <th className="px-4 py-2 border">Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">Mathematics</td>
            <td className="px-4 py-2 border">30</td>
            <td className="px-4 py-2 border">28</td>
            <td className="px-4 py-2 border">93.33%</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Computer Science</td>
            <td className="px-4 py-2 border">30</td>
            <td className="px-4 py-2 border">30</td>
            <td className="px-4 py-2 border">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewAttendance;
