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
    <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-background-secondary/80 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl shadow-sky-900/50 border border-border-primary transition-all duration-500 ease-in-out" style={{maxHeight: '100%'}}>
        <header className="mb-8 text-center">
          <div className="inline-block bg-accent/10 p-4 rounded-full mb-4 transition-transform duration-300 hover:scale-110">
            <LuShieldCheck className="text-5xl sm:text-6xl text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary tracking-tight">Voice Box</h1>
          <p className="text-text-secondary mt-3 text-base sm:text-lg">
            A safe and anonymous space to share concerns, ask for help, or report incidents.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-bold text-text-primary mb-2 ml-1">
              Your Anonymous Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="3"
              className="w-full px-5 py-3 bg-background-primary/80 border-2 border-border-primary rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-4 focus:ring-accent/30 focus:border-accent transition-all duration-300 ease-in-out shadow-inner focus:shadow-lg focus:bg-background-primary"
              placeholder="Share what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-background-primary font-bold py-4 px-10 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-accent/20 focus:outline-none focus:ring-4 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !message.trim()}
            >
              {loading ? 'Submitting...' : 'Submit Anonymously'}
            </button>
          </div>
          {success && (
            <p className="text-center text-green-400 bg-green-500/10 p-3 rounded-lg mt-6 animate-fade-in-down">Your message has been submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VoiceBox;
