import React, { useState } from 'react';
import { AccountCircle } from '@mui/icons-material'; // Import the icon
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Signup() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [confirmPassword, setConfirmPassword] = useState(''); // Added confirm password state
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Here you can add functionality to handle signup, like sending data to an API
    alert('Signup successful');
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-green-400 bg-cover bg-center">
      <div className="form flex flex-col items-center p-6 w-[450px] h-[600px] backdrop-blur-md rounded-md border-2 border-[#1877f2]">
        <AccountCircle style={{ fontSize: 80, color: 'white', marginBottom: '20px' }} />
        <h4 className="text-2xl font-bold text-white mb-5">Create an Account</h4>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
         
          <div className="fullName w-[85%]">
            <input
              className="w-full p-4 rounded-full bg-white/30 text-white placeholder-white focus:outline-none"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className=" w-[85%]">
            <input
              className="w-full p-4 rounded-full bg-white/30 text-white placeholder-white focus:outline-none"
              type="email"
              placeholder="Email"

              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          
          <div className="password w-[85%] relative">
            <input
              className="w-full p-4 rounded-full bg-white/30 text-white placeholder-white focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div 
              onClick={handleShowPassword} 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-white"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>

          <div className="confirm-password w-[85%] relative">
            <input
              className="w-full p-4 rounded-full bg-white/30 text-white placeholder-white focus:outline-none"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div 
              onClick={handleShowConfirmPassword} 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-white"
            >
              {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>

          <button
            className="w-[85%] p-4 rounded-full bg-[#1877f2] text-white font-bold cursor-pointer hover:bg-blue-600"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        
        <div className="sug flex justify-between w-[85%] text-white mt-4">
          <div className="rem flex items-center">
            <input type="checkbox" id="agreeTerms" className="mr-2" />
            <label htmlFor="agreeTerms">I agree to the Terms and Conditions</label>
          </div>
          <a href="#" className="forget text-[#1877f2] cursor-pointer">Already have an account?</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
