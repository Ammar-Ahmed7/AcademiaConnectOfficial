// import { useState, useEffect } from "react";
// import { supabase } from "../../../supabase-client";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";

// const ReportStudentAvailTransport = ({ month, year }) => {
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generatingPDF, setGeneratingPDF] = useState(false);
//   const [savingToDb, setSavingToDb] = useState(false);
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });

//   const showAlert = (message, severity) => {
//     setAlert({ open: true, message, severity });
//   };

//   const handleCloseAlert = () => setAlert({ ...alert, open: false });

//   const fetchTransportData = async () => {
//     setLoading(true);
//     try {
//       // Fetch all students using transport
//       const { data: students, error } = await supabase
//         .from("students")
//         .select("admission_class, quota")
//         .eq("transport", true) // Assuming you have this field
//         .not("admission_class", "is", null);

//       if (error) throw error;

//       // Initialize data structure for classes II-XII
//       const classData = {};
//       for (let i = 2; i <= 12; i++) {
//         classData[i] = {
//           sections: new Set(),
//           workers: 0,
//           private: 0,
//           total: 0,
//         };
//       }

//       // Process students
//       students.forEach((student) => {
//         const classMatch = student.admission_class.match(/^Class (\d+)/i);
//         if (!classMatch) return;

//         const classNum = parseInt(classMatch[1]);
//         if (classNum < 2 || classNum > 12) return;

//         // Count sections
//         classData[classNum].sections.add(student.admission_class);

//         // Count quota types
//         if (student.quota?.toLowerCase() === "private") {
//           classData[classNum].private++;
//         } else {
//           classData[classNum].workers++;
//         }
//         classData[classNum].total++;
//       });

//       // Prepare report data
//       const reportData = [
//         ...Array.from({ length: 11 }, (_, i) =>
//           createClassRow(i + 2, classData[i + 2])
//         ),
//         createTotalRow(classData),
//       ];

//       setReportData(reportData);
//     } catch (err) {
//       console.error("Error fetching transport data:", err);
//       showAlert("Failed to fetch data: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createClassRow = (classNum, data) => {
//     return {
//       srNo: classNum - 1, // Starts from 1 for class II
//       className: classNum.toString(), // Using numbers instead of Roman
//       sections: data?.sections.size || 0,
//       workers: data?.workers || 0,
//       private: data?.private || 0,
//       total: data?.total || 0,
//     };
//   };

//   const createTotalRow = (classData) => {
//     const totals = {
//       sections: 0,
//       workers: 0,
//       private: 0,
//       total: 0,
//     };

//     Object.values(classData).forEach((data) => {
//       totals.sections += data.sections.size;
//       totals.workers += data.workers;
//       totals.private += data.private;
//       totals.total += data.total;
//     });

//     return {
//       srNo: "",
//       className: "Total:",
//       sections: totals.sections,
//       workers: totals.workers,
//       private: totals.private,
//       total: totals.total,
//     };
//   };

//   const generatePDFDocument = async () => {
//     try {
//       const jsPDF = (await import("jspdf")).default;
//       const autoTable = (await import("jspdf-autotable")).default;

//       const pdf = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a4",
//       });

//       pdf.setFontSize(16);
//       pdf.text(
//         "WORKERS WELFARE HIGHER SECONDARY SCHOOL FOR BOYS LINO RE",
//         pdf.internal.pageSize.getWidth() / 2,
//         10,
//         { align: "center" }
//       );

//       pdf.text(
//         "NO. OF STUDENTS AVAILING TRANSPORT FACILITY",
//         pdf.internal.pageSize.getWidth() / 2,
//         17,
//         { align: "center" }
//       );

//       pdf.text(
//         `${new Date(year, month - 1).toLocaleString("default", {
//           month: "short",
//         })}-${year.toString().slice(-2)}`,
//         pdf.internal.pageSize.getWidth() / 2,
//         24,
//         { align: "center" }
//       );

