import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (isLoginMode) => {
    setLoading(true);
    setError('');
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('An account already exists with this email address.');
          break;
        default:
          setError('Failed to authenticate. Please try again.');
          console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleAuth(true);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    handleAuth(false);
  };

  const formToRender = isLogin ? (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-sky-200">
          Student Email / ID
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="you@university.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-sky-200">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="********"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Login'}
      </button>
    </form>
  ) : (
    <form onSubmit={handleSignup} className="space-y-6">
      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium text-sky-200">
          Student Email
        </label>
        <div className="mt-1">
          <input
            id="email-signup"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="you@university.com"
          />
        </div>
      </div>
       <div>
        <label htmlFor="password-signup" className="block text-sm font-medium text-sky-200">
          Create Password
        </label>
        <div className="mt-1">
          <input
            id="password-signup"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Choose a strong password"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-sky-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-5xl font-black text-white">Amar Campus</h1>
        <h2 className="mt-4 text-xl text-sky-300">Your Campus, Connected.</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-sky-900/50 backdrop-blur-sm py-8 px-4 shadow-2xl shadow-sky-950/50 rounded-lg sm:px-10 border border-sky-800">
          {error && <p className="mb-4 text-center text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
          {formToRender}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sky-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-sky-900 text-sky-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="w-full flex justify-center py-3 px-4 border border-sky-600 rounded-md shadow-sm text-sm font-bold text-sky-200 bg-transparent hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-700"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
