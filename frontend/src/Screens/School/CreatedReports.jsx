// import React, { useEffect, useState } from "react";
// import { supabase } from "../../../supabase-client";
// import { CircularProgress } from "@mui/material";
// import JSZip from "jszip";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";

// function CreatedReports() {
//   const [reports, setReports] = useState([]);
//   const [selectedReports, setSelectedReports] = useState([]);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [currentReport, setCurrentReport] = useState(null);
//   const [pdfLoadError, setPdfLoadError] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [Month, setMonth] = useState(1);
//   const [Year, setYear] = useState(2024);
//   const [Sender, setSender] = useState(0);
//   const Receiver= "a8d80b7b-42fe-4998-95df-4600ac69a2da";
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "info",
//   });
//   const monthNames = [
//     "January", "February", "March", "April",
//     "May", "June", "July", "August",
//     "September", "October", "November", "December"
//   ];

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });
//   useEffect(() => {
//     const fetchUser = async () => {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();
//       if (error) {
//         console.error("Error fetching user:", error.message);
//         return;
//       }
//       if (user) {
//         setSender(user.id); // Set Sender to user's UUID
//       }
//     };

//     fetchUser();
//   }, []);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase.from("SavedReports").select("*");
//       if (error) throw error;
//       setReports(data);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       setAlert({
//         open: true,
//         message: "Error fetching reports: " + error.message,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCheckboxChange = (reportId, e) => {
//     e.stopPropagation();
//     setSelectedReports((prev) =>
//       prev.includes(reportId)
//         ? prev.filter((id) => id !== reportId)
//         : [...prev, reportId]
//     );
//   };

//   const handleCreateZip = async () => {
//     if (selectedReports.length === 0) return;

//     setIsLoading(true);
//     try {
//       const zip = new JSZip();
//       const selected = reports.filter((report) =>
//         selectedReports.includes(report.id)
//       );

//       for (let report of selected) {
//         try {
//           const response = await fetch(report.FilePath);
//           if (!response.ok) continue;
//           const blob = await response.blob();
//           zip.file(report.FileName || `report-${report.id}.pdf`, blob);
//         } catch (error) {
//           console.error(`Error processing ${report.ReportName}:`, error);
//         }
//       }

//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const fileName = `Reports-${Month}-${Year}-${Sender}-${Date.now()}.zip`;

//       // Create download link
//       const url = URL.createObjectURL(zipBlob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);

//       setSelectedReports([]);
//       setAlert({
//         open: true,
//         message: "ZIP file downloaded successfully!",
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Error creating ZIP:", error);
//       setAlert({
//         open: true,
//         message: "Failed to create ZIP file: " + error.message,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRowClick = async (report) => {
//     setIsLoading(true);
//     setPdfLoadError(false);
//     try {
//       setPreviewUrl(report.FilePath);
//       setCurrentReport(report);
//       setIsPreviewOpen(true);
//     } catch (error) {
//       console.error("Error opening preview:", error);
//       setPdfLoadError(true);
//       setAlert({
//         open: true,
//         message: "Error opening PDF preview: " + error.message,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const closePreview = () => {
//     setIsPreviewOpen(false);
//     setPreviewUrl(null);
//     setCurrentReport(null);
//     setPdfLoadError(false);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   const saveToDatabase = async (fileName, filePath) => {
//     try {
//       const selected = reports.filter((report) =>
//         selectedReports.includes(report.id)
//       );

//       // We'll take the month/year from the first selected report
//       // const firstReport = selected[0];
//       // if (!firstReport) throw new Error("No reports selected");

//       console.log("i am here");
//       // Check if a report for this month/year already exists
//       const { data: existingReport, error: fetchError } = await supabase
//         .from("SendedReports")
//         .select("*")
//         .eq("Month", Month)
//         .eq("Year", Year)
//         .eq("Sender", Sender)
//         .maybeSingle();

