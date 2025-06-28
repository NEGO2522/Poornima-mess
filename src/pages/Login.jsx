import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  FiMail,
  FiArrowRight,
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiSun,
  FiCoffee
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import {
  auth,
  signInWithGoogle,
  sendSignInLink,
  isSignInLinkUrl,
  signInWithEmail,
  onAuthStateChanged
} from '../firebase/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const features = [
  {
    icon: <FiClock className="w-6 h-6" />,
    title: 'Track Your Meals',
    description: 'Never miss your favorite dishes with our daily updated menu.'
  },
  {
    icon: <FiSun className="w-6 h-6" />,
    title: 'Daily Updates',
    description: 'Get real-time updates about menu changes and special meals.'
  },
  {
    icon: <FiCoffee className="w-6 h-6" />,
    title: 'Special Menus',
    description: 'Discover special weekend and festival menus in advance.'
  }
];

const Login = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();

  // Check for email link on component mount
  useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInLinkUrl()) {
        setIsSubmitting(true);
        const emailForSignIn = window.localStorage.getItem('emailForSignIn');
        try {
          const { success, user, error } = await signInWithEmail(emailForSignIn);
          if (success) {
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
            toast.success('Successfully signed in!');
            window.location.href = '/home';
          } else {
            setLoginError(error?.message || 'Failed to sign in with email link');
            toast.error('Failed to sign in with email link');
          }
        } catch (error) {
          setLoginError(error.message || 'Failed to sign in with email link');
          toast.error('Failed to sign in with email link');
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    checkEmailLink();
  }, [navigate]);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auto-rotate features (desktop only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle email link login
  const handleSendSignInLink = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setLoginError('Please enter a valid email address');
      return;
    }
    try {
      setIsSubmitting(true);
      const { success, error } = await sendSignInLink(email);
      if (success) {
        setIsEmailSent(true);
        toast.success('Login link sent to your email!');
      } else {
        throw error;
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to send login link. Please try again.';
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const { success, error } = await signInWithGoogle();
      if (success) {
        toast.success('Successfully logged in with Google!');
        navigate('/home');
      } else if (error) {
        throw error;
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to sign in with Google';
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (loginError) setLoginError('');
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Feature showcase (hide on mobile) */}
      <div className="hidden lg:flex w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="text-2xl font-bold text-blue-600 mb-8 inline-block">
            Mess App
          </Link>
          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  {features[currentFeature].icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {features[currentFeature].title}
                </h2>
                <p className="text-gray-600">
                  {features[currentFeature].description}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex space-x-2 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentFeature ? 'bg-blue-600 w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form (mobile: only form, no features) */}

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-100 rounded-full opacity-40 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-2xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        {/* Extra design: animated gradient bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 rounded-full blur-sm opacity-60 animate-pulse z-0"></div>
        {/* Extra design: floating icons */}
        <div className="hidden sm:block absolute right-8 top-24 z-0 animate-float-slow">
          <FiCoffee className="text-indigo-200" size={32} />
        </div>
        <div className="hidden sm:block absolute left-8 bottom-24 z-0 animate-float">
          <FiSun className="text-yellow-200" size={28} />
        </div>
        <div className="hidden sm:block absolute left-1/2 bottom-10 -translate-x-1/2 z-0 animate-float-slow">
          <FiClock className="text-blue-200" size={28} />
        </div>
        {/* Login Card */}
        <div
          className="
            w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-md rounded-xl
            flex flex-col justify-center items-center
            min-h-[70vh]
            my-auto
            border border-blue-100
            lg:min-h-[80vh]
            lg:rounded-xl
            relative z-10
          "
        >
          {/* Logo or App Icon */}
          <div className="flex items-center justify-center mb-2">
            <img
              src="https://img.icons8.com/color/48/meal.png"
              alt="Mess App Logo"
              className="h-12 w-12 rounded-full shadow"
            />
          </div>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1 drop-shadow">
              {isEmailSent ? 'Check your email' : 'Welcome back'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isEmailSent
                ? `We've sent a login link to ${email}`
                : 'Sign in with your email or Google'}
            </p>
          </div>
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 transition-colors"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">Or</span>
            </div>
          </div>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-red-50 border border-red-200 rounded flex items-start"
            >
              <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-600 text-xs">{loginError}</p>
            </motion.div>
          )}

          {!isEmailSent ? (
            <form onSubmit={handleSendSignInLink} className="space-y-5 w-full">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isSubmitting || !email ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send login link
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center p-5 border-2 border-dashed border-green-200 rounded-lg bg-green-50 w-full">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-3">
                <FiCheck className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Check your email</h3>
              <p className="text-xs text-gray-500 mb-2">
                We've sent a magic link to <span className="font-medium">{email}</span>.
                Click the link to sign in.
              </p>
              <p className="text-xs text-gray-400">
                Didn't receive an email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setLoginError('');
                }}
                className="mt-3 text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to sign in
              </button>
            </div>
          )}

          {!isEmailSent && (
            <div className="mt-5 text-center w-full">
              <p className="text-xs text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          )}

          <div className="mt-6 text-center w-full">
            <p className="text-[10px] text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;