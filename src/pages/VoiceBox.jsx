import React, { useState } from 'react';
import { LuShieldCheck } from 'react-icons/lu';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const VoiceBox = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'voiceBox'), {
        message: message,
        timestamp: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-slate-100 p-4 sm:p-6 md:p-8 flex items-center justify-center mt-0" style={{minHeight: 'calc(100vh - 64px)'}}>
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl shadow-sky-200/50 overflow-y-auto transition-all duration-500 ease-in-out" style={{maxHeight: '100%'}}>
        <header className="mb-8 text-center">
          <div className="inline-block bg-sky-100/80 p-4 rounded-full mb-4 transition-transform duration-300 hover:scale-110">
            <LuShieldCheck className="text-5xl sm:text-6xl text-sky-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-900 tracking-tight">Voice Box</h1>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            A safe and anonymous space to share concerns, ask for help, or report incidents.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-bold text-sky-800 mb-2 ml-1">
              Your Anonymous Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="3"
              className="w-full px-5 py-1 bg-slate-50/80 border-2 border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-300/50 focus:border-sky-400 transition-all duration-300 ease-in-out shadow-inner focus:shadow-lg focus:bg-white"
              placeholder="Share what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-sky-300/80 focus:outline-none focus:ring-4 focus:ring-sky-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !message.trim()}
            >
              {loading ? 'Submitting...' : 'Submit Anonymously'}
            </button>
          </div>
          {success && (
            <p className="text-center text-green-600 bg-green-100/80 p-3 rounded-lg mt-6 animate-fade-in-down">Your message has been submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VoiceBox;