//       if (fetchError) throw fetchError;
//       if (existingReport) {
//         throw new Error(
//           "A report for this month/year is already sent to the admin"
//         );
//       }

//       // Save to database
//       const { error: dbError } = await supabase.from("SendedReports").insert({
//         Month: Month,
//         Year: Year,
//         FileName: fileName,
//         FilePath: filePath,
//         Sender: Sender,
//         Receiver: Receiver,
//         // ReportName: `Combined Report - ${Month}/${Year}`,

//         created_at: new Date().toISOString(),
//       });

//       if (dbError) throw dbError;

//       return true;
//     } catch (error) {
//       console.error("Error saving to database:", error);
//       throw error;
//     }
//   };

//   const handleUploadZipToAdmin = async () => {
//     if (selectedReports.length === 0) {
//       setAlert({
//         open: true,
//         message: "Please select at least one report.",
//         severity: "warning",
//       });
//       return;
//     }

//     setIsLoading(true);

//     console.log("i  amhere ............");
//     try {
//       const zip = new JSZip();
//       const selected = reports.filter((report) =>
//         selectedReports.includes(report.id)
//       );
//       console.log("i  amhere ............2");

//       for (let report of selected) {
//         try {
//           const response = await fetch(report.FilePath);
//           if (!response.ok) continue;
//           const blob = await response.blob();
//           zip.file(report.FileName || `report-${report.id}.pdf`, blob);
//         } catch (error) {
//           console.error(`Error processing ${report.ReportName}:`, error);
//         }
//       }
//       console.log("i  amhere ............3");

//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const fileName = `Reports-${Month}-${Year}-${Sender}-${Date.now()}.zip`;

//       // Upload to storage
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from("zipreports")
//         .upload(`${fileName}`, zipBlob, {
//           contentType: "application/zip",
//           // upsert: true,
//         });

//       if (uploadError) {
//         throw uploadError;
//       }

//       // Get public URL
//       const { data: urlData } = supabase.storage
//         .from("zipreports")
//         .getPublicUrl(fileName);

//       const publicUrl = urlData?.publicUrl || "";

//       // Save to database
//       await saveToDatabase(fileName, publicUrl);

//       setAlert({
//         open: true,
//         message: "File send Suceefully",
//         severity: "success",
//       });

//       setSelectedReports([]);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setAlert({
//         open: true,
//         message: `Failed to upload ZIP file: ${error.message}`,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDownload = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!previewUrl || !currentReport?.FileName) return;

//     try {
//       const response = await fetch(previewUrl, {
//         mode: "cors",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch the file");
//       }

//       const blob = await response.blob();
//       const downloadUrl = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = downloadUrl;
//       a.download = currentReport.FileName || "report.pdf";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(downloadUrl);

//       setAlert({
//         open: true,
//         message: "Report downloaded successfully!",
//         severity: "success",
//       });

//       closePreview();
//     } catch (error) {
//       console.error("Error downloading the file:", error);
//       setAlert({
//         open: true,
//         message: "Failed to download report: " + error.message,
//         severity: "error",
//       });
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Created Reports</h2>

//       {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <CircularProgress size={60} thickness={5} />
//         </div>
//       )}

//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//       >
//         <Alert onClose={handleCloseAlert} severity={alert.severity}>
//           {alert.message}
//         </Alert>
//       </Snackbar>

//       {selectedReports.length > 7 && (
//         <div>
//           <button
//             onClick={handleCreateZip}
//             disabled={isLoading}
//             className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             {isLoading
//               ? "Processing..."
//               : `Download ZIP of Selected (${selectedReports.length})`}
//           </button>