//       const currentDate = new Date().toLocaleDateString();
//       pdf.setFontSize(10);
//       pdf.text(
//         `Generated on: ${currentDate}`,
//         pdf.internal.pageSize.getWidth() - 15,
//         10,
//         { align: "right" }
//       );

//       autoTable(pdf, {
//         head: [
//           [
//             "Sr.NO",
//             "Name of class",
//             "No of sections",
//             "Workers",
//             "Private",
//             "Total",
//           ],
//         ],
//         body: reportData.map((row) => [
//           row.srNo,
//           row.className,
//           row.sections,
//           row.workers,
//           row.private,
//           row.total,
//         ]),
//         startY: 30,
//         theme: "grid",
//         headStyles: {
//           fillColor: [52, 152, 219],
//           textColor: 255,
//           fontStyle: "bold",
//         },
//         alternateRowStyles: {
//           fillColor: [240, 240, 240],
//         },
//         columnStyles: {
//           0: { cellWidth: 15 },
//           1: { cellWidth: 25 },
//           2: { cellWidth: 20 },
//           3: { cellWidth: 15 },
//           4: { cellWidth: 15 },
//           5: { cellWidth: 15 },
//         },
//         margin: { top: 30 },
//         didDrawPage: (data) => {
//           pdf.setFontSize(8);
//           pdf.text(
//             `Page ${pdf.internal.getNumberOfPages()}`,
//             pdf.internal.pageSize.getWidth() / 2,
//             pdf.internal.pageSize.getHeight() - 10,
//             { align: "center" }
//           );
//         },
//       });

//       return { pdf, currentDate };
//     } catch (err) {
//       console.error("Error generating PDF:", err);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchTransportData();
//   }, []);

//   const generatePDF = async () => {
//     if (!window || !document) return;
//     setGeneratingPDF(true);

//     try {
//       const { pdf } = await generatePDFDocument();
//       pdf.save("student_transport_report.pdf");
//       showAlert("PDF generated successfully!", "success");
//     } catch (err) {
//       console.error("Error generating PDF:", err);
//       showAlert("Failed to generate PDF: " + err.message, "error");
//     } finally {
//       setGeneratingPDF(false);
//     }
//   };

//   const savePDFToDatabase = async () => {
//     if (!window || !document) return;
//     setSavingToDb(true);

//     try {
//       const { data: existingReport, error: fetchError } = await supabase
//         .from("SavedReports")
//         .select("*")
//         .eq("ReportName", "Student Transport Report")
//         .eq("Month", month)
//         .eq("Year", year)
//         .maybeSingle();

//       if (fetchError) throw fetchError;
//       if (existingReport) {
//         throw new Error("A report for this month/year already exists");
//       }
//       const { pdf, currentDate } = await generatePDFDocument();
//       const pdfBlob = pdf.output("blob");
//       const fileName = `student_transport_${month}_${year}.pdf`;
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from("reports")
//         .upload(fileName, pdfBlob);

//       if (uploadError) throw uploadError;

//       const { data: urlData } = supabase.storage
//         .from("reports")
//         .getPublicUrl(fileName);

//       const publicUrl = urlData?.publicUrl || "";

//       const { error: dbError } = await supabase.from("SavedReports").insert({
//         Month: month.toString(),
//         Year: parseInt(year),
//         ReportName: "Student Transport Report",
//         FileName: fileName,
//         created_at: new Date().toISOString(),
//         FilePath: publicUrl,
//         ReportType: "student_transport",
//         RecordCount: reportData.length,
//       });

//       if (dbError) throw dbError;

