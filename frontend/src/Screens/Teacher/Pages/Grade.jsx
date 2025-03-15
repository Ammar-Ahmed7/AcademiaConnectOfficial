// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, TextField, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const AssignmentQuizPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([
    { rollNo: "101", name: "John Doe", marks: "" },
    { rollNo: "102", name: "Jane Smith", marks: "" },
  ]);
  const [formData, setFormData] = useState({ name: "", subject: "", description: "", file: null });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAssignments([...assignments, { ...formData, id: assignments.length + 1 }]);
    setFormData({ name: "", subject: "", description: "", file: null });
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleMarksChange = (index, value) => {
    const updatedStudents = [...students];
    updatedStudents[index].marks = value;
    setStudents(updatedStudents);
  };

  const handleMarksSubmit = () => {
    console.log("Marks submitted:", students);
    alert("Marks saved successfully!");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "20px" , marginLeft:'500px'}}>
        <Button variant="contained" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>Back</Button>
        
        {!selectedAssignment ? (
          <>
            <Typography variant="h5">Create Assignment/Quiz</Typography>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
              <TextField label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
              <TextField label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} />
              <input type="file" onChange={handleFileChange} />
              <Button type="submit" variant="contained">Create</Button>
            </form>
            
            <Typography variant="h5" style={{ marginTop: "20px" }}>Assignments/Quizzes</Typography>
            {assignments.map((assignment) => (
              <Paper key={assignment.id} style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }} onClick={() => handleAssignmentClick(assignment)}>
                {assignment.name} - {assignment.subject}
              </Paper>
            ))}
          </>
        ) : (
          <>
            <Typography variant="h5">{selectedAssignment.name} - {selectedAssignment.subject}</Typography>
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Marks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.rollNo}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={student.marks}
                          onChange={(e) => handleMarksChange(index, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={handleMarksSubmit} style={{ marginTop: "20px" }}>Submit Marks</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentQuizPage;
