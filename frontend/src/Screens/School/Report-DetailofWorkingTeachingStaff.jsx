import { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReportDetailofWorkingTeachingStaff = ({
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

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  // const fetchTeachingStaff = async () => {
  //   setLoading(true);
  //   try {
  //     // Fetch Teachers
  //     const { data: teachers, error: teacherError } = await supabase
  //       .from("Teacher")
  //       .select("*")
  //       .order("TeacherID", { ascending: true });

  //     if (teacherError) throw teacherError;

  //     // Initialize data structure for posts
  //     const posts = [
  //       "Subject Specialist",
  //       "S.S.T/SSE/Acting Principal",
  //       "S.S.T(I.T)",
  //       "Arabic Teacher",
  //       "E.S.T/E.S.E",
  //       "P.T.I",
  //     ];

  //     const staffByPost = posts.reduce((acc, post) => {
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

  //     // Process teachers
  //     teachers.forEach((teacher) => {
  //       const post = teacher.EmployeeType || "Other";
  //       const gender =
  //         teacher.Gender?.toLowerCase() === "female" ? "female" : "male";
  //       const employmentType =
  //         teacher.EmployementType?.toLowerCase() || "regular";

  //       if (staffByPost[post]) {
  //         if (employmentType.includes("contract")) {
  //           staffByPost[post][`${gender}Contract`] += 1;
  //         } else if (employmentType.includes("deputation")) {
  //           staffByPost[post][`${gender}Deputation`] += 1;
  //         } else {
  //           staffByPost[post][`${gender}Regular`] += 1;
  //         }
  //         staffByPost[post].total += 1;
  //       }
  //     });

  //     // Format for table display
  //     const formattedData = posts.map((post, index) => ({
  //       srNo: index + 1,
  //       nameOfPost: post,
  //       maleRegular: staffByPost[post].maleRegular,
  //       maleContract: staffByPost[post].maleContract,
  //       maleDeputation: staffByPost[post].maleDeputation,
  //       femaleRegular: staffByPost[post].femaleRegular,
  //       femaleContract: staffByPost[post].femaleContract,
  //       femaleDeputation: staffByPost[post].femaleDeputation,
  //       total: staffByPost[post].total,
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
  //     console.error("Error fetching teaching staff:", err);
  //     showAlert("Failed to fetch data: " + err.message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTeachingStaff = async () => {
    setLoading(true);
    try {
      // Fetch Teachers
      const { data: teachers, error: teacherError } = await supabase
        .from("Teacher")
        .select("*")
        .eq("EmployeeType", "Teacher")
        .order("TeacherID", { ascending: true });

      if (teacherError) throw teacherError;

      // Define post groupings
      const postGroups = {
        "Subject Specialist": ["Subject Specialist"],
        "S.S.T/SSE/Acting Principal": ["S.S.T", "S.S.E", "Acting Principal"],
        "S.S.T(I.T)": ["S.S.T(I.T)"],
        "Arabic Teacher": ["Arabic Teacher"],
        "E.S.T/E.S.E": ["E.S.T", "E.S.E"],
        "P.T.I": ["P.T.I"],
      };

      // Initialize data structure
      const staffByPost = Object.keys(postGroups).reduce((acc, groupName) => {
        acc[groupName] = {
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

      // Process teachers
      teachers.forEach((teacher) => {
        const post = teacher.Post;
        const gender =
          teacher.Gender?.toLowerCase() === "female" ? "female" : "male";
        const employmentType =
          teacher.EmployementType?.toLowerCase() || "regular";

        // Find which group this post belongs to
        let groupName = "Other";
        for (const [group, posts] of Object.entries(postGroups)) {
          if (posts.includes(post)) {
            groupName = group;
            break;
          }
        }

        // Skip if not in any group (or add to "Other" if you want)
        if (!staffByPost[groupName]) return;

        if (employmentType.includes("contract")) {
          staffByPost[groupName][`${gender}Contract`] += 1;
        } else if (employmentType.includes("deputation")) {
          staffByPost[groupName][`${gender}Deputation`] += 1;
        } else {
          staffByPost[groupName][`${gender}Regular`] += 1;
        }
        staffByPost[groupName].total += 1;
      });

      // Format for table display
      const formattedData = Object.keys(postGroups).map((groupName, index) => ({
        srNo: index + 1,
        nameOfPost: groupName,
        maleRegular: staffByPost[groupName].maleRegular,
        maleContract: staffByPost[groupName].maleContract,
        maleDeputation: staffByPost[groupName].maleDeputation,
        femaleRegular: staffByPost[groupName].femaleRegular,
        femaleContract: staffByPost[groupName].femaleContract,
        femaleDeputation: staffByPost[groupName].femaleDeputation,
        total: staffByPost[groupName].total,
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
      console.error("Error fetching teaching staff:", err);
      showAlert("Failed to fetch data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachingStaff();
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
        `Detail of Working  Teaching Staff Male/Female,Regular/Contract`,
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
        { header: "Name of Post", dataKey: "nameOfPost" },
        { header: "Male Teacher", dataKey: "maleRegular" },
        { header: "", dataKey: "maleContract" },
        { header: "", dataKey: "maleDeputation" },
        { header: "Female Teacher", dataKey: "femaleRegular" },
        { header: "", dataKey: "femaleContract" },
        { header: "", dataKey: "femaleDeputation" },
        { header: "Total", dataKey: "total" },
      ];

      autoTable(pdf, {
        head: [
          [
            "Name of Post",
            { content: "Male Teacher", colSpan: 3 },
            { content: "Female Teacher", colSpan: 3 },
            "Total",
          ],
          [
            "",
            "Regular",
            "Contract",
            "Deputation",
            "Regular",
            "Contract",
            "Deputation",
            "",
          ],
        ],
        body: reportData.map((row) => [
          row.nameOfPost,
          row.maleRegular || "-",
          row.maleContract || "-",
          row.maleDeputation || "-",
          row.femaleRegular || "-",
          row.femaleContract || "-",
          row.femaleDeputation || "-",
          row.total || "-",
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
      const fileName = `Detail of Working Teaching Staff Male/Female,Regular/Contract
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
        .eq("ReportName", "Teaching Staff Report")
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
      const fileName = `teaching_staff_${SchoolID}_${month}_${year}.pdf`;
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
        ReportName: "Teaching Staff Report",
        FileName: fileName,
        created_at: new Date().toISOString(),
        FilePath: publicUrl,
        ReportType: "teaching_staff",
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
            Detail of Working Teaching Staff Male/Female,Regular/Contract Report
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
                    Name of Post
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"
                    colSpan="3"
                  >
                    Male Teacher
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border"
                    colSpan="3"
                  >
                    Female Teacher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border">
                    Total
                  </th>
                </tr>
                <tr>
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {row.nameOfPost}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.maleRegular || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.maleContract || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.maleDeputation || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.femaleRegular || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.femaleContract || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.femaleDeputation || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border text-center">
                      {row.total || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-5 text-gray-600">
            No teaching staff records found.
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

export default ReportDetailofWorkingTeachingStaff;