//           <button
//             onClick={handleUploadZipToAdmin}
//             disabled={isLoading}
//             className="mb-4 ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
//           >
//             {isLoading ? "Uploading..." : "Send Zip File to an Admin"}
//           </button>
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border-collapse border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-2 py-2">
//                 <input
//                   type="checkbox"
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedReports(reports.map((r) => r.id));
//                     } else {
//                       setSelectedReports([]);
//                     }
//                   }}
//                   checked={
//                     reports.length > 0 &&
//                     selectedReports.length === reports.length
//                   }
//                   disabled={isLoading}
//                 />
//               </th>
//               <th className="border px-4 py-2">Report Name</th>
//               <th className="border px-4 py-2">Month</th>
//               <th className="border px-4 py-2">Year</th>
//               <th className="border px-4 py-2">Records</th>
//               <th className="border px-4 py-2">Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reports.length > 0 ? (
//               reports.map((report) => (
//                 <tr
//                   key={report.id}
//                   onClick={() => !isLoading && handleRowClick(report)}
//                   className={`hover:bg-gray-50 ${
//                     !isLoading ? "cursor-pointer" : "cursor-not-allowed"
//                   }`}
//                 >
//                   <td
//                     className="border px-2 py-2 text-center"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedReports.includes(report.id)}
//                       onChange={(e) => handleCheckboxChange(report.id, e)}
//                       disabled={isLoading}
//                     />
//                   </td>
//                   <td className="border px-4 py-2">{report.ReportName}</td>
//                   {/* <td className="border px-4 py-2">{report.Month}</td> */}
//                   <td className="border px-4 py-2">{monthNames[report.Month]}</td>
//                   <td className="border px-4 py-2">{report.Year}</td>
//                   <td className="border px-4 py-2">{report.RecordCount}</td>
//                   <td className="border px-4 py-2">
//                     {formatDate(report.created_at)}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center py-4 text-gray-500">
//                   {isLoading ? "Loading reports..." : "No reports found."}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PDF Preview Modal */}
//       {isPreviewOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h3 className="text-lg font-semibold">
//                 {currentReport?.ReportName || "Report Preview"}
//               </h3>
//               <button
//                 onClick={closePreview}
//                 className="text-gray-500 hover:text-gray-700 p-1"
//                 aria-label="Close preview"
//                 disabled={isLoading}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className="flex-grow overflow-hidden relative">
//               {isLoading ? (
//                 <div className="flex items-center justify-center h-full">
//                   <p className="text-gray-700">Loading PDF...</p>
//                 </div>
//               ) : pdfLoadError ? (
//                 <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                   <p className="text-red-500 mb-4">
//                     Could not display the PDF preview.
//                   </p>
//                   <div className="flex space-x-2">
//                     <a
//                       href={previewUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                       Open in New Tab
//                     </a>
//                     <button
//                       onClick={handleDownload}
//                       className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                     >
//                       Download
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <iframe
//                   src={`${previewUrl}#view=fitH`}
//                   className="w-full h-full min-h-[60vh]"
//                   frameBorder="0"
//                   title="PDF Preview"
//                   onError={() => setPdfLoadError(true)}
//                   onLoad={() => setIsLoading(false)}
//                 />
//               )}
//             </div>

//             <div className="p-4 border-t flex justify-end space-x-2">
//               <a
//                 href={previewUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Open in New Tab
//               </a>
//               <button
//                 onClick={handleDownload}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//               >
//                 Download
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreatedReports;

