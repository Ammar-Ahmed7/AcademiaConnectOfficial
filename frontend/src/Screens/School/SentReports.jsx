import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SentReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("SendedReports").select("*");
      if (error) throw error;
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setAlert({
        open: true,
        message: "Error fetching reports: " + error.message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getMonthName = (monthIndex) => {
    return monthNames[monthIndex] || "Unknown Month";
  };

  const handleDownload = async (report) => {
    try {
      setIsLoading(true);

      if (!report.FilePath) {
        throw new Error("No file path available for download");
      }

      // Check if the URL is valid
      if (!report.FilePath.startsWith("http")) {
        throw new Error("Invalid file URL");
      }

      // Create a hidden anchor tag for direct download
      const a = document.createElement("a");
      a.href = report.FilePath;
      a.target = "_blank"; // Open in new tab as fallback
      a.rel = "noopener noreferrer";

      // Set an appropriate filename
      const defaultName = `report_${getMonthName(report.Month)}_${
        report.Year
      }.zip`;
      a.download = report.FileName || defaultName;

      // Trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Fallback method if the direct download doesn't work
      setTimeout(async () => {
        try {
          const response = await fetch(report.FilePath, {
            mode: "cors",
            cache: "no-cache",
          });

          if (!response.ok) throw new Error("Failed to fetch file");

          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          const fallbackLink = document.createElement("a");
          fallbackLink.href = blobUrl;
          fallbackLink.download = a.download;
          document.body.appendChild(fallbackLink);
          fallbackLink.click();
          document.body.removeChild(fallbackLink);
          URL.revokeObjectURL(blobUrl);

          setAlert({
            open: true,
            message: "Report downloaded successfully!",
            severity: "success",
          });
        } catch (fallbackError) {
          console.error("Fallback download failed:", fallbackError);
          setAlert({
            open: true,
            message: `Download failed. Try opening in new tab.`,
            severity: "error",
          });
          // Open in new tab as last resort
          window.open(report.FilePath, "_blank");
        }
      }, 2000); // Wait 2 seconds before trying fallback
    } catch (error) {
      console.error("Download error:", error);
      setAlert({
        open: true,
        message: `Download failed: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Sent Reports</h2>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CircularProgress size={60} thickness={5} />
        </div>
      )}

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Sent At</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    {getMonthName(report.Month)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {report.Year}
                  </td>
                  <td className="border px-4 py-2">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDownload(report)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      disabled={isLoading}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  {isLoading ? "Loading reports..." : "No reports found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SentReports;
