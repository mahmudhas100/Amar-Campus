import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FiMail } from 'react-icons/fi';

const VoiceBoxReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'voiceBox'));
      const reportsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(reportsData);
      setLoading(false);
    };

    fetchReports();
  }, []);

  const resolveReport = async (id) => {
    try {
      await deleteDoc(doc(db, 'voiceBox', id));
      setReports(reports.filter(report => report.id !== id));
    } catch (error) {
      console.error('Error resolving report: ', error);
    }
  };

  const mailTo = (report) => {
    const subject = `Voice Box Report: ${report.id}`;
    const body = `Report Details:\n\nMessage: ${report.message}\nTimestamp: ${new Date(report.timestamp.seconds * 1000).toLocaleString()}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-sky-900">Voice Box Reports</h1>
      {loading ? (
        <p className="text-center text-slate-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-slate-500">No reports found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="p-6">
                <p className="text-slate-800 text-base mb-4">{report.message}</p>
                <p className="text-sm text-slate-500 mb-6">
                  {new Date(report.timestamp.seconds * 1000).toLocaleString()}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => resolveReport(report.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={() => mailTo(report)}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                  >
                    <FiMail className="mr-2" />
                    Mail to
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceBoxReports;
