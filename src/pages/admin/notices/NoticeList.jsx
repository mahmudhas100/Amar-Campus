import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import formatTimestamp from '../../../utils/formatTimestamp';
import { HiOutlineTrash } from 'react-icons/hi';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      const q = query(collection(db, 'classFeed'), where('official', '==', true));
      const querySnapshot = await getDocs(q);
      const noticesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(noticesData);
      setLoading(false);
    };

    fetchNotices();
  }, []);

  const deleteNotice = async (id) => {
    try {
      await deleteDoc(doc(db, 'classFeed', id));
      setNotices(notices.filter(notice => notice.id !== id));
    } catch (error) {
      console.error('Error deleting notice: ', error);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-800 text-red-100';
      case 'Urgent':
        return 'bg-yellow-800 text-yellow-100';
      case 'Normal':
        return 'bg-blue-800 text-blue-100';
      case 'Low':
        return 'bg-green-800 text-green-100';
      default:
        return 'bg-gray-800 text-gray-100';
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading notices...</p>
      ) : notices.length === 0 ? (
        <p>No notices found.</p>
      ) : (
        <div className="grid gap-4">
          {notices.map(notice => (
            <div key={notice.id} className="bg-teal-900 p-4 rounded-lg shadow flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(notice.priority)}`}>
                    {notice.priority}
                  </span>
                  <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-teal-800 text-gray-300">
                    {notice.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-white">{notice.title}</h3>
                <p className="text-gray-300">{notice.content}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {formatTimestamp(notice.createdAt)}
                </p>
              </div>
              <button
                onClick={() => deleteNotice(notice.id)}
                className="text-red-400 hover:text-red-300"
              >
                <HiOutlineTrash className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeList;