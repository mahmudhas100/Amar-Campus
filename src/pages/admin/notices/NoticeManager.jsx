import React, { useState } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiChevronDown } from 'react-icons/hi';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useAuth } from '../../../hooks/useAuth';
import NoticeList from './NoticeList';

const NoticeManager = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');
  const [priority, setPriority] = useState('Normal');

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    
    if (!title || !content) return;

    try {
      await addDoc(collection(db, 'classFeed'), {
        title,
        content,
        category,
        priority,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: Timestamp.now(),
        department: user.department,
        section: user.section,
        official: true
      });

      setTitle('');
      setContent('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const categories = ['Academic', 'Administrative', 'Event', 'Emergency'];
  const priorities = ['Low', 'Normal', 'High', 'Urgent'];

  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Notices & Announcements</h1>
            <p className="text-gray-300 text-xl">Create and manage official notices</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Create Notice
          </button>
        </div>      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-teal-900 rounded-xl p-6 max-w-2xl w-full shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Create New Notice</h2>
            <form onSubmit={handleCreateNotice}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-teal-800 border border-teal-700 rounded-lg text-white placeholder-gray-400"
                    placeholder="Enter notice title"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-teal-700 rounded-lg appearance-none bg-teal-800 text-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-2 border border-teal-700 rounded-lg appearance-none bg-teal-800 text-white"
                      >
                        {priorities.map((pri) => (
                          <option key={pri} value={pri}>
                            {pri}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 bg-teal-800 border border-teal-700 rounded-lg text-white placeholder-gray-400 h-32"
                    placeholder="Enter notice content"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-teal-700 rounded-lg transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow font-medium"
                >
                  Create Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice List will be implemented here */}
      <div className="bg-teal-900 rounded-xl border border-teal-800 overflow-hidden p-4">
        <NoticeList />
      </div>
    </div>
  );
};

export default NoticeManager;