import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { CircularProgress } from "@mui/material";
import JSZip from "jszip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function CreatedReports() {
  const [reports, setReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Month, setMonth] = useState(null);
  const [Year, setYear] = useState(null);
  const [Sender, setSender] = useState(0);
  const Receiver = "a8d80b7b-42fe-4998-95df-4600ac69a2da";
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
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      if (user) {
        setSender(user.id); // Set Sender to user's UUID
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("SavedReports").select("*");
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

  const handleCheckboxChange = (reportId, e) => {
    e.stopPropagation();
    setSelectedReports((prev) => {
      const newSelected = prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId];

      // When selection changes, update Month and Year based on selected reports
      if (newSelected.length > 0) {
        const selected = reports.filter((report) =>
          newSelected.includes(report.id)
        );
        const firstMonth = selected[0].Month;
        const firstYear = selected[0].Year;

        // Check if all selected reports have the same month and year
        const allSame = selected.every(
          (report) => report.Month === firstMonth && report.Year === firstYear
        );

        if (allSame) {
          setMonth(firstMonth);
          setYear(firstYear);
        } else {
          setMonth(null);
          setYear(null);
        }
      } else {
        setMonth(null);
        setYear(null);
      }

      return newSelected;
    });
  };
  const validateSelection = () => {
    if (selectedReports.length === 0) {
      setAlert({
        open: true,
        message: "Please select at least one report.",
        severity: "warning",
      });
      return false;
    }

    const selected = reports.filter((report) =>
      selectedReports.includes(report.id)
    );

    // Check if all selected reports have the same month and year
    const firstMonth = selected[0].Month;
    const firstYear = selected[0].Year;
    const allSame = selected.every(
      (report) => report.Month === firstMonth && report.Year === firstYear
    );

    if (!allSame) {
      setAlert({
        open: true,
        message: "All selected reports must be from the same month and year.",
        severity: "error",
      });
      return false;
    }

    if (Month === null || Year === null) {
      setAlert({
        open: true,
        message: "Month and Year must be set before sending.",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  const handleCreateZip = async () => {
    if (selectedReports.length === 0) return;

    setIsLoading(true);
    try {
      const zip = new JSZip();
      const selected = reports.filter((report) =>
        selectedReports.includes(report.id)
      );

      for (let report of selected) {
        try {
          const response = await fetch(report.FilePath);
          if (!response.ok) continue;
          const blob = await response.blob();
          zip.file(report.FileName || `report-${report.id}.pdf`, blob);
        } catch (error) {
          console.error(`Error processing ${report.ReportName}:`, error);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const fileName = `Reports-${Month}-${Year}-${Sender}-${Date.now()}.zip`;

      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSelectedReports([]);
      setAlert({
        open: true,
        message: "ZIP file downloaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating ZIP:", error);
      setAlert({
        open: true,
        message: "Failed to create ZIP file: " + error.message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = async (report) => {
    setIsLoading(true);
    setPdfLoadError(false);
    try {
      setPreviewUrl(report.FilePath);
      setCurrentReport(report);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error opening preview:", error);
      setPdfLoadError(true);
      setAlert({
        open: true,
        message: "Error opening PDF preview: " + error.message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setCurrentReport(null);
    setPdfLoadError(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const saveToDatabase = async (fileName, filePath) => {
    try {
      const selected = reports.filter((report) =>
        selectedReports.includes(report.id)
      );

      // We'll take the month/year from the first selected report
      // const firstReport = selected[0];
      // if (!firstReport) throw new Error("No reports selected");

      console.log("i am here");
      // Check if a report for this month/year already exists
      const { data: existingReport, error: fetchError } = await supabase
        .from("SendedReports")
        .select("*")
        .eq("Month", Month)
        .eq("Year", Year)
        .eq("Sender", Sender)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existingReport) {
        throw new Error(
          "A report for this month/year is already sent to the admin"
        );
      }

      // Save to database
      const { error: dbError } = await supabase.from("SendedReports").insert({
        Month: Month,
        Year: Year,
        FileName: fileName,
        FilePath: filePath,
        Sender: Sender,
        Receiver: Receiver,
        // ReportName: `Combined Report - ${Month}/${Year}`,

        created_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error("Error saving to database:", error);
      throw error;
    }
  };

  const handleUploadZipToAdmin = async () => {
    if (!validateSelection()) return;

    setIsLoading(true);

    console.log("i  amhere ............");
    try {
      const zip = new JSZip();
      const selected = reports.filter((report) =>
        selectedReports.includes(report.id)
      );
      console.log("i  amhere ............2");

      for (let report of selected) {
        try {
          const response = await fetch(report.FilePath);
          if (!response.ok) continue;
          const blob = await response.blob();
          zip.file(report.FileName || `report-${report.id}.pdf`, blob);
        } catch (error) {
          console.error(`Error processing ${report.ReportName}:`, error);
        }
      }
      console.log("i  amhere ............3");

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const fileName = `Reports-${Month}-${Year}-${Sender}-${Date.now()}.zip`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("zipreports")
        .upload(`${fileName}`, zipBlob, {
          contentType: "application/zip",
          // upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("zipreports")
        .getPublicUrl(fileName);

      const publicUrl = urlData?.publicUrl || "";

      // Save to database
      await saveToDatabase(fileName, publicUrl);

      setAlert({
        open: true,
        message: "File send Suceefully",
        severity: "success",
      });

      setSelectedReports([]);
    } catch (error) {
      console.error("Upload failed:", error);
      setAlert({
        open: true,
        message: `Failed to upload ZIP file: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!previewUrl || !currentReport?.FileName) return;

    try {
      const response = await fetch(previewUrl, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = currentReport.FileName || "report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setAlert({
        open: true,
        message: "Report downloaded successfully!",
        severity: "success",
      });

      closePreview();
    } catch (error) {
      console.error("Error downloading the file:", error);
      setAlert({
        open: true,
        message: "Failed to download report: " + error.message,
        severity: "error",
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Created Reports</h2>

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

      {selectedReports.length > 7 && (
        <div className="mb-4">
          <div className="mb-2">
            <span className="font-medium">Selected Month: </span>
            {Month !== null
              ? monthNames[Month]
              : "Not set (select reports from same month)"}
          </div>
          <div className="mb-2">
            <span className="font-medium">Selected Year: </span>
            {Year !== null ? Year : "Not set (select reports from same year)"}
          </div>

          <button
            onClick={handleCreateZip}
            disabled={isLoading}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading
              ? "Processing..."
              : `Download ZIP of Selected (${selectedReports.length})`}
          </button>

          <button
            onClick={handleUploadZipToAdmin}
            disabled={isLoading}
            className="mb-4 ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            {isLoading ? "Uploading..." : "Send Zip File to an Admin"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReports(reports.map((r) => r.id));
                    } else {
                      setSelectedReports([]);
                    }
                  }}
                  checked={
                    reports.length > 0 &&
                    selectedReports.length === reports.length
                  }
                  disabled={isLoading}
                />
              </th>
              <th className="border px-4 py-2">Report Name</th>
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Records</th>
              <th className="border px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => !isLoading && handleRowClick(report)}
                  className={`hover:bg-gray-50 ${
                    !isLoading ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  <td
                    className="border px-2 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={(e) => handleCheckboxChange(report.id, e)}
                      disabled={isLoading}
                    />
                  </td>
                  <td className="border px-4 py-2">{report.ReportName}</td>
                  {/* <td className="border px-4 py-2">{report.Month}</td> */}
                  <td className="border px-4 py-2">
                    {monthNames[report.Month]}
                  </td>
                  <td className="border px-4 py-2">{report.Year}</td>
                  <td className="border px-4 py-2">{report.RecordCount}</td>
                  <td className="border px-4 py-2">
                    {formatDate(report.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  {isLoading ? "Loading reports..." : "No reports found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PDF Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {currentReport?.ReportName || "Report Preview"}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="Close preview"
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-grow overflow-hidden relative">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-700">Loading PDF...</p>
                </div>
              ) : pdfLoadError ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <p className="text-red-500 mb-4">
                    Could not display the PDF preview.
                  </p>
                  <div className="flex space-x-2">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Open in New Tab
                    </a>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`${previewUrl}#view=fitH`}
                  className="w-full h-full min-h-[60vh]"
                  frameBorder="0"
                  title="PDF Preview"
                  onError={() => setPdfLoadError(true)}
                  onLoad={() => setIsLoading(false)}
                />
              )}
            </div>

            <div className="p-4 border-t flex justify-end space-x-2">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Open in New Tab
              </a>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatedReports;
