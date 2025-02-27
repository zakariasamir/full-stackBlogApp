const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">CodeWalkers Blog</h3>
            <p className="text-gray-400 mt-2">
              Share your coding journey with the world
            </p>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://github.com/zakariasamir/codeWalkersBlogApp"
              className="text-gray-400 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} CodeWalkers Blog. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
