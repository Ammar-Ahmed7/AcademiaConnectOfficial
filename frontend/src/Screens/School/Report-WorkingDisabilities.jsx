import { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReportWorkingDisabilities = ({ month, year, SchoolID, SchoolName }) => {
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

  const fetchDisabledTeachersAndStaff = async () => {
    setLoading(true);
    try {
      // Fetch Teachers
      const { data: teachers, error: teacherError } = await supabase
        .from("Teacher")
        .select("*")
        .eq("Disability", "Yes")
        .order("TeacherID", { ascending: true });

      if (teacherError) throw teacherError;

      // Fetch Staff
      const { data: staff, error: staffError } = await supabase
        .from("staff")
        .select("*")
        .eq("disability", "Yes")
        .order("id", { ascending: true });

      if (staffError) throw staffError;

      // Format Teachers
      const formattedTeachers = teachers.map((teacher, index) => ({
        srNo: index + 1,
        name: `${teacher.Name} ${
          teacher.FatherName ? `(${teacher.FatherName})` : ""
        }`,
        designation: teacher.EmployeeType || "N/A",
        bps: teacher.BPS || "N/A",
        joiningDate: teacher.HireDate || "N/A",
        status: teacher.EmployementType || "N/A",
        mode: teacher.Disability === "Yes" ? "Disable Quota" : "Open Merit",
      }));

      // Format Staff
      const formattedStaff = staff.map((staffMember, index) => ({
        srNo: formattedTeachers.length + index + 1,
        name: `${staffMember.full_name} ${
          staffMember.father_name ? `(${staffMember.father_name})` : ""
        }`,
        designation: staffMember.designation || "N/A",
        bps: staffMember.BPS || "N/A",
        joiningDate: staffMember.joining_date || "N/A",
        status: staffMember.employment_type || "N/A",
        mode: staffMember.disability === "Yes" ? "Disable Quota" : "Open Merit",
      }));

      // Combine teachers + staff
      const combinedData = [...formattedTeachers, ...formattedStaff];
      setReportData(combinedData);
    } catch (err) {
      console.error("Error fetching disabled teachers/staff:", err);
      showAlert("Failed to fetch data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisabledTeachersAndStaff();
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
        `Disabled Working Staff Report`,
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
        { header: "Name with parentage", dataKey: "name" },
        { header: "Designation", dataKey: "designation" },
        { header: "BPS", dataKey: "bps" },
        { header: "Date of joining", dataKey: "joiningDate" },
        { header: "Status", dataKey: "status" },
        { header: "Mode", dataKey: "mode" },
      ];

      const rows = reportData.map((teacher) => ({
        srNo: teacher.srNo,
        name: teacher.name,
        designation: teacher.designation,
        bps: teacher.bps,
        joiningDate:
          teacher.joiningDate && teacher.joiningDate !== "N/A"
            ? new Date(teacher.joiningDate).toLocaleDateString()
            : "N/A",
        status: teacher.status,
        mode: teacher.mode,
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
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 30 },
          3: { cellWidth: 15 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 },
          6: { cellWidth: 30 },
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
      const fileName = `Disabled Working Staff Report- ${SchoolID} -${month}- ${year}.pdf`;
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
        .eq("ReportName", "Disabled Working Staff Report")
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
      const fileName = `Disabled_staff_${SchoolID}_${month}_${year}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("reports")
        .upload(fileName, pdfBlob);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("reports")
        .getPublicUrl(fileName);
      // if (urlError || !urlData?.publicUrl) {
      //   throw new Error("Could not get public URL of uploaded file");
      // }

      const publicUrl = urlData?.publicUrl || "";

      const { error: dbError } = await supabase.from("SavedReports").insert({
        Month: month.toString(), // Match your text column type
        Year: parseInt(year), // Match your int8 column type
        ReportName: "Disabled Working Staff Report",
        FileName: fileName,
        created_at: new Date().toISOString(),
        FilePath: publicUrl,
        ReportType: "disability",
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
        {/* <h1 className="text-2xl font-semibold text-gray-800 mb-3 md:mb-0">
          Details of Working Disabled Staff
        </h1> */}

        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-gray-800">
            Disabled Working Staff Report
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
                    Name with parentage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    BPS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date of joining
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Mode
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
                      {teacher.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.designation}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.bps}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.joiningDate && teacher.joiningDate !== "N/A"
                        ? new Date(teacher.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.status}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {teacher.mode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-5 text-gray-600">
            No disabled teacher records found.
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

export default ReportWorkingDisabilities;
