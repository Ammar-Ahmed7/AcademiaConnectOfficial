import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import JSZip from "jszip";

function CreatedReports() {
  const [reports, setReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("SavedReports") // adjust table name
      .select("*");

    if (error) console.error("Error fetching reports:", error);
    else setReports(data);
  };

  const handleCheckboxChange = (reportId) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleDelete = async (id) => {
    await supabase.from("SavedReports").delete().eq("id", id);
    fetchReports();
  };

  const handleSend = (id) => {
    // Placeholder for send logic
    alert(`Sending report ID: ${id}`);
  };

  const handleCreateZip = async () => {
    const zip = new JSZip();
    const selected = reports.filter((report) =>
      selectedReports.includes(report.id)
    );

    for (let report of selected) {
      // Fetch file content
      const { data, error } = await supabase.storage
        .from("report-files") // replace with your bucket
        .download(report.FilePath);

      if (error) continue;

      const blob = await data.blob();
      zip.file(report.FileName || `report-${report.id}.pdf`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Upload ZIP to Supabase Storage
    const fileName = `reports-${Date.now()}.zip`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("report-zips") // your target bucket
      .upload(fileName, zipBlob);

    if (uploadError) {
      console.error("Failed to upload zip:", uploadError);
      return;
    }

    // Save ZIP record to database
    await supabase.from("zipped_reports").insert({
      FileName: fileName,
      FilePath: uploadData.path,
      created_at: new Date().toISOString(),
      RecordCount: selected.length,
    });

    alert("ZIP created and uploaded successfully.");
    setSelectedReports([]);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Created Reports</h2>

      {selectedReports.length > 0 && (
        <button
          onClick={handleCreateZip}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create ZIP of Selected ({selectedReports.length})
        </button>
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
                />
              </th>
              <th className="border px-4 py-2">Report Name</th>
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="border px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleCheckboxChange(report.id)}
                  />
                </td>
                <td className="border px-4 py-2">{report.ReportName}</td>
                <td className="border px-4 py-2">{report.Month}</td>
                <td className="border px-4 py-2">{report.Year}</td>
                <td className="border px-4 py-2">Draft</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleSend(report.id)}
                    className="text-green-600 hover:text-green-800 mr-2"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {reports.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreatedReports;
