import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link

function AddStaff() {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Staff Member 1', cnic: '11111-1111111-1', details: 'Details for staff member 1...' },
    { id: 2, name: 'Staff Member 2', cnic: '22222-2222222-2', details: 'Details for staff member 2...' },
    { id: 3, name: 'Staff Member 3', cnic: '33333-3333333-3', details: 'Details for staff member 3...' },
  ]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openModal = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (staff.cnic && staff.cnic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="form-container bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Staff List</h2>
        <Link to="/school/add-staff-member" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add a Staff Member
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name or CNIC"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />

      <div className="staff-list">
        {filteredStaff.map(staff => (
          <div key={staff.id} className="staff-item p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer" onClick={() => openModal(staff)}>
            <h3 className="text-lg font-semibold">{staff.name}</h3>
          </div>
        ))}
      </div>

      {isModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Staff Details</h2>
            <h3 className="text-lg font-semibold">{selectedStaff.name}</h3>
            <p className="text-gray-700">{selectedStaff.details}</p>
            <div className="flex justify-end mt-4">
              <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStaff;
