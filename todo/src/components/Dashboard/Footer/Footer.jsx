import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-4 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm">
        {/* Left side: Links */}
        <div className="flex gap-4 mb-2 sm:mb-0">
          <p className="cursor-pointer hover:text-gray-800">Privacy Policy</p>
          <p className="cursor-pointer hover:text-gray-800">Terms of Use</p>
        </div>

        {/* Right side: Copyright */}
        <div>
          <p>&copy; {currentYear} NotePlus.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
