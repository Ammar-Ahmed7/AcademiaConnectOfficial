import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { supabase } from "../../../supabase-client";

const ReportVacanncy = ({ month, year }) => {
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    teachingStaff: { sanctioned: 0, working: 0, vacant: 0, excess: 0 },
    nonTeachingStaff: { sanctioned: 0, working: 0, vacant: 0, excess: 0 },
    total: { sanctioned: 0, working: 0, vacant: 0, excess: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [savingToDb, setSavingToDb] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Mapping between post names in dummy data and Supabase data
  const postNameMapping = {
    Principal: "Principal",
    "Vice Principal": "Vice Principal",
    "Subject Specialist": "Subject Specialist",
    "S.S.T (Science + Arts)": "S.S.T/SSE/Acting Principal",
    "S.S.T (I.T)": "S.S.T(I.T)",
    "Arabic Teacher": "Arabic Teacher",
    "E.S.T/E.S.E": "E.S.T/E.S.E",
    "P.T.I": "P.T.I",
    Superintendent: "Superintendent",
    Accountant: "Accountant",
    "Senior Clerk": "Senior Clerk",
    "Assistant (Caretaker)": "Assistant/Caretaker",
    "Assistant Accountant": "Account Assistant",
    "Assistant Librarian": "Library Assistant",
    "Laboratory Assistant": "Laboratory Attendant", // Note: Different name
    "Junior Clerk": "Junior Clerk",
    "Library Clerk": "Library Clerk",
    Storekeeper: "Store Keeper",
    "Laboratory Attendant": "Laboratory Attendant",
    Driver: "Driver",
    Chowkidar: "Chowkidar",
    "Naib Qasid": "Naib Qasid",
    Mail: "Mail",
    Aya: "Aya",
    Escort: "Escort",
    Sweeper: "Sweeper",
  };

  // Update the Sactions function to handle teaching staff correctly
  // Simplified teaching post mappings with better matching
  const teachingPostMappings = {
    "Subject Specialist": { matches: ["subject specialist"], exact: true },
    "S.S.T (Science + Arts)": {
      matches: ["s.s.t", "sse", "acting principal"],
      exact: false,
    },
    "S.S.T (I.T)": { matches: ["s.s.t(i.t)"], exact: true },
    "Arabic Teacher": { matches: ["arabic teacher"], exact: true },
    "E.S.T/E.S.E": { matches: ["e.s.t", "e.s.e"], exact: true },
    "P.T.I": { matches: ["p.t.i"], exact: true },
  };

  const Sactions = async () => {
    try {
      setLoading(true);

      // Parallel data fetching
      const [
        { data: sanctionedData, error: sanctionedError },
        { data: teachers, error: teachersError },
        { data: staff, error: staffError },
      ] = await Promise.all([
        supabase
          .from("School")
          .select("NoOfSactions")
          .order("SchoolID", { ascending: true }),
        supabase.from("Teacher").select("Post"),
        supabase.from("staff").select("designation"),
      ]);

      // Error handling
      if (sanctionedError)
        throw new Error(`Sanctioned data: ${sanctionedError.message}`);
      if (teachersError)
        throw new Error(`Teachers data: ${teachersError.message}`);
      if (staffError) throw new Error(`Staff data: ${staffError.message}`);

      // Count working teaching staff
      const teachingWorkingCounts = {};
      Object.entries(teachingPostMappings).forEach(
        ([reportPost, { matches, exact }]) => {
          teachingWorkingCounts[reportPost] = teachers.filter((teacher) => {
            const post = teacher.Post?.toLowerCase() || "";
            return matches.some((match) =>
              exact ? post === match : post.includes(match)
            );
          }).length;
        }
      );

      // Count non-teaching staff
      const nonTeachingWorkingCounts = {};
      const nonTeachingPosts = dummyDataStructure.filter(
        (item) => !item.isTeachingStaff
      );

      nonTeachingPosts.forEach((item) => {
        const designation = postNameMapping[item.postName]?.toLowerCase();
        nonTeachingWorkingCounts[item.postName] = staff.filter(
          (s) => s.designation?.toLowerCase() === designation
        ).length;
      });

      // Principal counts
      const principalCount = teachers.filter(
        (t) => t.Post?.toLowerCase() === "principal"
      ).length;

      const vicePrincipalCount = teachers.filter(
        (t) => t.Post?.toLowerCase() === "vice principal"
      ).length;

      // Generate report data
      const reportData = dummyDataStructure.map((item) => {
        const supabasePostName = postNameMapping[item.postName];
        const sanctioned =
          sanctionedData?.[0]?.NoOfSactions?.[supabasePostName]?.Sanctioned ||
          0;

        let working;
        if (item.isTeachingStaff) {
          working = teachingWorkingCounts[item.postName] || 0;
        } else if (item.postName === "Principal") {
          working = principalCount;
        } else if (item.postName === "Vice Principal") {
          working = vicePrincipalCount;
        } else {
          working = nonTeachingWorkingCounts[item.postName] || 0;
        }

        return {
          ...item,
          sanctioned,
          working,
          vacant: Math.max(sanctioned - working, 0),
          excess: Math.max(working - sanctioned, 0),
        };
      });

      setReportData(reportData);
      setSummaryData(calculateSummaryData(reportData));
    } catch (err) {
      console.error("Data loading error:", err);
      showAlert(`Error loading data: ${err.message}`, "error");
      // You might want to keep minimal fallback data structure here
      const fallbackData = minimalFallbackStructure.map((item) => ({
        ...item,
        sanctioned: 0,
        working: 0,
        vacant: 0,
        excess: 0,
      }));
      setReportData(fallbackData);
      setSummaryData(calculateSummaryData(fallbackData));
    } finally {
      setLoading(false);
    }
  };

  // Minimal structure definition (instead of full dummy data)
  const minimalFallbackStructure = [
    { postName: "Principal", bps: 18, isTeachingStaff: false },
    // ... other post definitions
  ];
  useEffect(() => {
    Sactions();
  }, []);

  const calculateSummaryData = (data) => {
    const teachingStaff = { sanctioned: 0, working: 0, vacant: 0, excess: 0 };
    const nonTeachingStaff = {
      sanctioned: 0,
      working: 0,
      vacant: 0,
      excess: 0,
    };
    const total = { sanctioned: 0, working: 0, vacant: 0, excess: 0 };

    data.forEach((item) => {
      const target = item.isTeachingStaff ? teachingStaff : nonTeachingStaff;

      target.sanctioned += item.sanctioned;
      target.working += item.working;
      target.vacant += item.vacant;
      target.excess += item.excess;
    });

    // Calculate totals
    total.sanctioned = teachingStaff.sanctioned + nonTeachingStaff.sanctioned;
    total.working = teachingStaff.working + nonTeachingStaff.working;
    total.vacant = teachingStaff.vacant + nonTeachingStaff.vacant;
    total.excess = teachingStaff.excess + nonTeachingStaff.excess;

    return { teachingStaff, nonTeachingStaff, total };
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  // ... (rest of the component code remains the same, including generatePDFDocument, generatePDF, savePDFToDatabase functions)
  const generatePDFDocument = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.setFontSize(16);
      pdf.text(
        `Vacancy Report - ${new Date(year, month - 1).toLocaleString(
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

      // Define columns for the table
      const columns = [
        { header: "S.No", dataKey: "srNo" },
        { header: "Name of Post", dataKey: "postName" },
        { header: "B.P.S", dataKey: "bps" },
        { header: "Sanctioned", dataKey: "sanctioned" },
        { header: "Working", dataKey: "working" },
        { header: "Vacant", dataKey: "vacant" },
        { header: "Excess", dataKey: "excess" },
      ];

      // Prepare rows data
      const rows = reportData.map((item, index) => ({
        srNo: index + 1,
        postName: item.postName,
        bps: item.bps,
        sanctioned: item.sanctioned,
        working: item.working,
        vacant: item.vacant,
        excess: item.excess,
      }));

      // Add the main table
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
      });

      // Add summary table
      const summaryY = pdf.lastAutoTable.finalY + 10;

      const summaryColumns = [
        { header: "Staff Type", dataKey: "staffType" },
        { header: "Sanctioned", dataKey: "sanctioned" },
        { header: "Working", dataKey: "working" },
        { header: "Vacant", dataKey: "vacant" },
        { header: "Excess", dataKey: "excess" },
      ];

      const summaryRows = [
        {
          staffType: "Teaching Staff",
          sanctioned: summaryData.teachingStaff.sanctioned,
          working: summaryData.teachingStaff.working,
          vacant: summaryData.teachingStaff.vacant,
          excess: summaryData.teachingStaff.excess,
        },
        {
          staffType: "Non-Teaching Staff",
          sanctioned: summaryData.nonTeachingStaff.sanctioned,
          working: summaryData.nonTeachingStaff.working,
          vacant: summaryData.nonTeachingStaff.vacant,
          excess: summaryData.nonTeachingStaff.excess,
        },
        {
          staffType: "Total",
          sanctioned: summaryData.total.sanctioned,
          working: summaryData.total.working,
          vacant: summaryData.total.vacant,
          excess: summaryData.total.excess,
        },
      ];

      autoTable(pdf, {
        head: [summaryColumns.map((col) => col.header)],
        body: summaryRows.map((row) =>
          summaryColumns.map((col) => row[col.dataKey])
        ),
        startY: summaryY,
        theme: "grid",
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontStyle: "bold",
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
      pdf.save("vacancy_report.pdf");
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
        .eq("ReportName", "Vacancy Report")
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
      const fileName = `vacancy_report_${month}_${year}.pdf`;

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
        ReportName: "Vacancy Report",
        FileName: fileName,
        created_at: new Date().toISOString(),
        FilePath: publicUrl,
        ReportType: "vacancy",
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
          Vacancy Report
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
          <>
            <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Sr.No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Name of Post
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      B.P.S
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Sanctioned
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Working
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Vacant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Excess
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                        {item.postName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                        {item.bps}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                        {item.sanctioned}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                        {item.working}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                        {item.vacant}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                        {item.excess}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Staff Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Sanctioned
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Working
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Vacant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Excess
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 font-medium">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      Teaching Staff
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.teachingStaff.sanctioned}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.teachingStaff.working}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.teachingStaff.vacant}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.teachingStaff.excess}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 font-medium">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      Non-Teaching Staff
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.nonTeachingStaff.sanctioned}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.nonTeachingStaff.working}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.nonTeachingStaff.vacant}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.nonTeachingStaff.excess}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 font-bold bg-gray-100">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      Total
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.total.sanctioned}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.total.working}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.total.vacant}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border">
                      {summaryData.total.excess}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center p-5 text-gray-600">
            No vacancy data found.
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

export default ReportVacanncy;
