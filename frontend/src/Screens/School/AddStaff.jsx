// src/Screens/School/ManageStaff.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate }         from 'react-router-dom';
import { supabase} from './supabaseClient'

export default function ManageStaff() {
  const PAGE_SIZE = 50;
  const navigate = useNavigate();

  const [view, setView]     = useState('total');     // 'total' | 'rusticated'
  const [staff, setStaff]   = useState([]);
  const [count, setCount]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [view, search, page]);

  async function fetchStaff() {
    setLoading(true);
  
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    const { data: schoolData, error: schoolError } = await supabase
      .from('School')
      .select('SchoolID')
      .eq('user_id', userId)
      .single();
      console.log("Fetched schoolData:", schoolData);
    if (schoolError) {
      console.error('School fetch error:', schoolError);
      setLoading(false);
      return;
    }
  
    let qb = supabase
      .from('staff')
      .select('id, full_name, father_name', { count: 'exact' })
      .eq('school_id', schoolData.SchoolID);  // ✅ filter by school
      
  
    if (search) {
      qb = qb.or(
        `full_name.ilike.%${search}%` +
        `,father_name.ilike.%${search}%`
      );
    }
  
    qb = qb.eq('is_rusticated', view === 'rusticated');
  
    const from = (page - 1) * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;
    qb = qb.range(from, to).order('full_name');
  
    const { data, error, count: total } = await qb;
    console.log("Fetched staff result:", data);  // ✅ Log actual rows
  
    if (error) {
      console.error('Fetch error:', error);
    } else {
      setStaff(data || []);
      setCount(total || 0);
    }
  
    setLoading(false);
  }
  
  

  const totalPages = Math.ceil(count / PAGE_SIZE) || 1;

  const rusticate = async (id) => {
    const reason = window.prompt('Reason for rustication?');
    if (!reason) return;
    const { error } = await supabase
      .from('staff')
      .update({ is_rusticated: true, rusticate_reason: reason })
      .eq('id', id);
    if (error) console.error('Rusticate failed:', error);
    else fetchStaff();
  };

  const reregister = async (id) => {
    const { error } = await supabase
      .from('staff')
      .update({ is_rusticated: false, rusticate_reason: null })
      .eq('id', id);
    if (error) console.error('Re-register failed:', error);
    else fetchStaff();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Staff</h2>

      {/* Nav cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="/school/add-staff-member">
          <div
            className={`p-4 rounded-lg shadow cursor-pointer ${
              view === 'add' ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'
            }`}
            onClick={() => setView('add')}
          >
            <h3 className="font-semibold">Add Staff Member</h3>
          </div>
        </Link>
        <div
          className={`p-4 rounded-lg shadow cursor-pointer ${
            view === 'total' ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'
          }`}
          onClick={() => setView('total')}
        >
          <h3 className="font-semibold">Total Staff</h3>
        </div>
        <div
          className={`p-4 rounded-lg shadow cursor-pointer ${
            view === 'rusticated' ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'
          }`}
          onClick={() => setView('rusticated')}
        >
          <h3 className="font-semibold">Rusticated Staff</h3>
        </div>
      </div>

      {/* List / search */}
      {(view === 'total' || view === 'rusticated') && (
        <>
          <input
            type="text"
            placeholder="Search by name or father's name…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full mb-4 p-2 border rounded"
          />

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Father's Name</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="p-4 text-center">Loading…</td></tr>
                ) : staff.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No staff found.
                    </td>
                  </tr>
                ) : staff.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="p-2">{s.full_name}</td>
                    <td className="p-2">{s.father_name}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => navigate(`/school/edit-staff/${s.id}`)}
                        className="text-amber-600 hover:underline"
                      >
                        Edit
                      </button>
                      {view === 'rusticated' ? (
                        <button
                          onClick={() => reregister(s.id)}
                          className="text-green-600 hover:underline"
                        >
                          Re‑register
                        </button>
                      ) : (
                        <button
                          onClick={() => rusticate(s.id)}
                          className="text-red-600 hover:underline"
                        >
                          Rusticate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage(p => Math.max(p-1,1))}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              ← Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(p+1, totalPages))}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
