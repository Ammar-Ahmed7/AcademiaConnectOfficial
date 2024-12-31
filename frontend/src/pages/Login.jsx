import React, { useState } from 'react';
import { AccountCircle } from '@mui/icons-material'; // Import the icon
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login() {

  const[data, setdata] = useState({
    username:"", password:"",
  })
 
  const[showpassword, setshowpassword]=useState(false);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const url ='http://localhost:4000/teacher/signin'
      const res=await fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        // body:json.stringyfy(data, null, 2),
        body: JSON.stringify(data, null, 2),


      });
      const response=await res.json();
      alert("i am response ", response.status)
    }
    catch(error)
    {
      console.error("Error during login:", error);
    }
   
  
  };
  const handleshowpassword=()=>{
    setshowpassword(!showpassword);
    
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-green-400 bg-cover bg-center">
      <div className="form flex flex-col items-center p-6 w-[450px] h-[450px] backdrop-blur-md rounded-md border-2 border-[#1877f2]">
      <AccountCircle style={{ fontSize: 80, color: 'white', marginBottom: '20px' }} />
        <h4 className="text-2xl font-bold text-white mb-5">Log in to Account</h4>
        {/* Replace the i tag with AccountCircle icon */}
       
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          <div className="username w-[85%]">
            <input
              className="w-full p-4 rounded-full bg-white/30 text-white placeholder-white focus:outline-none"
              type="text"
              placeholder="Username"
              value={data.username}         
              
              onChange={(e)=>setdata({...data,username:e.target.value})}
              //onChange((e)=>setdata(...data, username: e.target.value))
            />
          </div>
          <div className="password w-[85%]">
            <input
              className="w-full p-4 rounded-full bg-white/30 text-white placeholder-white focus:outline-none"
              type={showpassword ?"text":"password" }
              placeholder="Password"
              value={data.password}
              onChange={(e)=>setdata({...data,password:e.target.value})}
            />
           <div onClick={handleshowpassword}> {showpassword?<VisibilityIcon />: <VisibilityOffIcon/>}</div>
          </div>
          <button
            className="w-[85%] p-4 rounded-full bg-[#1877f2] text-white font-bold cursor-pointer hover:bg-blue-600"
            type="submit"
          >
            Log in
          </button>
        </form>
        <div className="sug flex justify-between w-[85%] text-white mt-4">
          <div className="rem flex items-center">
            <input type="checkbox" id="rememberMe" className="mr-2" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <a href="#" className="forget text-[#1877f2] cursor-pointer">Forget password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