//       showAlert("Report successfully saved to database!", "success");
//     } catch (err) {
//       console.error("Error saving PDF to database:", err);
//       showAlert("Failed to save to database: " + err.message, "error");
//     } finally {
//       setSavingToDb(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center p-5 text-lg">Loading report...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-5 m-5 font-sans">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 pb-3 border-b border-gray-200">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             WORKERS WELFARE HIGHER SECONDARY SCHOOL FOR BOYS LINO RE
//           </h1>
//           <h2 className="text-xl font-medium text-gray-700 mt-1">
//             NO. OF STUDENTS AVAILING TRANSPORT FACILITY
//           </h2>
//           <h3 className="text-lg text-gray-600 mt-1">
//             {new Date(year, month - 1).toLocaleString("default", {
//               month: "long",
//             })}{" "}
//             {year}
//           </h3>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-3 md:mt-0">
//           <button
//             onClick={savePDFToDatabase}
//             className={`px-4 py-2 rounded text-white font-medium ${
//               savingToDb || reportData.length === 0
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={savingToDb || reportData.length === 0}
//           >
//             {savingToDb ? "Saving..." : "Save to Database"}
//           </button>
//           <button
//             onClick={generatePDF}
//             className={`px-4 py-2 rounded text-white font-medium ${
//               generatingPDF || reportData.length === 0
//                 ? "bg-green-400 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             }`}
//             disabled={generatingPDF || reportData.length === 0}
//           >
//             {generatingPDF ? "Generating..." : "Download PDF"}
//           </button>
//         </div>
//       </div>

