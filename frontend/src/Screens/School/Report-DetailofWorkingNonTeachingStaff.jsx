import { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReportDetailofWorkingNonTeachingStaff = ({
  month,
  year,
  SchoolID,
  SchoolName,
}) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [savingToDb, setSavingToDb] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Define all required posts regardless of staff table
  const ALL_POSTS = [
    "Principal",
    "Vice Principal",
    "Superintendent",
    "Accountant",
    "Senior Clerk",
    "Assistant/ Caretaker",
    "Account Assistant",
    "Library Assistant",
    "Junior Clerk",
    "Library Clerk",
    "Store keeper",
    "Laboratory Attendent",
    "Driver",
    "Bus Conductor",
    "Chowkidar",
    "Naib Qasid",
    "Mail",
    "Aya",
    "Sweeper",
    "Escort",
  ];

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  // const fetchNonTeachingStaff = async () => {
  //   setLoading(true);
  //   try {
  //     // Fetch Non-Teaching Staff
  //     const { data: staff, error: staffError } = await supabase
  //       .from("staff")
  //       .select("*")
  //       .order("id", { ascending: true });

  //     if (staffError) throw staffError;

  //     // Initialize all posts with zero counts
  //     const staffByDesignation = ALL_POSTS.reduce((acc, post) => {
  //       acc[post] = {
  //         maleRegular: 0,
  //         maleContract: 0,
  //         maleDeputation: 0,
  //         femaleRegular: 0,
  //         femaleContract: 0,
  //         femaleDeputation: 0,
  //         total: 0,
  //       };
  //       return acc;
  //     }, {});

  //     // Count staff for each designation
  //     staff.forEach((staffMember) => {
  //       const designation = staffMember.designation || "Other";

  //       // Only process if designation is in our ALL_POSTS list
  //       if (ALL_POSTS.includes(designation)) {
  //         const gender =
  //           staffMember.gender?.toLowerCase() === "female" ? "female" : "male";
  //         const employmentType =
  //           staffMember.employment_type?.toLowerCase() || "regular";

  //         if (employmentType.includes("contract")) {
  //           staffByDesignation[designation][`${gender}Contract`] += 1;
  //         } else if (employmentType.includes("deputation")) {
  //           staffByDesignation[designation][`${gender}Deputation`] += 1;
  //         } else {
  //           staffByDesignation[designation][`${gender}Regular`] += 1;
  //         }

  //         staffByDesignation[designation].total += 1;
  //       }
  //     });

  //     // Format for table display
  //     const formattedData = ALL_POSTS.map((post, index) => ({
  //       srNo: index + 1,
  //       nameOfPost: post,
  //       maleRegular: staffByDesignation[post].maleRegular,
  //       maleContract: staffByDesignation[post].maleContract,
  //       maleDeputation: staffByDesignation[post].maleDeputation,
  //       femaleRegular: staffByDesignation[post].femaleRegular,
  //       femaleContract: staffByDesignation[post].femaleContract,
  //       femaleDeputation: staffByDesignation[post].femaleDeputation,
  //       total: staffByDesignation[post].total,
  //     }));

  //     // Add total row
  //     const totals = formattedData.reduce(
  //       (acc, row) => {
  //         acc.maleRegular += row.maleRegular;
  //         acc.maleContract += row.maleContract;
  //         acc.maleDeputation += row.maleDeputation;
  //         acc.femaleRegular += row.femaleRegular;
  //         acc.femaleContract += row.femaleContract;
  //         acc.femaleDeputation += row.femaleDeputation;
  //         acc.total += row.total;
  //         return acc;
  //       },
  //       {
  //         maleRegular: 0,
  //         maleContract: 0,
  //         maleDeputation: 0,
  //         femaleRegular: 0,
  //         femaleContract: 0,
  //         femaleDeputation: 0,
  //         total: 0,
  //       }
  //     );

  //     formattedData.push({
  //       srNo: "",
  //       nameOfPost: "Total",
  //       maleRegular: totals.maleRegular,
  //       maleContract: totals.maleContract,
  //       maleDeputation: totals.maleDeputation,
  //       femaleRegular: totals.femaleRegular,
  //       femaleContract: totals.femaleContract,
  //       femaleDeputation: totals.femaleDeputation,
  //       total: totals.total,
  //     });

  //     setReportData(formattedData);
  //   } catch (err) {
  //     console.error("Error fetching non-teaching staff:", err);
  //     showAlert("Failed to fetch data: " + err.message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Rest of the component remains the same...

  const fetchNonTeachingStaff = async () => {
    setLoading(true);
    try {
      // Fetch both teachers and non-teaching staff
      const [
        { data: teachers, error: teachersError },
        { data: staff, error: staffError },
      ] = await Promise.all([
        supabase
          .from("Teacher")
          .select("*")
          .order("TeacherID", { ascending: true }),
        supabase.from("staff").select("*").order("id", { ascending: true }),
      ]);

      console.log("teacher data", teachers);

      if (teachersError) throw teachersError;
      if (staffError) throw staffError;

      // Initialize all posts with zero counts
      const staffByDesignation = ALL_POSTS.reduce((acc, post) => {
        acc[post] = {
          maleRegular: 0,
          maleContract: 0,
          maleDeputation: 0,
          femaleRegular: 0,
          femaleContract: 0,
          femaleDeputation: 0,
          total: 0,
        };
        return acc;
      }, {});

      // Process teachers - only count Principals and Vice Principals
      teachers.forEach((teacher) => {
        const employeeType = teacher.EmployeeType || "Other";

        // Only process Principal and Vice Principal from teachers
        if (employeeType === "Principal" || employeeType === "Vice Principal") {
          const gender =
            teacher.Gender?.toLowerCase() === "female" ? "female" : "male";
          const employmentType =
            teacher.EmployementType?.toLowerCase() || "regular";

          if (employmentType.includes("contract")) {
            staffByDesignation[employeeType][`${gender}Contract`] += 1;
          } else if (employmentType.includes("deputation")) {
            staffByDesignation[employeeType][`${gender}Deputation`] += 1;
          } else {
            staffByDesignation[employeeType][`${gender}Regular`] += 1;
          }

          staffByDesignation[employeeType].total += 1;
        }
      });

      // Process staff - all other roles except Principal and Vice Principal
      staff.forEach((staffMember) => {
        const designation = staffMember.designation || "Other";

        // Only process if designation is in our ALL_POSTS list and not Principal/Vice Principal
        if (
          ALL_POSTS.includes(designation) &&
          designation !== "Principal" &&
          designation !== "Vice Principal"
        ) {
          const gender =
            staffMember.gender?.toLowerCase() === "female" ? "female" : "male";
          const employmentType =
            staffMember.employment_type?.toLowerCase() || "regular";

          if (employmentType.includes("contract")) {
            staffByDesignation[designation][`${gender}Contract`] += 1;
          } else if (employmentType.includes("deputation")) {
            staffByDesignation[designation][`${gender}Deputation`] += 1;
          } else {
            staffByDesignation[designation][`${gender}Regular`] += 1;
          }

          staffByDesignation[designation].total += 1;
        }
      });

      // Format for table display (rest remains the same)
      const formattedData = ALL_POSTS.map((post, index) => ({
        srNo: index + 1,
        nameOfPost: post,
        maleRegular: staffByDesignation[post].maleRegular,
        maleContract: staffByDesignation[post].maleContract,
        maleDeputation: staffByDesignation[post].maleDeputation,
        femaleRegular: staffByDesignation[post].femaleRegular,
        femaleContract: staffByDesignation[post].femaleContract,
        femaleDeputation: staffByDesignation[post].femaleDeputation,
        total: staffByDesignation[post].total,
      }));

      // Add total row
      const totals = formattedData.reduce(
        (acc, row) => {
          acc.maleRegular += row.maleRegular;
          acc.maleContract += row.maleContract;
          acc.maleDeputation += row.maleDeputation;
          acc.femaleRegular += row.femaleRegular;
          acc.femaleContract += row.femaleContract;
          acc.femaleDeputation += row.femaleDeputation;
          acc.total += row.total;
          return acc;
        },
        {
          maleRegular: 0,
          maleContract: 0,
          maleDeputation: 0,
          femaleRegular: 0,
          femaleContract: 0,
          femaleDeputation: 0,
          total: 0,
        }
      );

      formattedData.push({
        srNo: "",
        nameOfPost: "Total",
        maleRegular: totals.maleRegular,
        maleContract: totals.maleContract,
        maleDeputation: totals.maleDeputation,
        femaleRegular: totals.femaleRegular,
        femaleContract: totals.femaleContract,
        femaleDeputation: totals.femaleDeputation,
        total: totals.total,
      });

      setReportData(formattedData);
    } catch (err) {
      console.error("Error fetching non-teaching staff:", err);
      showAlert("Failed to fetch data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNonTeachingStaff();
  }, []);

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
        `Detail of Working Non Teaching Staff Male/Female,Regular/Contract`,
        pdf.internal.pageSize.getWidth() / 2,
        15,
        { align: "center" }
      );

      pdf.setFontSize(12);
      pdf.text(
        `${SchoolName} - ${new Date(year, month).toLocaleString("default", {
          month: "long",
        })} ${year}`,
        pdf.internal.pageSize.getWidth() / 2,
        23,
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
        { header: "Sr.No", dataKey: "srNo" },
        { header: "Name of Post", dataKey: "nameOfPost" },
        { header: "Male | Regular", dataKey: "maleRegular" },
        { header: "Male | Contract", dataKey: "maleContract" },
        { header: "Male | Deputation", dataKey: "maleDeputation" },
        { header: "Female | Regular", dataKey: "femaleRegular" },
        { header: "Female | Contract", dataKey: "femaleContract" },
        { header: "Female | Deputation", dataKey: "femaleDeputation" },
        { header: "Total", dataKey: "total" },
      ];

      const rows = reportData.map((row) => ({
        srNo: row.srNo,
        nameOfPost: row.nameOfPost,
        maleRegular: row.maleRegular,
        maleContract: row.maleContract,
        maleDeputation: row.maleDeputation,
        femaleRegular: row.femaleRegular,
        femaleContract: row.femaleContract,
        femaleDeputation: row.femaleDeputation,
        total: row.total,
      }));

      autoTable(pdf, {
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => columns.map((col) => row[col.dataKey])),
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
      });

      return { pdf, currentDate };
    } catch (err) {
      console.error("Error generating PDF:", err);
      throw err;
    }
  };

  const generatePDF = async () => {
    if (!window || !document) return;
    setGeneratingPDF(true);

    try {
      const { pdf } = await generatePDFDocument();
      const fileName = `Detail of Working Non Teaching Staff Male/Female,Regular/Contract
- ${SchoolID} -${month}- ${year}.pdf`;
      pdf.save(fileName);
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
        .eq("ReportName", "Non-Teaching Staff Report")
        .eq("Month", month)
        .eq("Year", year)
        .eq("SchoolId", SchoolID)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existingReport) {
        throw new Error("A report for this month/year already exists");
      }
      const { pdf, currentDate } = await generatePDFDocument();
      const pdfBlob = pdf.output("blob");
      const timestamp = new Date().getTime();
      const fileName = `non_teaching_staff_${SchoolID}_${month}_${year}.pdf`;
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
        ReportName: "Non-Teaching Staff Report",
        FileName: fileName,
        created_at: new Date().toISOString(),
        FilePath: publicUrl,
        ReportType: "non_teaching_staff",
        RecordCount: reportData.length,
        SchoolId: SchoolID,
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
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-gray-800">
            Detail of Working Non Teaching Staff Male/Female,Regular/Contract
            Report
          </h1>
          <p className="text-gray-600 text-sm">
            {SchoolName} |{" "}
            {new Date(year, month).toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Sr.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Name of Post
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"
                    colSpan="3"
                  >
                    Male
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"
                    colSpan="3"
                  >
                    Female
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Total
                  </th>
                </tr>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Regular
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Contract
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Deputation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Regular
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Contract
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Deputation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      row.nameOfPost === "Total"
                        ? "font-bold bg-gray-100"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.nameOfPost}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.maleRegular}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.maleContract}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.maleDeputation}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.femaleRegular}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.femaleContract}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.femaleDeputation}
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
            No non-teaching staff records found.
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

export default ReportDetailofWorkingNonTeachingStaff;
