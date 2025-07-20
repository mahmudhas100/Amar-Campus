import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { login, signup, signInWithGoogle } from "../firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { HiArrowLeft, HiEye, HiEyeOff } from "react-icons/hi";
import { HiCheck, HiX } from "react-icons/hi";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(!searchParams.get("state"));
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    department: "",
    section: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    numeric: false,
    special: false,
    passwordsMatch: false,
  });
  const [emailError, setEmailError] = useState("");

  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    department,
    section,
  } = formData;
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password, confirmPass = confirmPassword) => {
    const requirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      numeric: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/g.test(password),
      passwordsMatch: password === confirmPass && password.length > 0,
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every((req) => req === true);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      return false;
    }

    const domain = email.split("@")[1];
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
      "protonmail.com",
      "icloud.com",
      "zoho.com",
    ];
    const studentDomains = [".edu", ".edu.bd", ".ac.bd"];

    if (
      !allowedDomains.includes(domain) &&
      !studentDomains.some((sd) => domain.endsWith(sd))
    ) {
      setEmailError("Please use a valid mail provider or student mail.");
      return false;
    }

    setEmailError("");
    return true;
  };

  useEffect(() => {
    const state = searchParams.get("state");
    setIsLogin(!state || state !== "signup");
  }, [searchParams]);

  // Reset password requirements when switching modes
  useEffect(() => {
    if (isLogin) {
      setPasswordRequirements({
        minLength: false,
        uppercase: false,
        numeric: false,
        special: false,
        passwordsMatch: false,
      });
      setShowRequirements(false);
    }
  }, [isLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password in real-time during signup
    if (!isLogin) {
      if (name === "password") {
        validatePassword(value, confirmPassword);
      } else if (name === "confirmPassword") {
        validatePassword(password, value);
      }
    }
  };

  const handlePasswordFocus = () => {
    if (!isLogin) {
      setShowRequirements(true);
    }
  };

  const handlePasswordBlur = () => {
    // Keep requirements visible if user is still interacting with password fields
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isPasswordFieldActive =
        activeElement?.id === "password" ||
        activeElement?.id === "confirmPassword";
      if (!isPasswordFieldActive) {
        setShowRequirements(false);
      }
    }, 100);
  };

  const handleAuth = async (isLoginMode) => {
    setLoading(true);
    setError("");
    setEmailError("");

    if (!isLoginMode) {
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);

      if (!isEmailValid || !isPasswordValid) {
        setError("Please fix the errors before proceeding.");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        // TODO: Add user details to Firestore after signup
        await signup(email, password);
      }
      navigate("/home");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("The email address is not valid.");
          break;
        case "auth/invalid-credential":
          setError("Invalid credentials. Please check your email and password.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed login attempts. Please try again later.");
          break;
        case "auth/operation-not-allowed":
          setError("Email/password accounts are not enabled.");
          break;
        case "auth/email-already-in-use":
          setError("An account already exists with this email address.");
          break;
        default:
          setError(
            "Failed to authenticate. Please try again."
          );
          console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
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
        <Link
          to="/"
          className="flex items-center text-sky-300 hover:text-sky-200 mb-6 mx-4"
        >
          <HiArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-5xl font-black text-white text-center">
          Amar Campus
        </h1>
        <h2 className="mt-4 text-xl text-sky-300 text-center">
          Your Campus, Connected.
        </h2>
        <p className="mt-6 text-center text-sm text-sky-300">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl px-4">
        <div className="bg-sky-800/50 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-sky-700">
          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
          >
            <div className="transition-all duration-300 ease-in-out">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-sky-200"
                >
                  Student Email
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
                    placeholder="you@university.ac.bd"
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-400">{emailError}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="mb-4 flex-1">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-sky-200"
                      >
                        First Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          placeholder="Your first name"
                        />
                      </div>
                    </div>

                    <div className="mb-4 flex-1">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-sky-200"
                      >
                        Last Name (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="mb-3 flex-1">
                      <label
                        htmlFor="department"
                        className="block text-sm font-medium text-sky-200"
                      >
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
                          placeholder="Your department (e.g., CSE, EEE)"
                        />
                      </div>
                    </div>

                    <div className="mb-3 flex-1">
                      <label
                        htmlFor="section"
                        className="block text-sm font-medium text-sky-200"
                      >
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
                          placeholder="Your section (e.g., 8E, 3A)"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Password fields and Requirements */}
              <div className={`flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${!isLogin && showRequirements ? 'lg:flex-row lg:space-x-4 lg:items-start max-h-[400px]' : 'max-h-[200px]'}`}>
                <div className={`transition-all duration-300 ease-in-out ${!isLogin && showRequirements ? 'lg:w-1/2' : 'lg:w-full'}`}>
                  <div className={isLogin ? "mb-4" : "mb-4"}>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-sky-200"
                    >
                      {isLogin ? "Password" : "Create Password"}
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={
                          isLogin ? "current-password" : "new-password"
                        }
                        required
                        value={password}
                        onChange={handleInputChange}
                        onFocus={handlePasswordFocus}
                        onBlur={handlePasswordBlur}
                        className="w-full px-3 py-2 pr-10 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder={
                          isLogin ? "********" : "Choose a strong password"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sky-400 hover:text-sky-300 focus:outline-none"
                      >
                        {showPassword ? (
                          <HiEyeOff className="h-5 w-5" />
                        ) : (
                          <HiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-sky-200"
                      >
                        Confirm Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={handleInputChange}
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          className="w-full px-3 py-2 pr-10 bg-sky-800 border border-sky-600 rounded-md text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sky-400 hover:text-sky-300 focus:outline-none"
                        >
                          {showPassword ? (
                            <HiEyeOff className="h-5 w-5" />
                          ) : (
                            <HiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Requirements - Only for signup */}
                {!isLogin && showRequirements && (
                  <React.Fragment>
                  <div
                    className={`transition-all duration-300 ease-in-out ${showRequirements ? "opacity-100 max-h-[160px] lg:w-1/2" : "opacity-0 max-h-0 pointer-events-none"} overflow-hidden`}
                  >
                    <div className="p-3 bg-sky-800/30 rounded-md border border-sky-700 h-full">
                      <p className="text-sm font-medium text-sky-200 mb-1.5">
                        Password Requirements
                      </p>
                      <div className="space-y-0.3">
                        <div className="flex items-center text-sm">
                          {passwordRequirements.minLength ? (
                            <HiCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                          ) : (
                            <HiX className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                          )}
                          <span
                            className={
                              passwordRequirements.minLength
                                ? "text-sky-300"
                                : "text-sky-400"
                            }
                          >
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          {passwordRequirements.uppercase ? (
                            <HiCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                          ) : (
                            <HiX className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                          )}
                          <span
                            className={
                              passwordRequirements.uppercase
                                ? "text-sky-300"
                                : "text-sky-400"
                            }
                          >
                            One uppercase letter (A-Z)
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          {passwordRequirements.numeric ? (
                            <HiCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                          ) : (
                            <HiX className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                          )}
                          <span
                            className={
                              passwordRequirements.numeric
                                ? "text-sky-300"
                                : "text-sky-400"
                            }
                          >
                            One number (0-9)
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          {passwordRequirements.special ? (
                            <HiCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                          ) : (
                            <HiX className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                          )}
                          <span
                            className={
                              passwordRequirements.special
                                ? "text-sky-300"
                                : "text-sky-400"
                            }
                          >
                            One special character (!@#$%&*...)
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          {passwordRequirements.passwordsMatch ? (
                            <HiCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                          ) : (
                            <HiX className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                          )}
                          <span
                            className={
                              passwordRequirements.passwordsMatch
                                ? "text-sky-300"
                                : "text-sky-400"
                            }
                          >
                            Passwords match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className={isLogin ? "mt-2" : "mt-4"}>
              <button
                type="submit"
                disabled={
                  loading ||
                  (!isLogin &&
                    !Object.values(passwordRequirements).every(
                      (req) => req === true
                    ))
                }
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Processing..." : isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sky-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-sky-800/50 text-sky-300">
                  Or continue with
                </span>
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