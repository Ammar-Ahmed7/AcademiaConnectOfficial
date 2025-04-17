import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from "../../supabase-client.js"; // Adjust the path as necessary

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Check if we have a session when component mounts
  // (Supabase automatically includes the recovery token in the URL)
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      // If no session and no error, the user might not have clicked the link correctly
      if (!data.session && !error) {
        setErrorMsg("Invalid or expired password reset link. Please try again.");
      }
    };
    
    checkSession();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      
      setSuccessMsg("Password updated successfully!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setErrorMsg("An error occurred while resetting your password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-900">Reset Your Password</h1>
        </div>
        
        {errorMsg && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
            {successMsg}
            <p className="mt-2">Redirecting to login page...</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </div>
          
          <div className="text-center">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}