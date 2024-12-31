import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Button
} from '@mui/material';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Using dummy data instead of fetching from an API
    setReports(dummyReports);
  }, []);

  const dummyReports = [
    {
      _id: "1",
      schoolName: "ABC School",
      status: "Approved"
    },
    {
      _id: "2",
      schoolName: "XYZ School",
      status: "Pending"
    },
    {
      _id: "3",
      schoolName: "Sunrise Academy",
      status: "Completed"
    },
    {
      _id: "4",
      schoolName: "Greenfield International",
      status: "Approved"
    },
    {
      _id: "5",
      schoolName: "Mountain High School",
      status: "In Review"
    }
  ];

  const handleDownload = (reportId) => {
    // Here, you would trigger the download logic (e.g., fetching a report file)
    // Example:
    console.log(`Downloading report with ID: ${reportId}`);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5" p={4}>
      <Card sx={{ width: '100%', maxWidth: 1200, padding: 4, boxShadow: 6, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 3 }}>
            All Reports
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e0e0e0' }}>
                    <TableCell><strong>Report ID</strong></TableCell>
                    <TableCell><strong>School Name</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Download</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>{report._id}</TableCell>
                      <TableCell>{report.schoolName}</TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDownload(report._id)}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports;
