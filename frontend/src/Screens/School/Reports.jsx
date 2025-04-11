import React, { useState } from 'react';

function Reports() {
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const profiles = [
    "Worker welfare school monthly profile",
    "Staff information",
    "Employee resignation/absent case",
    "Vacancy position",
    "Student strength",
    "Students availing transport facility",
    "Detail of working teaching staff (male / female)regular / contract",
    "Detail of working non teaching staff (male / female)regular / contract",
    "Details of working disabled staff"
  ];

  const profileFields = {
    "Worker welfare school monthly profile": [
      "Sr.No", "Personal No.", "Name with parentage", "Designation", "Category only for the post of S.S.T Phy, Math, Bio, Chem, Eng, Art",
      "BPS", "Date of birth", "Domicile", "Qualification", "Date of joining in department", "Date of joining in school",
      "Status | Regular, Contract, Deputation"
    ],
    "Staff information": [
      "Sr.No", "Personal No.", "Name with parentage", "Designation", "BPS", "Date of birth", "Domicile", "Qualification", "Date of joining in department", "Date of joining in school", "Status | Regular, Contract, Deputation"
    ],
    "Employee resignation/absent case": [
      "Sr.No", "Name with parentage", "Designation", "BPS", "Date of Resignation", "Date of absent from duty", "Status | Regular, Contract, Deputation"
    ],
    "Vacancy position": [
      "Sr.No", "Name of post", "B.P.S", "Sanctioned", "Working", "Vacant", "Excess"
    ],
    "Student strength": [
      "Sr.No", "Name of class", "No. of section", "Workers", "Private", "M.Tech Group", "Sci Group", "Arts Group", "Pre Medical", "Pre-Engg", "I.Com", "I.C.S", "Total"
    ],
    "Students availing transport facility": [
      "Sr.No", "Name of class", "No. of section", "Workers", "Private", "Total"
    ],
    "Detail of working teaching staff (male / female)regular / contract": [
      "Sr.No", "Name of post", "Male | Regular, Contract, Deputation", "Female | Regular, Contract, Deputation", "Total"
    ],
    "Detail of working non teaching staff (male / female)regular / contract": [
      "Sr.No", "Name of post", "Male | Regular, Contract, Deputation", "Female | Regular, Contract, Deputation", "Total"
    ],
    "Details of working disabled staff": [
      "Sr.No", "Name with parentage", "Designation", "BPS", "Date of joining in department", "Status | Regular, Contract", "Mode of | Open Merit, Disable Quota"
    ]
  };

  const handleProfileChange = (event) => {
    setSelectedProfile(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleLoadPreviousMonth = () => {
    console.log("Load Previous Month Report clicked");
    // Logic to load previous month's report
  };

  const handleEditReport = () => {
    console.log("Edit Report clicked");
    // Logic to enable editing of the report
  };

  const handleSendReport = () => {
    console.log("Send Report clicked");
    // Logic to send the report
  };


  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index); // Last 10 years


  return (
    <div className="dashboard p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="monthDropdown" className="block text-gray-700 text-sm font-bold mb-2">
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
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="yearDropdown" className="block text-gray-700 text-sm font-bold mb-2">
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
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>


      <div className="mb-4">
        <label htmlFor="profileDropdown" className="block text-gray-700 text-sm font-bold mb-2">
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
            <option key={index} value={profile}>{profile}</option>
          ))}
        </select>
      </div>

      {(selectedProfile && selectedMonth && selectedYear) && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Profile: {selectedProfile}</h2>
          <h3 className="text-md  mb-2">Month: {selectedMonth}, Year: {selectedYear}</h3>
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {profileFields[selectedProfile].map((field, index) => (
                  <th key={index} className="border border-gray-200 px-4 py-2 text-left">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Placeholder data rows - replace with actual data */}
              <tr>
                {profileFields[selectedProfile].map((_, index) => (
                  <td key={index} className="border border-gray-200 px-4 py-2">Data</td>
                ))}
              </tr>
              <tr>
                {profileFields[selectedProfile].map((_, index) => (
                  <td key={index} className="border border-gray-200 px-4 py-2">Data</td>
                ))}
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>

          <div className="mt-4 flex space-x-4">
            <button onClick={handleLoadPreviousMonth} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Load Previous Month Report
            </button>
            <button onClick={handleEditReport} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Edit
            </button>
            <button onClick={handleSendReport} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;