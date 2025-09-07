import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { containsForbiddenKeywords } from '../../utils/contentModeration';

const CreatePostModal = ({ isOpen, onClose, onSubmit, initialPost = null }) => {
  const [title, setTitle] = useState(initialPost ? initialPost.title : '');
  const [content, setContent] = useState(initialPost ? initialPost.content : '');
  const [category, setCategory] = useState(initialPost ? initialPost.category : 'General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    if (containsForbiddenKeywords(title) || containsForbiddenKeywords(content)) {
      setError('Your post contains words that are not allowed. Please revise your post.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const postData = { title, content, category };
      if (initialPost) {
        postData.id = initialPost.id; // Include ID for update
      }
      await onSubmit(postData);
      // Reset form and close modal on success (only if creating, not editing)
      if (!initialPost) {
        setTitle('');
        setContent('');
        setCategory('General');
      }
      onClose();
    } catch (err) {
      setError(`Failed to ${initialPost ? 'update' : 'create'} post. Please try again.`);
      console.error(`Failed to ${initialPost ? 'update' : 'create'} post:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sky-900">{initialPost ? 'Edit Post' : 'Create a New Post'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 p-1 rounded-full transition-colors">
            <HiX className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 transition" required placeholder="Post title" />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-bold text-slate-700 mb-1">Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="5" className="mt-1 block w-full px-3 py-2 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 transition" required placeholder="What's on your mind?"></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-100 text-slate-900 rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 transition">
              <option>General</option>
              <option>Skill Development</option>
              <option>Events</option>
              <option>Academic</option>
              <option>Lost & Found</option>
              <option>Official Notice</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="flex justify-end items-center">
            <button type="button" onClick={onClose} className="mr-4 py-2 px-5 text-slate-700 font-semibold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="py-2 px-5 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg">
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CreatePostModal;
