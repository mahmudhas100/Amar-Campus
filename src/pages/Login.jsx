import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { login, signup, signInWithGoogle } from '../firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { HiArrowLeft } from 'react-icons/hi';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(!searchParams.get('state'));
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
    section: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password, name, department, section } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const state = searchParams.get('state');
    setIsLogin(!state || state !== 'signup');
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAuth = async (isLoginMode) => {
    setLoading(true);
    setError('');
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        // TODO: Add user details to Firestore after signup
        await signup(email, password);
      }
      navigate('/home');
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 to-sky-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center text-sky-300 hover:text-sky-200 mb-6 mx-4">
          <HiArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-5xl font-black text-white text-center">Amar Campus</h1>
        <h2 className="mt-4 text-xl text-sky-300 text-center">Your Campus, Connected.</h2>
        <p className="mt-6 text-center text-sm text-sky-300">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-sky-800/50 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-sky-700">
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="you@university.com"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-sky-200">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-sky-200">
                    Department
                  </label>
                  <div className="mt-1">
                    <input
                      id="department"
                      name="department"
                      type="text"
                      required
                      value={department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Your department"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-sky-200">
                    Section
                  </label>
                  <div className="mt-1">
                    <input
                      id="section"
                      name="section"
                      type="text"
                      required
                      value={section}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Your section"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sky-200">
                {isLogin ? 'Password' : 'Create Password'}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder={isLogin ? "********" : "Choose a strong password"}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sky-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-sky-800/50 text-sky-300">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 rounded-md shadow-sm bg-white hover:bg-gray-50 border border-gray-300 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
