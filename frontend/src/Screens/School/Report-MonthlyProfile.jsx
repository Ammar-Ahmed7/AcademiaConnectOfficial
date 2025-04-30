import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReportMonthlyProfile = ({ month, year, SchoolID, SchoolName }) => {
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

  const fetchTeachersData = async () => {
    setLoading(true);
    try {
      const { data: teachers, error } = await supabase
        .from("Teacher")
        .select("*")
        .order("TeacherID", { ascending: true })
        .eq("EmployeeType", "Teacher");
      if (error) throw error;

      const formattedData = teachers.map((teacher, index) => ({
        srNo: index + 1,
        id: teacher.TeacherID,
        nameWithPercentage: `${teacher.Name} ${
          teacher.FatherName ? `(${teacher.FatherName})` : ""
        }`,
        designation: teacher.Post || "N/A",
        category: teacher.TeacherSubject || "N/A",
        eps: teacher.BPS || "N/A",
        dateOfBirth: teacher.DateOfBirth || "N/A",
        domicile: teacher.Domicile || "N/A",
        qualification: teacher.Qualification || "N/A",
        dateJoiningDept: teacher.HireDate || "N/A",
        dateJoiningSchool: teacher.HireDate || "N/A",
        // regular: teacher.EmployementType === "Regular" && "Yes",
        // continued: teacher.EmployementType === "Contract" && "Yes",
        // deputation: teacher.EmployementType === "Deputation" && "Yes",
        regular: teacher.EmployementType === "Regular" ? "Yes" : "No",
        contract: teacher.EmployementType === "Contract" ? "Yes" : "No",
        deputation: teacher.EmployementType === "Deputation" ? "Yes" : "No",
        // regular: teacher.EmployementType === "Regular" ? "✓" : "-",
        // contract: teacher.EmployementType === "Contract" ? "✓" : "-",
        // deputation: teacher.EmployementType === "Deputation" ? "✓" : "-",
      }));

      setReportData(formattedData);
    } catch (err) {
      console.error("Error fetching teachers data:", err);
      showAlert("Failed to fetch data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachersData();
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

       // Use standard font to avoid issues
    pdf.setFont("helvetica","normal");

      pdf.setFontSize(16);
      pdf.text(
        `Monthly Profile Report`,
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
        { header: "Teacher ID", dataKey: "id" },
        { header: "Name with percentage", dataKey: "nameWithPercentage" },
        { header: "Designation", dataKey: "designation" },
        { header: "Category", dataKey: "category" },
        { header: "EPS", dataKey: "eps" },
        { header: "Date of Birth", dataKey: "dateOfBirth" },
        { header: "Domicile", dataKey: "domicile" },
        { header: "Qualification", dataKey: "qualification" },
        { header: "Date of Joining in Department", dataKey: "dateJoiningDept" },
        { header: "Date of Joining in School", dataKey: "dateJoiningSchool" },
        { header: "Regular", dataKey: "regular" },
        { header: "Contract", dataKey: "contract" },
        { header: "Deputation", dataKey: "deputation" },
      ];

      const rows = reportData.map((teacher) => ({
        srNo: teacher.srNo,
        id: teacher.id,
        nameWithPercentage: teacher.nameWithPercentage,
        designation: teacher.designation,
        category: teacher.category,
        eps: teacher.eps,
        dateOfBirth:
          teacher.dateOfBirth && teacher.dateOfBirth !== "N/A"
            ? new Date(teacher.dateOfBirth).toLocaleDateString()
            : "N/A",
        domicile: teacher.domicile,
        qualification: teacher.qualification,
        dateJoiningDept:
          teacher.dateJoiningDept && teacher.dateJoiningDept !== "N/A"
            ? new Date(teacher.dateJoiningDept).toLocaleDateString()
            : "N/A",
        dateJoiningSchool:
          teacher.dateJoiningSchool && teacher.dateJoiningSchool !== "N/A"
            ? new Date(teacher.dateJoiningSchool).toLocaleDateString()
            : "N/A",
        regular: teacher.regular,
        contract: teacher.contract,
        deputation: teacher.deputation,
      }));

      autoTable(pdf, {
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => columns.map((col) => row[col.dataKey])),
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

  const generatePDF = async () => {
    if (!window || !document) return;
    setGeneratingPDF(true);

    try {
      const { pdf } = await generatePDFDocument();
      const fileName = `Monthly Profile Report- ${SchoolID} -${month}- ${year}.pdf`;
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
        .eq("ReportName", "Monthly Profile Report")
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
      const fileName = `Monthly_profile_${SchoolID}_${month}_${year}.pdf`;
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
        ReportName: "Monthly Profile Report",
        FileName: fileName,
        created_at: new Date().toISOString(),
        FilePath: publicUrl,
        ReportType: "monthly_profile",
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
            Monthly Profile Report
          </h1>
          <p className="text-gray-600 text-sm">
            {SchoolName} |{" "}
            {new Date(year, month).toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </p>
        </div>

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
                    Sr.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Teacher ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name with percentage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    EPS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Domicile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Qualification
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date of Joining in Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date of Joining in School
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Regular
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Deputation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((teacher) => (
                  <tr key={teacher.srNo} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.nameWithPercentage}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.designation}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.eps}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.dateOfBirth && teacher.dateOfBirth !== "N/A"
                        ? new Date(teacher.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.domicile}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.qualification}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.dateJoiningDept &&
                      teacher.dateJoiningDept !== "N/A"
                        ? new Date(teacher.dateJoiningDept).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.dateJoiningSchool &&
                      teacher.dateJoiningSchool !== "N/A"
                        ? new Date(
                            teacher.dateJoiningSchool
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.regular}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.contract}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.deputation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-5 text-gray-600">
            No teacher records found.
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

export default ReportMonthlyProfile;
