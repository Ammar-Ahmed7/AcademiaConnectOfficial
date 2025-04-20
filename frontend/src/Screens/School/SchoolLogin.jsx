import { useState, useEffect } from 'react';
import supabase from "../../../supabase-client.js"; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

export default function LoginAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading true for initial session check
  const [resetPassword, setResetPassword] = useState(false);
  const navigate = useNavigate();

  // Check for existing session when component mounts
  useEffect(() => {
    checkSession();
  }, []);

  // Function to check if user is already logged in
  const checkSession = async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, get user ID
        const userId = session.user.id;

        // Check user role and redirect accordingly
        await checkUserRoleAndRedirect(userId);
      }
    } catch (err) {
      console.error("Error checking session:", err);
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  // Check user role and redirect accordingly
  const checkUserRoleAndRedirect = async (userId) => {
    try {
     
      // Check in Schools
      const { data: school } = await supabase
        .from('School')
        .select('Role')
        .eq('user_id', userId)
        .single();

      if (school) {
        return navigate('/school/dashboard');
      }

      await supabase.auth.signOut();
      // If we get here, user is authenticated but has no role
      setErrorMsg("User doesn't have the assigned role");
    } catch (err) {
      console.error("Error checking user role:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Login using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const user = data.user;

      // Check user role and redirect
      await checkUserRoleAndRedirect(user.id);
    } catch (err) {
      setErrorMsg("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      // Send password reset email using Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg("Password reset instructions sent to your email");
    } catch (err) {
      setErrorMsg("An error occurred while sending the password reset email");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator while checking session
  if (loading && !errorMsg) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            {resetPassword ? 'Reset Password' : 'Login'}
          </h1>
        </div>
        
        {errorMsg && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
            {successMsg}
          </div>
        )}
        
        {resetPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
              <p className="mt-2 text-sm text-gray-600">
                We will send you an email with instructions to reset your password.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </div>
            
            <div className="text-center">
              <button 
                type="button"
                onClick={() => setResetPassword(false)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setResetPassword(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </button>
              </div>
              
            </div>
          </form>
        )}
      </div>
    </div>
  );
}