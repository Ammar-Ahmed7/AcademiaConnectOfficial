import React, { useState, useEffect } from "react";
import ReportWorkingDisabilities from "./Report-WorkingDisabilities";
import ReportStudentStrength from "./Report-StudentStrength";
import ReportVacanncy from "./Report-Vacanncy";
import ReportDetailofWorkingNonTeachingStaff from "./Report-DetailofWorkingNonTeachingStaff";
import ReportDetailofWorkingTeachingStaff from "./Report-DetailofWorkingTeachingStaff";
import ReportEmployeeResignAbsentcase from "./Report-Employee(Resign-Absent)case";
import ReportMonthlyProfile from "./Report-MonthlyProfile";
import ReportStaffInformation from "./Report-StaffInformation";
import ReportStudentAvailTransport from "./Report-StudentAvailTransport";
import CreatedReports from "./CreatedReports";
import { supabase } from "../../../supabase-client";

function Reports() {
  const [activeTab, setActiveTab] = useState("createNew");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [user, setUser] = useState(null);
  const [schoolInfo, setSchoolInfo] = useState({
    schoolId: "",
    schoolName: "",
  });

  useEffect(() => {
    const fetchUserAndSchool = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("School") // replace with your actual table name
          .select("SchoolID, SchoolName")
          .eq("user_id", user.id) // or whatever foreign key relates user to school
          .single();

        if (data) {
          setSchoolInfo({
            schoolId: data.SchoolID,
            schoolName: data.SchoolName,
          });
        } else {
          console.error("Failed to load school info", error);
        }
      }
    };

    fetchUserAndSchool();
  }, []);

  const profiles = [
    {
      name: "Worker welfare school monthly profile",
      component: ReportMonthlyProfile,
    },
    {
      name: "Staff information",
      component: ReportStaffInformation,
    },
    // {
    //   name: "Employee resignation/absent case",
    //   component: ReportEmployeeResignAbsentcase,
    // },
    {
      name: "Vacancy position",
      component: ReportVacanncy,
    },
    {
      name: "Student strength",
      component: ReportStudentStrength,
    },
    {
      name: "Students availing transport facility",
      component: ReportStudentAvailTransport,
    },
    {
      name: "Detail of working teaching staff (male / female)regular / contract",
      component: ReportDetailofWorkingTeachingStaff,
    },
    {
      name: "Detail of working non teaching staff (male / female)regular / contract",
      component: ReportDetailofWorkingNonTeachingStaff,
    },
    {
      name: "Details of working disabled staff",
      component: ReportWorkingDisabilities,
    },
  ];

  const handleProfileChange = (event) => {
    setSelectedProfile(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const months = [
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

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index
  ); // Last 10 years

  const renderCreateNewReport = () => (
    <div>
      <div className="mb-4 flex space-x-4">
        <div>
          <label
            htmlFor="monthDropdown"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Month:
          </label>
          <select
            id="monthDropdown"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="">-- Select Month --</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="yearDropdown"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Year:
          </label>
          <select
            id="yearDropdown"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="">-- Select Year --</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            <strong>School ID:</strong> {schoolInfo.schoolId} &nbsp;|&nbsp;
            <strong>School Name:</strong> {schoolInfo.schoolName}
          </p>
        </div>
      </div>

      {selectedMonth && selectedYear && (
        <div className="mb-4">
          <label
            htmlFor="profileDropdown"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Profile:
          </label>
          <select
            id="profileDropdown"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedProfile}
            onChange={handleProfileChange}
          >
            <option value="">-- Select a profile --</option>
            {profiles.map((profile, index) => (
              <option key={index} value={profile.name}>
                {profile.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedProfile && selectedMonth && selectedYear && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          {(() => {
            // const monthIndex = months.indexOf(selectedMonth) + 1;
            const monthIndex = months.indexOf(selectedMonth);

            const selectedProfileObj = profiles.find(
              (p) => p.name === selectedProfile
            );
            const ReportComponent = selectedProfileObj.component;

            return (
              <ReportComponent
                month={monthIndex}
                year={parseInt(selectedYear)}
                SchoolID={schoolInfo.schoolId}
                SchoolName={schoolInfo.schoolName}
              />
            );
          })()}
        </div>
      )}
    </div>
  );

  // Rest of the component remains the same...

  const renderSendReports = () => (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Send Reports</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Reports to Send:
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="report1" className="mr-2" />
            <label htmlFor="report1">Staff Information - January 2023</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="report2" className="mr-2" />
            <label htmlFor="report2">Student Strength - December 2022</label>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Recipient:
        </label>
        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option>Select recipient...</option>
          <option>Head Office</option>
          <option>Regional Office</option>
          <option>District Office</option>
        </select>
      </div>
      <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Send Selected Reports
      </button>
    </div>
  );

  const renderSentReports = () => (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Sent Reports History</h2>
      <div className="mb-4 flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Filter by Month:
          </label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">All Months</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Filter by Year:
          </label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">All Years</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2">Report Name</th>
              <th className="border border-gray-200 px-4 py-2">Month</th>
              <th className="border border-gray-200 px-4 py-2">Year</th>
              <th className="border border-gray-200 px-4 py-2">Sent Date</th>
              <th className="border border-gray-200 px-4 py-2">Recipient</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                Vacancy Position
              </td>
              <td className="border border-gray-200 px-4 py-2">November</td>
              <td className="border border-gray-200 px-4 py-2">2022</td>
              <td className="border border-gray-200 px-4 py-2">2022-11-15</td>
              <td className="border border-gray-200 px-4 py-2">Head Office</td>
              <td className="border border-gray-200 px-4 py-2">Delivered</td>
              <td className="border border-gray-200 px-4 py-2">
                <button className="text-blue-500 hover:text-blue-700 mr-2">
                  View
                </button>
                <button className="text-green-500 hover:text-green-700">
                  Resend
                </button>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">
                Employee Resignation
              </td>
              <td className="border border-gray-200 px-4 py-2">October</td>
              <td className="border border-gray-200 px-4 py-2">2022</td>
              <td className="border border-gray-200 px-4 py-2">2022-10-05</td>
              <td className="border border-gray-200 px-4 py-2">
                Regional Office
              </td>
              <td className="border border-gray-200 px-4 py-2">Read</td>
              <td className="border border-gray-200 px-4 py-2">
                <button className="text-blue-500 hover:text-blue-700 mr-2">
                  View
                </button>
                <button className="text-green-500 hover:text-green-700">
                  Resend
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="dashboard p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "createNew"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("createNew")}
        >
          Create a New Report
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "created"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("created")}
        >
          Created Reports
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "send"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("send")}
        >
          Send Reports
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "sent"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Reports
        </button>
      </div>

      {activeTab === "createNew" && renderCreateNewReport()}
      {activeTab === "created" && <CreatedReports />}
      {activeTab === "send" && renderSendReports()}
      {activeTab === "sent" && renderSentReports()}
    </div>
  );
}

export default Reports;
