import { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReportStudentStrength = ({ month, year }) => {
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

  // const fetchStudentStrengthData = async () => {
  //   setLoading(true);
  //   try {
  //     // In a real app, you would fetch this data from your database
  //     // For now, we'll use the data from your image as mock data
  //     const mockData = [
  //       {
  //         srNo: 1,
  //         className: "I",
  //         sections: 3,
  //         workers: 100,
  //         private: 0,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 100,
  //       },
  //       {
  //         srNo: 2,
  //         className: "II",
  //         sections: 3,
  //         workers: 117,
  //         private: 1,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 118,
  //       },
  //       {
  //         srNo: 3,
  //         className: "III",
  //         sections: 2,
  //         workers: 87,
  //         private: 0,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 87,
  //       },
  //       {
  //         srNo: 4,
  //         className: "IV",
  //         sections: 2,
  //         workers: 112,
  //         private: 1,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 113,
  //       },
  //       {
  //         srNo: 5,
  //         className: "V",
  //         sections: 2,
  //         workers: 89,
  //         private: 0,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 89,
  //       },
  //       {
  //         srNo: 6,
  //         className: "VI",
  //         sections: 5,
  //         workers: 205,
  //         private: 1,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 206,
  //       },
  //       {
  //         srNo: 7,
  //         className: "VII",
  //         sections: 4,
  //         workers: 219,
  //         private: 0,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 219,
  //       },
  //       {
  //         srNo: 8,
  //         className: "VIII",
  //         sections: 6,
  //         workers: 265,
  //         private: 2,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 267,
  //       },
  //       {
  //         srNo: 9,
  //         className: "IX",
  //         sections: 4,
  //         workers: 156,
  //         private: 1,
  //         mtech: "-",
  //         science: 157,
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 157,
  //       },
  //       {
  //         srNo: 10,
  //         className: "X",
  //         sections: 3,
  //         workers: 147,
  //         private: 1,
  //         mtech: "-",
  //         science: 111,
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 148,
  //       },
  //       {
  //         srNo: 11,
  //         className: "XI",
  //         sections: 1,
  //         workers: 30,
  //         private: 6,
  //         mtech: "-",
  //         science: 0,
  //         arts: 0,
  //         preMedical: 0,
  //         preEngg: 0,
  //         iCom: 0,
  //         ics: 0,
  //         total: 36,
  //       },
  //       {
  //         srNo: 12,
  //         className: "XII",
  //         sections: 2,
  //         workers: 54,
  //         private: 1,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 55,
  //       },
  //       {
  //         srNo: 13,
  //         className: "Total",
  //         sections: 37, // Updated from 34 to 37 (3 new sections from Class I)
  //         workers: 1581, // Updated from 1481 (100 new workers from Class I)
  //         private: 14,
  //         mtech: "-",
  //         science: "-",
  //         arts: "-",
  //         preMedical: "-",
  //         preEngg: "-",
  //         iCom: "-",
  //         ics: "-",
  //         total: 1595, // Updated from 1495 (100 new total from Class I)
  //       },
  //     ];

  //     setReportData(mockData);
  //   } catch (err) {
  //     console.error("Error fetching student strength data:", err);
  //     showAlert("Failed to fetch data: " + err.message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchStudentStrengthData = async () => {
  //   setLoading(true);
  //   try {
  //     // Fetch all students data
  //     const { data: students, error: studentsError } = await supabase
  //       .from("students")
  //       .select("admission_class, quota, elective_group")
  //       .not("admission_class", "is", null);

  //     if (studentsError) throw studentsError;

  //     // Initialize data structure
  //     const classData = {};

  //     // Process all students
  //     students.forEach((student) => {
  //       const classMatch = student.admission_class.match(/^Class (\d+)/i);
  //       if (!classMatch) return;

  //       const className = classMatch[1]; // Gets "1" from "Class 1A"
  //       if (!classData[className]) {
  //         classData[className] = {
  //           sections: new Set(),
  //           workers: 0,
  //           private: 0,
  //           mtech: 0,
  //           science: 0,
  //           arts: 0,
  //           preMedical: 0,
  //           preEngg: 0,
  //           iCom: 0,
  //           ics: 0,
  //         };
  //       }

  //       // Count sections
  //       classData[className].sections.add(student.admission_class);

  //       // Count quota types (workers/private)
  //       if (student.quota?.toLowerCase() === "private") {
  //         classData[className].private++;
  //       } else {
  //         classData[className].workers++;
  //       }

  //       // Count elective groups
  //       const electiveGroup = student.elective_group?.toLowerCase() || "";
  //       if (electiveGroup.includes("mtech")) {
  //         classData[className].mtech++;
  //       } else if (electiveGroup.includes("science")) {
  //         classData[className].science++;
  //       } else if (electiveGroup.includes("arts")) {
  //         classData[className].arts++;
  //       } else if (electiveGroup.includes("pre-medical")) {
  //         classData[className].preMedical++;
  //       } else if (electiveGroup.includes("pre-engg")) {
  //         classData[className].preEngg++;
  //       } else if (electiveGroup.includes("icom")) {
  //         classData[className].iCom++;
  //       } else if (electiveGroup.includes("ics")) {
  //         classData[className].ics++;
  //       }
  //     });

  //     // Prepare report data
  //     const reportData = [
  //       createClassRow(1, classData["1"]),
  //       createClassRow(2, classData["2"]),
  //       createClassRow(3, classData["3"]),
  //       createClassRow(4, classData["4"]),
  //       createClassRow(5, classData["5"]),
  //       createClassRow(6, classData["6"]),
  //       createClassRow(7, classData["7"]),
  //       createClassRow(8, classData["8"]),
  //       createClassRow(9, classData["9"]),
  //       createClassRow(10, classData["10"]),
  //       createClassRow(11, classData["11"]),
  //       createClassRow(12, classData["12"]),
  //       createTotalRow(classData),
  //     ].filter((row) => row !== null);

  //     setReportData(reportData);
  //   } catch (err) {
  //     console.error("Error fetching student strength data:", err);
  //     showAlert("Failed to fetch data: " + err.message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchStudentStrengthData = async () => {
    setLoading(true);
    try {
      // Fetch all students data
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("admission_class, quota, elective_group")
        .not("admission_class", "is", null);

      if (studentsError) throw studentsError;

      // Initialize data structure for all classes (1-12)
      const classData = {};
      for (let i = 1; i <= 12; i++) {
        classData[i] = {
          sections: new Set(),
          workers: 0,
          private: 0,
          mtech: 0,
          science: 0,
          arts: 0,
          preMedical: 0,
          preEngg: 0,
          iCom: 0,
          ics: 0,
        };
      }

      // Process all students
      students.forEach((student) => {
        const classMatch = student.admission_class.match(/^Class (\d+)/i);
        if (!classMatch) return;

        const classNum = parseInt(classMatch[1]);
        if (classNum < 1 || classNum > 12) return;

        // Count sections
        classData[classNum].sections.add(student.admission_class);

        // Count quota types (workers/private)
        if (student.quota?.toLowerCase() === "private") {
          classData[classNum].private++;
        } else {
          classData[classNum].workers++;
        }

        // Count elective groups
        const electiveGroup = student.elective_group?.toLowerCase() || "";
        if (electiveGroup.includes("m.tech group")) {
          classData[classNum].mtech++;
        } else if (electiveGroup.includes("sci group")) {
          classData[classNum].science++;
        } else if (electiveGroup.includes("arts group")) {
          classData[classNum].arts++;
        } else if (electiveGroup.includes("premedical")) {
          classData[classNum].preMedical++;
        } else if (electiveGroup.includes("preengineering")) {
          classData[classNum].preEngg++;
        } else if (electiveGroup.includes("i.com")) {
          classData[classNum].iCom++;
        } else if (electiveGroup.includes("i.c.s")) {
          classData[classNum].ics++;
        }
      });

      // Prepare report data - all classes from I to XII
      const reportData = [
        ...Array.from({ length: 12 }, (_, i) =>
          createClassRow(i + 1, classData[i + 1])
        ),
        createTotalRow(classData),
      ];

      setReportData(reportData);
    } catch (err) {
      console.error("Error fetching student strength data:", err);
      showAlert("Failed to fetch data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

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

  // Helper function to create a class row
  // const createClassRow = (classNum, data) => {
  //   return {
  //     srNo: classNum,
  //     className: toRoman(classNum),
  //     sections: data.sections.size,
  //     workers: data.workers,
  //     private: data.private,
  //     mtech: data.mtech || "-",
  //     science: data.science || "-",
  //     arts: data.arts || "-",
  //     preMedical: data.preMedical || "-",
  //     preEngg: data.preEngg || "-",
  //     iCom: data.iCom || "-",
  //     ics: data.ics || "-",
  //     total: data.workers + data.private,
  //   };
  // };

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
        `Student Strength Report - ${new Date(year, month - 1).toLocaleString(
          "default",
          { month: "long" }
        )} ${year}`,
        pdf.internal.pageSize.getWidth() / 2,
        15,
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

      const columns = [
        { header: "Sr. NO", dataKey: "srNo" },
        { header: "Name of class", dataKey: "className" },
        { header: "No of section", dataKey: "sections" },
        { header: "Workers", dataKey: "workers" },
        { header: "Private", dataKey: "private" },
        { header: "M.Tech. Group", dataKey: "mtech" },
        { header: "Sci Group", dataKey: "science" },
        { header: "Arts Group", dataKey: "arts" },
        { header: "Pre Medical", dataKey: "preMedical" },
        { header: "Pre-Engg", dataKey: "preEngg" },
        { header: "I.Com", dataKey: "iCom" },
        { header: "I.C.S", dataKey: "ics" },
        { header: "Total", dataKey: "total" },
      ];

      // Prepare rows ensuring all values are strings
      const rows = reportData.map((row) => {
        return {
          srNo: row.srNo.toString(),
          className: row.className.toString(),
          sections: row.sections.toString(),
          workers: row.workers.toString(),
          private: row.private.toString(),
          mtech: row.mtech.toString(),
          science: row.science.toString(),
          arts: row.arts.toString(),
          preMedical: row.preMedical.toString(),
          preEngg: row.preEngg.toString(),
          iCom: row.iCom.toString(),
          ics: row.ics.toString(),
          total: row.total.toString(),
        };
      });

      autoTable(pdf, {
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => [
          row.srNo,
          row.className,
          row.sections,
          row.workers,
          row.private,
          row.mtech,
          row.science,
          row.arts,
          row.preMedical,
          row.preEngg,
          row.iCom,
          row.ics,
          row.total,
        ]),
        startY: 25,
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
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 20 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 15 },
          11: { cellWidth: 15 },
          12: { cellWidth: 15 },
        },
        margin: { top: 25 },
        didDrawPage: (data) => {
          pdf.setFontSize(8);
          pdf.text(
            `Page ${pdf.internal.getNumberOfPages()}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        },
      });

      return { pdf, currentDate };
    } catch (err) {
      console.error("Error generating PDF:", err);
      throw err;
    }
  };

  const createClassRow = (classNum, data) => {
    return {
      srNo: classNum,
      className: toRoman(classNum),
      sections: data.sections.size,
      workers: data.workers,
      private: data.private,
      mtech: data.mtech > 0 ? data.mtech.toString() : "-",
      science: data.science > 0 ? data.science.toString() : "-",
      arts: data.arts > 0 ? data.arts.toString() : "-",
      preMedical: data.preMedical > 0 ? data.preMedical.toString() : "-",
      preEngg: data.preEngg > 0 ? data.preEngg.toString() : "-",
      iCom: data.iCom > 0 ? data.iCom.toString() : "-",
      ics: data.ics > 0 ? data.ics.toString() : "-",
      total: (data.workers + data.private).toString(),
    };
  };

  // Helper function to create the total row
  const createTotalRow = (classData) => {
    const totals = {
      sections: 0,
      workers: 0,
      private: 0,
      mtech: 0,
      science: 0,
      arts: 0,
      preMedical: 0,
      preEngg: 0,
      iCom: 0,
      ics: 0,
    };

    Object.values(classData).forEach((data) => {
      totals.sections += data.sections.size;
      totals.workers += data.workers;
      totals.private += data.private;
      totals.mtech += data.mtech;
      totals.science += data.science;
      totals.arts += data.arts;
      totals.preMedical += data.preMedical;
      totals.preEngg += data.preEngg;
      totals.iCom += data.iCom;
      totals.ics += data.ics;
    });

    return {
      srNo: "",
      className: "Total",
      sections: totals.sections,
      workers: totals.workers,
      private: totals.private,
      mtech: totals.mtech || "-",
      science: totals.science || "-",
      arts: totals.arts || "-",
      preMedical: totals.preMedical || "-",
      preEngg: totals.preEngg || "-",
      iCom: totals.iCom || "-",
      ics: totals.ics || "-",
      total: totals.workers + totals.private,
    };
  };

  // Helper function to create a class row
  // const createClassRow = (srNo, data) => {
  //   if (!data) return null;

  //   return {
  //     srNo,
  //     className: srNo === 11 ? "XI" : srNo === 12 ? "XII" : srNo.toString(),
  //     sections: data.sections.size,
  //     workers: data.workers,
  //     private: data.private,
  //     mtech: data.mtech || "-",
  //     science: data.science || "-",
  //     arts: data.arts || "-",
  //     preMedical: data.preMedical || "-",
  //     preEngg: data.preEngg || "-",
  //     iCom: data.iCom || "-",
  //     ics: data.ics || "-",
  //     total: data.workers + data.private,
  //   };
  // };

  // // Helper function to create the total row
  // const createTotalRow = (classData) => {
  //   const totals = {
  //     sections: 0,
  //     workers: 0,
  //     private: 0,
  //     mtech: 0,
  //     science: 0,
  //     arts: 0,
  //     preMedical: 0,
  //     preEngg: 0,
  //     iCom: 0,
  //     ics: 0,
  //   };

  //   Object.values(classData).forEach((data) => {
  //     totals.sections += data.sections.size;
  //     totals.workers += data.workers;
  //     totals.private += data.private;
  //     totals.mtech += data.mtech;
  //     totals.science += data.science;
  //     totals.arts += data.arts;
  //     totals.preMedical += data.preMedical;
  //     totals.preEngg += data.preEngg;
  //     totals.iCom += data.iCom;
  //     totals.ics += data.ics;
  //   });

  //   return {
  //     srNo: "",
  //     className: "Total",
  //     sections: totals.sections,
  //     workers: totals.workers,
  //     private: totals.private,
  //     mtech: totals.mtech || "-",
  //     science: totals.science || "-",
  //     arts: totals.arts || "-",
  //     preMedical: totals.preMedical || "-",
  //     preEngg: totals.preEngg || "-",
  //     iCom: totals.iCom || "-",
  //     ics: totals.ics || "-",
  //     total: totals.workers + totals.private,
  //   };
  // };
  useEffect(() => {
    fetchStudentStrengthData();
  }, []);

  // const generatePDFDocument = async () => {
  //   try {
  //     const jsPDF = (await import("jspdf")).default;
  //     const autoTable = (await import("jspdf-autotable")).default;

  //     const pdf = new jsPDF({
  //       orientation: "landscape",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     pdf.setFontSize(16);
  //     pdf.text(
  //       `Student Strength Report - ${new Date(year, month - 1).toLocaleString(
  //         "default",
  //         { month: "long" }
  //       )} ${year}`,
  //       pdf.internal.pageSize.getWidth() / 2,
  //       15,
  //       { align: "center" }
  //     );
  //     const currentDate = new Date().toLocaleDateString();
  //     pdf.setFontSize(10);
  //     pdf.text(
  //       `Generated on: ${currentDate}`,
  //       pdf.internal.pageSize.getWidth() - 15,
  //       10,
  //       { align: "right" }
  //     );

  //     const columns = [
  //       { header: "Sr. NO", dataKey: "srNo" },
  //       { header: "Name of class", dataKey: "className" },
  //       { header: "No of section", dataKey: "sections" },
  //       { header: "Workers", dataKey: "workers" },
  //       { header: "Private", dataKey: "private" },
  //       { header: "M.Tech. Group", dataKey: "mtech" },
  //       { header: "Sci Group", dataKey: "science" },
  //       { header: "Arts Group", dataKey: "arts" },
  //       { header: "Pre Medical", dataKey: "preMedical" },
  //       { header: "Pre-Engg", dataKey: "preEngg" },
  //       { header: "I.Com", dataKey: "iCom" },
  //       { header: "I.C.S", dataKey: "ics" },
  //       { header: "Total", dataKey: "total" },
  //     ];

  //     const rows = reportData.map((row) => ({
  //       ...row,
  //       className:
  //         row.srNo === 12 ? <strong>{row.className}</strong> : row.className,
  //     }));

  //     autoTable(pdf, {
  //       head: [columns.map((col) => col.header)],
  //       body: rows.map((row) => columns.map((col) => row[col.dataKey])),
  //       startY: 25,
  //       theme: "grid",
  //       headStyles: {
  //         fillColor: [52, 152, 219],
  //         textColor: 255,
  //         fontStyle: "bold",
  //       },
  //       alternateRowStyles: {
  //         fillColor: [240, 240, 240],
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 15 },
  //         1: { cellWidth: 25 },
  //         2: { cellWidth: 20 },
  //         3: { cellWidth: 15 },
  //         4: { cellWidth: 15 },
  //         5: { cellWidth: 20 },
  //         6: { cellWidth: 15 },
  //         7: { cellWidth: 15 },
  //         8: { cellWidth: 20 },
  //         9: { cellWidth: 20 },
  //         10: { cellWidth: 15 },
  //         11: { cellWidth: 15 },
  //         12: { cellWidth: 15 },
  //       },
  //       margin: { top: 25 },
  //       didDrawPage: (data) => {
  //         pdf.setFontSize(8);
  //         pdf.text(
  //           `Page ${pdf.internal.getNumberOfPages()}`,
  //           pdf.internal.pageSize.getWidth() / 2,
  //           pdf.internal.pageSize.getHeight() - 10,
  //           { align: "center" }
  //         );
  //       },
  //     });

  //     return { pdf, currentDate };
  //   } catch (err) {
  //     console.error("Error generating PDF:", err);
  //     throw err;
  //   }
  // };

  const generatePDF = async () => {
    if (!window || !document) return;
    setGeneratingPDF(true);

    try {
      const { pdf } = await generatePDFDocument();
      pdf.save("student_strength_report.pdf");
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
        .eq("ReportName", "Student Strength Report")
        .eq("Month", month)
        .eq("Year", year)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existingReport) {
        throw new Error("A report for this month/year already exists");
      }
      const { pdf, currentDate } = await generatePDFDocument();
      const pdfBlob = pdf.output("blob");
      const timestamp = new Date().getTime();
      const fileName = `student_strength_${month}_${year}.pdf`;
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
        ReportName: "Student Strength Report",
        FileName: fileName,
        created_at: new Date().toISOString(),
        FilePath: publicUrl,
        ReportType: "student_strength",
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-3 md:mb-0">
          Details of Student Strength - Jun 2024
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
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
                    Sr. NO
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name of class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    No of section
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Workers
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Private
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    M.Tech. Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sci Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Arts Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Pre Medical
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Pre-Engg
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    I.Com
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    I.C.S
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((row) => (
                  <tr
                    key={row.srNo}
                    className={`hover:bg-gray-50 ${
                      row.srNo === 12 ? "font-bold bg-gray-100" : ""
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.className}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.sections}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.workers}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.private}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.mtech}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.science}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.arts}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.preMedical}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.preEngg}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.iCom}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.ics}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-5 text-gray-600">
            No student strength data found.
          </div>
        )}
      </div>

      {/* Snackbar for Alerts */}
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

export default ReportStudentStrength;
