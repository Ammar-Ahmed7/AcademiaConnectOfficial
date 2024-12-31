import React from "react";

const ViewQuizzes = () => {
  return (
    <div>
      <h2>Quizzes</h2>
      <table>
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Quiz 1</td>
            <td>2024-12-15</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>Quiz 2</td>
            <td>2024-12-25</td>
            <td>Not Taken</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewQuizzes;
