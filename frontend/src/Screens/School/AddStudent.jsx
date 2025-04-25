// ManageStudents.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function ManageStudents() {
  const PAGE_SIZE = 50
  const navigate = useNavigate()

  const [activeView, setActiveView]     = useState('total')  // "total" or "rusticated"
  const [students, setStudents]         = useState([])
  const [totalCount, setTotalCount]     = useState(0)
  const [page, setPage]                 = useState(1)
  const [searchQuery, setSearchQuery]   = useState('')
  const [loading, setLoading]           = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [activeView, searchQuery, page])

  async function fetchStudents() {
    setLoading(true)

    let qb = supabase
      .from('students')
      .select('id, full_name, father_name, b_form_no, admission_class', { count: 'exact' })

    // search
    if (searchQuery) {
      qb = qb.or([
        `full_name.ilike.%${searchQuery}%`,
        `father_name.ilike.%${searchQuery}%`,
        `b_form_no.ilike.%${searchQuery}%`
      ].join(','))
    }

    // rusticated vs total
    if (activeView === 'rusticated') {
      qb = qb.eq('is_rusticated', true)
    } else {
      // total (and any other view) shows only non‑rusticated
      qb = qb.eq('is_rusticated', false)
    }

    // pagination
    const from = (page - 1) * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1
    qb = qb.range(from, to)

    const { data, error, count } = await qb
    if (error) {
      console.error('Error fetching students:', error)
      alert('Failed to load students: ' + error.message)
    } else {
      setStudents(data || [])
      setTotalCount(count || 0)
    }

    setLoading(false)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const rusticate = async id => {
    const reason = prompt('Reason for rustication:')
    if (!reason) return

    const { error } = await supabase
      .from('students')
      .update({ is_rusticated: true, rusticate_reason: reason })
      .eq('id', id)

    if (error) {
      console.error('Rusticate failed:', error)
      alert('Rustication failed: ' + error.message)
    } else {
      alert('Student rusticated.')
      fetchStudents()
    }
  }

  const reregister = async id => {
    const { error } = await supabase
      .from('students')
      .update({ is_rusticated: false, rusticate_reason: null })
      .eq('id', id)

    if (error) {
      console.error('Re‑register failed:', error)
      alert('Re‑registration failed: ' + error.message)
    } else {
      alert('Student re‑registered.')
      fetchStudents()
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Students</h2>

      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`p-4 rounded shadow cursor-pointer ${activeView==='add'? 'bg-amber-100':'bg-white'}`}
          onClick={()=> navigate('/school/add-new-student')}
        >
          <h3 className="font-semibold">Add a Student</h3>
        </div>
        <div
          className={`p-4 rounded shadow cursor-pointer ${activeView==='total'? 'bg-amber-100':'bg-white'}`}
          onClick={()=> setActiveView('total')}
        >
          <h3 className="font-semibold">Total Students</h3>
        </div>
        <div
          className={`p-4 rounded shadow cursor-pointer ${activeView==='rusticated'? 'bg-amber-100':'bg-white'}`}
          onClick={()=> setActiveView('rusticated')}
        >
          <h3 className="font-semibold">Rusticated Students</h3>
        </div>
      </div>

      {/* Search + Table */}
      {activeView !== 'add' && (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
            placeholder="Search by name, father's name or B‑Form…"
            className="w-full p-2 mb-4 border rounded"
          />

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Father’s Name</th>
                  <th className="p-2 text-left">B‑Form No</th>
                  <th className="p-2 text-left">Class</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? <tr><td colSpan="5" className="p-4 text-center">Loading…</td></tr>
                  : students.length === 0
                    ? <tr><td colSpan="5" className="p-4 text-center">No students found.</td></tr>
                    : students.map(s => (
                      <tr key={s.id} className="border-t">
                        <td className="p-2">{s.full_name}</td>
                        <td className="p-2">{s.father_name}</td>
                        <td className="p-2">{s.b_form_no}</td>
                        <td className="p-2">{s.admission_class}</td>
                        <td className="p-2 space-x-2">
                          <button
                            className="text-amber-600 hover:underline"
                            onClick={()=> navigate(`/school/edit-student/${s.id}`)}
                          >Edit</button>
                          {activeView === 'rusticated'
                            ? <button
                                className="text-green-600 hover:underline"
                                onClick={()=> reregister(s.id)}
                              >Re‑register</button>
                            : <button
                                className="text-red-600 hover:underline"
                                onClick={()=> rusticate(s.id)}
                              >Rusticate</button>
                          }
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={()=> setPage(p=> p-1)}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >← Prev</button>
            <span>Page {page} of {totalPages||1}</span>
            <button
              onClick={()=> setPage(p=> p+1)}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >Next →</button>
          </div>
        </>
      )}
    </div>
  )
}
