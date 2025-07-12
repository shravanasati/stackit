import React from "react";

function Footer() {

  return (
    <footer className="relative min-h-[20vh] bg-[#090909] overflow-hidden border-t-2 border-dashed">
      <div className="flex flex-col md:flex-row gap-8 px-6 sm:px-8 md:px-12 lg:px-20 py-8 justify-between items-start z-10 relative w-full max-w-7xl mx-auto">
        <div className="text-white">
          <h3 className="text-2xl font-black text-primary mb-4">StackIt</h3>
          <p className="text-lg text-gray-400 max-w-xs">
            Made with ❤️ by GoGrep
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
