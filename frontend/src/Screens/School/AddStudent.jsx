import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AddStudent() {
  // State to manage which view is active (add, total, absent, present)
  const [activeView, setActiveView] = useState('total'); // Default to showing the total students list

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Students</h2>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link to="/school/add-new-student">
          <div
            className={`p-4 rounded-lg shadow-md cursor-pointer ${activeView === 'add' ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'}`}
            onClick={() => setActiveView('add')}
          >
            <h3 className="text-lg font-semibold">Add a Student</h3>
            {/* You can add an icon here if desired */}
          </div>
        </Link>
        <div
          className={`p-4 rounded-lg shadow-md cursor-pointer ${activeView === 'total' ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'}`}
          onClick={() => setActiveView('total')}
        >
          <h3 className="text-lg font-semibold">Total Students</h3>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md cursor-pointer ${activeView === 'absent' ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'}`}
          onClick={() => setActiveView('absent')}
        >
          <h3 className="text-lg font-semibold">Absent Students</h3>
        </div>
        <div
          className={`p-4 rounded-lg shadow-md cursor-pointer ${activeView === 'present' ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'}`}
          onClick={() => setActiveView('present')}
        >
          <h3 className="text-lg font-semibold">Present Students</h3>
        </div>
      </div>

      {/* Conditional Rendering based on activeView */}
      {activeView === 'add' && (
        <div>
          {/* Placeholder for Add Student Form */}
          <p className="text-center">Add Student Form will go here.</p>
        </div>
      )}

      {(activeView === 'total' || activeView === 'absent' || activeView === 'present') && (
        <div>
          {/* Search/Filter Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, father's name, B-Form number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Student List Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-center">
              {activeView === 'total' && 'List of all students will be displayed here.'}
              {activeView === 'absent' && 'List of absent students will be displayed here.'}
              {activeView === 'present' && 'List of present students will be displayed here.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStudent;
