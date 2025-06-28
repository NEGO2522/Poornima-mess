import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCoffee, FiClock, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';

const features = [
  {
    icon: <FiClock className="w-6 h-6" />,
    title: 'Daily Menu',
    description: 'Check what\'s cooking for breakfast, lunch, and dinner'
  },
  {
    icon: <FiSun className="w-6 h-6" />,
    title: 'Weekly Schedule',
    description: 'Plan your week with our weekly meal schedule'
  },
  {
    icon: <FiCoffee className="w-6 h-6" />,
    title: 'Snack Time',
    description: 'Never miss your evening snacks and tea time'
  },
  {
    icon: <FiMoon className="w-6 h-6" />,
    title: 'Special Dinners',
    description: 'Discover special weekend and festival menus'
  }
];

const Landing = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200 opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
            }}
            animate={{
              y: [null, Math.random() * 100 - 50],
              x: [null, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
          >
            <span className="relative flex w-2 h-2 mr-2">
              <span className="absolute inline-flex w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2 h-2 bg-blue-600 rounded-full"></span>
            </span>
            Now serving delicious meals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Welcome to <span className="text-blue-600">Poornima Mess</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Discover your weekly mess menu, track meal timings, and never miss your favorite dishes.
            All in one place, beautifully designed for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/home" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center">
                  View Weekly Menu
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </Link>
          </motion.div>

          {/* Features Carousel */}
          <div className="relative max-w-3xl mx-auto h-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 text-blue-600">
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {features[currentFeature].title}
                </h3>
                <p className="text-gray-600 text-center">
                  {features[currentFeature].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Feature Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentFeature ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.footer 
          className="mt-16 text-sm text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p>Made with ❤️ for Poornima Campus Students</p>
          <p className="mt-1 text-xs opacity-70">© {new Date().getFullYear()} Poornima Mess. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Landing;