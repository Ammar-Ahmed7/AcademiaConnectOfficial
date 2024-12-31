import React from 'react';

function AddStd() {
    return (
        <div className='flex flex-col gap-y-8 justify-center items-center w-full h-screen'>
            <h1 className="text-2xl font-bold">Add Student</h1>
            
            <form className='flex flex-col gap-y-8'>
                <div className='flex flex-row gap-x-7 items-center'>
                    <label htmlFor="firstName">First Name</label>
                    <input 
                        type="text" 
                        id="firstName" 
                        placeholder='First Name' 
                        className="border border-gray-300 rounded px-2 py-1"
                        required 
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        placeholder='Last Name' 
                        className="border border-gray-300 rounded px-2 py-1"
                        required 
                    />
                </div>

                <div className='flex flex-row gap-x-7 items-center'>
                    <label htmlFor="fatherName">Father's Name</label>
                    <input 
                        type="text" 
                        id="fatherName" 
                        placeholder='Father Name' 
                        className="border border-gray-300 rounded px-2 py-1"
                        required 
                    />
                </div>

                <div className='flex flex-row gap-x-7 items-center'>
                    <label htmlFor="address">Address</label>
                    <input 
                        type="text" 
                        id="address" 
                        placeholder='Address' 
                        className="border border-gray-300 rounded px-2 py-1"
                        required 
                    />
                </div>

                <div className='flex flex-row gap-x-7 items-center'>
                    <label htmlFor="studentId">Student ID</label>
                    <input 
                        type="text" 
                        id="studentId" 
                        placeholder='Student ID' 
                        className="border border-gray-300 rounded px-2 py-1"
                        required 
                    />
                    
                    <label htmlFor="classYear">Class Level</label>
                    <input 
                        type="number" 
                        id="classYear" 
                        min={1} max={10} 
                        placeholder="Class Level"
                        className="border border-gray-300 rounded px-2 py-1"
                        required 
                    />
                </div>

                <div className='flex flex-row gap-x-7 items-center'>
                    <div className='flex flex-row gap-x-2 items-center'>
                        <label>Gender</label>
                        <div className='flex items-center'>
                            <label htmlFor="male">Male</label>
                            <input 
                                type="radio" 
                                name="gender" 
                                id="male" 
                                value="male"
                                className="ml-1" 
                                required 
                            />
                        </div>
                        <div className='flex items-center'>
                            <label htmlFor="female">Female</label>
                            <input 
                                type="radio" 
                                name="gender" 
                                id="female" 
                                value="female"
                                className="ml-1" 
                                required 
                            />
                        </div>
                    </div>

                    <div className='flex flex-row gap-x-2 items-center'>
                        <label htmlFor="admissionYear">Year of Admission</label>
                        <input 
                            type="number" 
                            id="admissionYear" 
                            placeholder='2024' 
                            min={2020} max={2024} 
                            className="border border-gray-300 rounded px-2 py-1"
                            required 
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-x-7 items-center'>
                    <div className='flex flex-col'>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input 
                            type="text" 
                            id="phoneNumber" 
                            placeholder='Phone Number' 
                            className="border border-gray-300 rounded px-2 py-1"
                            required 
                        />
                    </div>
                    
                    <div className='flex flex-col'>
                        <label htmlFor="dob">Date of Birth</label>
                        <input 
                            type="date" 
                            id="dob" 
                            className="border border-gray-300 rounded px-2 py-1"
                            required 
                        />
                    </div>
                </div>

                <div className='flex flex-row gap-x-7 items-center'>
                    <div className='flex flex-col'>
                        <label htmlFor="emergencyNumber">Emergency Number</label>
                        <input 
                            type="text" 
                            id="emergencyNumber" 
                            placeholder='Emergency Number' 
                            className="border border-gray-300 rounded px-2 py-1"
                            required 
                        />
                    </div>
                    
                    <div className='flex flex-col'>
                        <label htmlFor="relationship">Relationship</label>
                        <input 
                            type="text" 
                            id="relationship" 
                            placeholder='Relationship' 
                            className="border border-gray-300 rounded px-2 py-1"
                            required 
                        />
                    </div>
                </div>

                <button type="submit" className='px-4 py-2 bg-blue-500 text-white rounded'>Submit</button>
            </form>
        </div>
    );
}

export default AddStd;
