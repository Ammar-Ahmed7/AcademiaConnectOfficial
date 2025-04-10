import React, { useState } from 'react';

function PublishNotice({ onPublish }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all'); // Options: all, students, staff

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title && content) {
      onPublish({ title, content, audience });
      setTitle('');
      setContent('');
      setAudience('all'); // Reset audience to default after submission
      alert('Notice published successfully!'); // Basic feedback for successful submission
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="form-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Publish Notice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="noticeTitle" className="block text-sm font-medium text-gray-700">Notice Title</label>
          <input
            type="text"
            id="noticeTitle"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="noticeContent" className="block text-sm font-medium text-gray-700">Notice Content</label>
          <textarea
            id="noticeContent"
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="noticeAudience" className="block text-sm font-medium text-gray-700">Audience</label>
          <select
            id="noticeAudience"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="all">All Students and Staff</option>
            <option value="students">Students Only</option>
            <option value="staff">Staff Only</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Publish Notice
        </button>
      </form>
    </div>
  );
}

export default PublishNotice;
