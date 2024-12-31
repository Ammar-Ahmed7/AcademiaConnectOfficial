import React from "react";

const ViewAssignments = () => {
  return (
    <div>
      <h2>Assignments</h2>
      <table>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Assignment 1</td>
            <td>2024-12-20</td>
            <td>Not Submitted</td>
          </tr>
          <tr>
            <td>Assignment 2</td>
            <td>2024-12-30</td>
            <td>Submitted</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewAssignments;
