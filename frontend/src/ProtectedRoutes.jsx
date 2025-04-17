import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import supabase from "../supabase-client.js"; // Adjust the path as necessary

// Protected route component for any authenticated user
export function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

// Role-specific protected routes
export function TeacherRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkTeacherRole();
  }, []);

  async function checkTeacherRole() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthorized(false);
        return;
      }

      const userId = session.user.id;

      // Check if user is a teacher
      const { data: teacher } = await supabase
        .from('Teacher')
        .select('Role')
        .eq('user_id', userId)
        .single();

      setAuthorized(!!teacher);
    } catch (error) {
      console.error("Error checking teacher role:", error);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/teacher-login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAdminRole();
  }, []);

  async function checkAdminRole() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthorized(false);
        return;
      }

      const userId = session.user.id;

      // Check if user is an admin
      const { data: admin } = await supabase
        .from('Admin')
        .select('Role')
        .eq('user_id', userId)
        .single();

      setAuthorized(!!admin);
    } catch (error) {
      console.error("Error checking admin role:", error);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export function SchoolRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkSchoolRole();
  }, []);

  async function checkSchoolRole() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthorized(false);
        return;
      }

      const userId = session.user.id;

      // Check if user is a student
      const { data: school } = await supabase
        .from('School')
        .select('Role')
        .eq('user_id', userId)
        .single();

      setAuthorized(!!school);
    } catch (error) {
      console.error("Error checking school role:", error);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/school-login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}