import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCoffee,
  FiSun,
  FiMoon,
  FiLinkedin,
  FiMail,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiMenu
} from 'react-icons/fi';
import { weeklyMenu, messRules } from '../data/messData';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];

const getCurrentDay = () => {
  const date = new Date();
  return days[date.getDay()];
};

const Home = () => {
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSections, setShowMobileSections] = useState({
    timings: false,
    rules: false,
    guest: false,
  });
  const daySelectorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollDays = (direction) => {
    if (daySelectorRef.current) {
      daySelectorRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return <FiSun className="inline-block mr-2" />;
      case 'lunch':
        return <FiClock className="inline-block mr-2" />;
      case 'snacks':
        return <FiCoffee className="inline-block mr-2" />;
      case 'dinner':
        return <FiMoon className="inline-block mr-2" />;
      default:
        return null;
    }
  };

  // Mobile toggle handler
  const handleToggle = (section) => {
    setShowMobileSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sticky Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md'
            : 'bg-gradient-to-r from-blue-600 to-blue-700'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
          {/* Hamburger menu for mobile */}
          <button
            className="sm:hidden flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors mr-4"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            aria-label="Open menu"
          >
            <FiMenu className="text-white text-2xl" />
          </button>
          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: -20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className={`text-2xl md:text-3xl font-bold ${
                isScrolled ? 'text-blue-600' : 'text-white'
              }`}>
                Poornima Mess Menu
              </h1>
              <motion.p
                className={`text-sm md:text-base ${
                  isScrolled ? 'text-gray-600' : 'text-blue-100'
                }`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {activeDay}'s Special
              </motion.p>
            </motion.div>
            <motion.div
              className="hidden md:block bg-white/20 rounded-full px-4 py-2 mt-2 md:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-white font-medium">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </motion.div>
          </div>
        </div>
        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="sm:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Collapsible Sections inside dropdown */}
              <div className="space-y-2">
                {/* Meal Timings */}
                <div className="bg-white/10 rounded-lg">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 font-semibold text-white focus:outline-none"
                    onClick={() => handleToggle('timings')}
                  >
                    <span className="flex items-center">
                      <FiClock className="mr-2" /> Meal Timings
                    </span>
                    {showMobileSections.timings ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  <AnimatePresence>
                    {showMobileSections.timings && (
                      <motion.ul
                        className="px-5 pb-4 space-y-3"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {messRules.slice(0, 4).map((rule, idx) => (
                          <li key={idx} className="flex items-start text-blue-100">
                            <FiCheckCircle className="text-green-300 mt-1 mr-2 flex-shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                {/* Rules & Regulations */}
                <div className="bg-white/10 rounded-lg">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 font-semibold text-white focus:outline-none"
                    onClick={() => handleToggle('rules')}
                  >
                    <span className="flex items-center">
                      <FiAlertCircle className="mr-2" /> Rules & Regulations
                    </span>
                    {showMobileSections.rules ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  <AnimatePresence>
                    {showMobileSections.rules && (
                      <motion.ul
                        className="px-5 pb-4 space-y-3"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {messRules.slice(4).map((rule, idx) => (
                          <li key={idx} className="flex items-start text-blue-100">
                            <FiCheckCircle className="text-green-300 mt-1 mr-2 flex-shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                {/* Guest Meal */}
                <div className="bg-white/10 rounded-lg">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 font-semibold text-white focus:outline-none"
                    onClick={() => handleToggle('guest')}
                  >
                    <span className="flex items-center">
                      <FiDollarSign className="mr-2 text-yellow-300" /> Guest Meal
                    </span>
                    {showMobileSections.guest ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  <AnimatePresence>
                    {showMobileSections.guest && (
                      <motion.div
                        className="px-5 pb-4"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-lg font-bold text-yellow-300 mb-1">₹100 <span className="text-sm text-blue-100 font-normal">per meal</span></div>
                        <p className="text-blue-100 mb-2 text-sm">
                          Enjoy delicious meals with your guests at an affordable price. Perfect for when you have visitors!
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-xs">
                            <FiClock className="mr-1" /> Available during all meal times
                          </span>
                          <span className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-xs">
                            <FiCheckCircle className="mr-1" /> Same quality as regular meals
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Day Selector */}
        <div className="relative mb-6 sm:mb-8" ref={daySelectorRef}>
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
            <motion.button
              onClick={() => scrollDays('left')}
              className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 ml-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll left"
            >
              <FiChevronLeft size={20} />
            </motion.button>
          </div>
          <motion.div
            className="flex gap-2 overflow-x-auto pb-4 px-12 scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {days.map((day, index) => {
              const isActive = activeDay === day;
              const isToday = day === getCurrentDay();
              const dayInitial = day.substring(0, 3);
              const date = new Date();
              date.setDate(date.getDate() + (index - date.getDay()));
              return (
                <motion.button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all flex flex-col items-center relative ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : isToday
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                  }`}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.1 * index,
                      type: 'spring',
                      stiffness: 300
                    }
                  }}
                >
                  <span className={`text-xs mb-1 ${
                    isActive ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {dayInitial}
                  </span>
                  <span className="text-sm font-medium">
                    {date.getDate()}
                  </span>
                  {isToday && (
                    <span className="absolute -top-1 -right-1 h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
          <div className="absolute right-0 top-0 bottom-0 flex items-center z-10">
            <motion.button
              onClick={() => scrollDays('right')}
              className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 mr-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll right"
            >
              <FiChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Menu Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
            initial={{ opacity: 0, y: 20, rotateX: -5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 5 }}
            transition={{ duration: 0.5, type: 'spring', damping: 15 }}
          >
            <div className="p-4 sm:p-6">
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 font-serif"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {activeDay}'s Menu
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                {mealTypes.map((mealType, index) => {
                  const menuItem = weeklyMenu[activeDay]?.[mealType] || 'Menu not available';
                  const isLongText = menuItem.length > 100;
                  return (
                    <motion.div
                      key={mealType}
                      className={`relative group bg-white p-4 sm:p-5 rounded-xl border-l-4 ${
                        mealType === 'breakfast' ? 'border-orange-400' :
                        mealType === 'lunch' ? 'border-green-400' :
                        mealType === 'snacks' ? 'border-yellow-400' : 'border-blue-400'
                      } shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
                      initial={{ y: 20, opacity: 0, scale: 0.98 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      whileHover={{
                        y: -3,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                      transition={{
                        delay: 0.1 * index,
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 300
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${
                          mealType === 'breakfast' ? 'bg-orange-50 text-orange-500' :
                          mealType === 'lunch' ? 'bg-green-50 text-green-500' :
                          mealType === 'snacks' ? 'bg-yellow-50 text-yellow-500' : 'bg-blue-50 text-blue-500'
                        } mr-4`}>
                          {getMealIcon(mealType)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 capitalize mb-1 sm:mb-2">
                            {mealType}
                          </h3>
                          <p className={`text-gray-600 leading-relaxed ${
                            isLongText ? 'text-sm' : 'text-base'
                          }`}>
                            {menuItem}
                          </p>
                        </div>
                      </div>
                      {isLongText && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      )}
                      {isLongText && (
                        <button
                          className="absolute bottom-2 right-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white/80 px-2 py-1 rounded-full border border-blue-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            const card = e.currentTarget.closest('div[class*="border-"]');
                            card.classList.toggle('h-auto');
                            card.classList.toggle('max-h-32', !card.classList.contains('h-auto'));
                          }}
                        >
                          Show more
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Desktop: Mess Rules Section */}
        <motion.div
          className="hidden sm:block mt-12 px-4 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <FiAlertCircle className="mr-3 text-blue-600" />
              Mess Rules & Timings
            </h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meal Timings Card */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FiClock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Meal Timings</h3>
              </div>
              <ul className="space-y-3">
                {messRules.slice(0, 4).map((rule, index) => (
                  <motion.li
                    key={`timing-${index}`}
                    className="flex items-start group"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            {/* Rules & Regulations Card */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FiAlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Rules & Regulations</h3>
              </div>
              <ul className="space-y-3">
                {messRules.slice(4).map((rule, index) => (
                  <motion.li
                    key={`rule-${index}`}
                    className="flex items-start group"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          {/* Guest Meal Card - Full Width */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg text-white overflow-hidden relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-10 top-1/2 w-24 h-24 bg-white/5 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <FiDollarSign className="mr-2 text-yellow-300" />
                    Guest Meal
                  </h3>
                  <p className="text-blue-100 max-w-2xl">
                    Enjoy delicious meals with your guests at an affordable price. Perfect for when you have visitors!
                  </p>
                </div>
                <motion.div
                  className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">₹100</div>
                    <div className="text-blue-100 text-sm">per meal</div>
                  </div>
                </motion.div>
              </div>
              <motion.div
                className="mt-6 pt-4 border-t border-white/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    <FiClock className="mr-1" /> Available during all meal times
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    <FiCheckCircle className="mr-1" /> Same quality as regular meals
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Compact Footer */}
      <motion.footer
        className="bg-gray-800 text-white py-4 px-4 border-t border-gray-700 mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-sm text-gray-400 mb-2 sm:mb-0">
              &copy; {new Date().getFullYear()} Poornima Mess
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="https://www.linkedin.com/in/kshitij-jain-422025342/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"
              >
                <FiLinkedin className="inline mr-1.5 text-lg" /> LinkedIn
              </a>
              <a
                href="mailto:negokshitij@gmail.com?subject=Regarding%20Poornima%20Mess&body=Hello%20Kshitij,%0D%0A%0D%0A"
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
                onClick={(e) => {
                  if (!window.location.href.startsWith('mailto:')) {
                    e.preventDefault();
                    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=negokshitij@gmail.com&su=Regarding%20Poornima%20Mess&body=Hello%20Kshitij,', '_blank');
                  }
                }}
              >
                <FiMail className="inline mr-1.5 text-lg" /> Email Us
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Home;