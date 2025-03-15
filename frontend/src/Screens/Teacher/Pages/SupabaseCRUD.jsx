// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import supabase from '../../../../supabase-client';

const SupabaseCrudPage = () => {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace 'your_table' with your actual table name
      const { data, error } = await supabase
        .from('Test')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Function to insert data into Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) return;
    setLoading(true);
    
    try {
      // Replace 'your_table' with your actual table name
      // .insert([{actual_column_name}])
      const { error } = await supabase
        .from('Test')
        .insert([{ text_content: text }]);

      if (error) throw error;
      
      // Clear input and refresh data
      setText('');
      fetchData();
    } catch (err) {
      console.error('Error inserting data:', err);
      setError('Failed to insert data');
    } finally {
      setLoading(false);
    }
  };

  // Function to start editing an item
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text_content);
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Function to update an item in Supabase
  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('Test')
        .update({ text_content: editText })
        .eq('id', id);

      if (error) throw error;
      
      // Exit edit mode and refresh data
      setEditingId(null);
      setEditText('');
      fetchData();
    } catch (err) {
      console.error('Error updating data:', err);
      setError('Failed to update data');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an item from Supabase
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('Test')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Error deleting data:', err);
      setError('Failed to delete data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Supabase CRUD App</h1>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex mb-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Data display */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Saved Items</h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        
        {!loading && items.length === 0 && (
          <p className="text-gray-500">No items found. Add some!</p>
        )}
        
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="py-3">
              {editingId === item.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow p-1 border rounded mr-2"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-1 text-sm"
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>{item.text_content}</span>
                  <div>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      disabled={loading || editingId !== null}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={loading || editingId !== null}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SupabaseCrudPage;