//       <div className="w-full">
//         {reportData.length > 0 ? (
//           <div className="overflow-x-auto border border-gray-200 rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-500">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     Sr.NO
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     Name of class
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     No of sections
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     Workers
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     Private
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                     Total
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reportData.map((row, index) => (
//                   <tr
//                     key={index}
//                     className={
//                       row.className === "Total:"
//                         ? "font-bold bg-gray-100"
//                         : "hover:bg-gray-50"
//                     }
//                   >
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
//                       {row.srNo}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
//                       {row.className}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
//                       {row.sections}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
//                       {row.workers}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
//                       {row.private}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
//                       {row.total}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center p-5 text-gray-600">
//             No transport data found.
//           </div>
//         )}
//       </div>

//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//       >
//         <Alert onClose={handleCloseAlert} severity={alert.severity}>
//           {alert.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default ReportStudentAvailTransport;

import { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReportStudentAvailTransport = ({ month, year }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [savingToDb, setSavingToDb] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  // Helper function to convert number to Roman numeral
  const toRoman = (num) => {
    const romanNumerals = [
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];
    return romanNumerals[num] || num.toString();
  };

  // const fetchTransportData = async () => {
  //   setLoading(true);
  //   try {
  //     // Fetch all students using transport
  //     const { data: students, error } = await supabase
  //       .from("students")
  //       .select("admission_class, quota")
  //       .eq("transport", true)
  //       .not("admission_class", "is", null);

  //     if (error) throw error;

  //     // Initialize data structure for classes II-XII
  //     const classData = {};
  //     for (let i = 1; i <= 12; i++) {
  //       classData[i] = {
  //         sections: new Set(),
  //         workers: 0,
  //         private: 0,
  //         total: 0,
  //       };
  //     }

  //     // Process students
  //     students.forEach((student) => {
  //       const classMatch = student.admission_class.match(/^Class (\d+)/i);
  //       if (!classMatch) return;

  //       const classNum = parseInt(classMatch[1]);
  //       if (classNum < 1 || classNum > 12) return;

  //       // Count sections
  //       classData[classNum].sections.add(student.admission_class);

  //       // Count quota types
  //       if (student.quota?.toLowerCase() === "private") {
  //         classData[classNum].private++;
  //       } else {
  //         classData[classNum].workers++;
  //       }
  //       classData[classNum].total++;
  //     });

  //     // Prepare report data with Roman numerals and serial numbers starting from 1
  //     const reportData = [
  //       ...Array.from({ length: 12 }, (_, i) => ({
  //         srNo: i + 1, // Serial numbers start from 1
  //         className: toRoman(i + 1),
  //         sections: classData[i + 1]?.sections.size || 0,
  //         workers: classData[i + 1]?.workers || 0,
  //         private: classData[i + 1]?.private || 0,
  //         total: classData[i + 1]?.total || 0,
  //       })),
  //       {
  //         srNo: "",
  //         className: "Total:",
  //         sections: Object.values(classData).reduce(
  //           (sum, data) => sum + data.sections.size,
  //           0
  //         ),
  //         workers: Object.values(classData).reduce(
  //           (sum, data) => sum + data.workers,
  //           0
  //         ),
  //         private: Object.values(classData).reduce(
  //           (sum, data) => sum + data.private,
  //           0
  //         ),
  //         total: Object.values(classData).reduce(
  //           (sum, data) => sum + data.total,
  //           0
  //         ),
  //       },
  //     ];

  //     setReportData(reportData);
  //   } catch (err) {
  //     console.error("Error fetching transport data:", err);
  //     showAlert("Failed to fetch data: " + err.message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTransportData = async () => {
    setLoading(true);
    try {
      // Fetch all students (for sections count)
      const { data: allStudents, error: allStudentsError } = await supabase
        .from("students")
        .select("admission_class")
        .not("admission_class", "is", null);

      if (allStudentsError) throw allStudentsError;

      // Fetch only students using transport (for quota counts)
      const { data: transportStudents, error: transportError } = await supabase
        .from("students")
        .select("admission_class, quota")
        .eq("transport", true)
        .not("admission_class", "is", null);

      if (transportError) throw transportError;

      // Initialize data structure for classes I-XII
      const classData = {};
      for (let i = 1; i <= 12; i++) {
        classData[i] = {
          sections: new Set(),
          workers: 0,
          private: 0,
          total: 0,
        };
      }

      // Process all students for sections count
      allStudents.forEach((student) => {
        const classMatch = student.admission_class.match(/^Class (\d+)/i);
        if (!classMatch) return;

        const classNum = parseInt(classMatch[1]);
        if (classNum < 1 || classNum > 12) return;

        // Count sections from all students
        classData[classNum].sections.add(student.admission_class);
      });

      // Process transport students for quota counts
      transportStudents.forEach((student) => {
        const classMatch = student.admission_class.match(/^Class (\d+)/i);
        if (!classMatch) return;

        const classNum = parseInt(classMatch[1]);
        if (classNum < 1 || classNum > 12) return;

        // Count quota types only for transport students
        if (student.quota?.toLowerCase() === "private") {
          classData[classNum].private++;
        } else {
          classData[classNum].workers++;
        }
        classData[classNum].total++;
      });

      // Prepare report data with Roman numerals and serial numbers starting from 1
      const reportData = [
        ...Array.from({ length: 12 }, (_, i) => ({
          srNo: i + 1, // Serial numbers start from 1
          className: toRoman(i + 1),
          sections: classData[i + 1]?.sections.size || 0,
          workers: classData[i + 1]?.workers || 0,
          private: classData[i + 1]?.private || 0,
          total: classData[i + 1]?.total || 0,
        })),
        {
          srNo: "",
          className: "Total:",
          sections: Object.values(classData).reduce(
            (sum, data) => sum + data.sections.size,
            0
          ),
          workers: Object.values(classData).reduce(
            (sum, data) => sum + data.workers,
            0
          ),
          private: Object.values(classData).reduce(
            (sum, data) => sum + data.private,
            0
          ),
          total: Object.values(classData).reduce(
            (sum, data) => sum + data.total,
            0
          ),
        },
      ];

      setReportData(reportData);
    } catch (err) {
      console.error("Error fetching transport data:", err);
      showAlert("Failed to fetch data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const generatePDFDocument = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.setFontSize(16);
      pdf.text(
        "WORKERS WELFARE HIGHER SECONDARY SCHOOL FOR BOYS LINO RE",
        pdf.internal.pageSize.getWidth() / 2,
        10,
        { align: "center" }
      );

      pdf.text(
        "NO. OF STUDENTS AVAILING TRANSPORT FACILITY",
        pdf.internal.pageSize.getWidth() / 2,
        17,
        { align: "center" }
      );

      pdf.text(
        `${new Date(year, month - 1).toLocaleString("default", {
          month: "short",
        })}-${year.toString().slice(-2)}`,
        pdf.internal.pageSize.getWidth() / 2,
        24,
        { align: "center" }
      );

      const currentDate = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.text(
        `Generated on: ${currentDate}`,
        pdf.internal.pageSize.getWidth() - 15,
        10,
        { align: "right" }
      );

      autoTable(pdf, {
        head: [
          [
            "Sr.NO",
            "Name of class",
            "No of sections",
            "Workers",
            "Private",
            "Total",
          ],
        ],
        body: reportData.map((row) => [
          row.srNo,
          row.className,
          row.sections,
          row.workers,
          row.private,
          row.total,
        ]),
        startY: 30,
        theme: "grid",
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 },
          margin: { top: 30 },
          didDrawPage: (data) => {
            pdf.setFontSize(8);
            pdf.text(
              `Page ${pdf.internal.getNumberOfPages()}`,
              pdf.internal.pageSize.getWidth() / 2,
              pdf.internal.pageSize.getHeight() - 10,
              { align: "center" }
            );
          },
        },
      });

      return { pdf, currentDate };
    } catch (err) {
      console.error("Error generating PDF:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransportData();
  }, []);

  const generatePDF = async () => {
    if (!window || !document) return;
    setGeneratingPDF(true);

    try {
      const { pdf } = await generatePDFDocument();
      pdf.save("student_transport_report.pdf");
      showAlert("PDF generated successfully!", "success");
    } catch (err) {
      console.error("Error generating PDF:", err);
      showAlert("Failed to generate PDF: " + err.message, "error");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const savePDFToDatabase = async () => {
    if (!window || !document) return;
    setSavingToDb(true);

    try {
      const { data: existingReport, error: fetchError } = await supabase
        .from("SavedReports")
        .select("*")
        .eq("ReportName", "Student Transport Report")
        .eq("Month", month)
        .eq("Year", year)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existingReport) {
        throw new Error("A report for this month/year already exists");
      }
      const { pdf, currentDate } = await generatePDFDocument();
      const pdfBlob = pdf.output("blob");
      const fileName = `student_transport_${month}_${year}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("reports")
        .upload(fileName, pdfBlob);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("reports")
        .getPublicUrl(fileName);

      const publicUrl = urlData?.publicUrl || "";

      const { error: dbError } = await supabase.from("SavedReports").insert({
        Month: month.toString(),
        Year: parseInt(year),
        ReportName: "Student Transport Report",
        FileName: fileName,
        created_at: new Date().toISOString(),
        FilePath: publicUrl,
        ReportType: "student_transport",
        RecordCount: reportData.length,
      });

      if (dbError) throw dbError;

      showAlert("Report successfully saved to database!", "success");
    } catch (err) {
      console.error("Error saving PDF to database:", err);
      showAlert("Failed to save to database: " + err.message, "error");
    } finally {
      setSavingToDb(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-5 text-lg">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 m-5 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            WORKERS WELFARE HIGHER SECONDARY SCHOOL FOR BOYS LINO RE
          </h1>
          <h2 className="text-xl font-medium text-gray-700 mt-1">
            NO. OF STUDENTS AVAILING TRANSPORT FACILITY
          </h2>
          <h3 className="text-lg text-gray-600 mt-1">
            {new Date(year, month - 1).toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-3 md:mt-0">
          <button
            onClick={savePDFToDatabase}
            className={`px-4 py-2 rounded text-white font-medium ${
              savingToDb || reportData.length === 0
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={savingToDb || reportData.length === 0}
          >
            {savingToDb ? "Saving..." : "Save to Database"}
          </button>
          <button
            onClick={generatePDF}
            className={`px-4 py-2 rounded text-white font-medium ${
              generatingPDF || reportData.length === 0
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={generatingPDF || reportData.length === 0}
          >
            {generatingPDF ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="w-full">
        {reportData.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-500">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sr.NO
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name of class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    No of sections
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Workers
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Private
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      row.className === "Total:"
                        ? "font-bold bg-gray-100"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.className}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.sections}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.workers}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.private}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-5 text-gray-600">
            No transport data found.
          </div>
        )}
      </div>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReportStudentAvailTransport;
