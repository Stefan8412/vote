import { Link } from "react-router-dom";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-400 py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo and Description */}
        <div className="flex items-center space-x-4">
          <p className="text-sm">
            &copy; Copyright {year} - Made with{" "}
            <span aria-label="love" role="img">
              💖
            </span>{" "}
            in Presov by PSK. All right reserved.{" "}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-4 mt-4 md:mt-0">
          {/*  <Link to="/gdpr" className="hover:text-white">
            GDPR
          </Link> */}
        </nav>

        {/* Social Media Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://www.facebook.com/sk8.samospravnekraje/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-6 h-6 hover:text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.49V14.708h-3.13v-3.624h3.13V8.41c0-3.1 1.893-4.787 4.659-4.787 1.325 0 2.463.099 2.794.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.76v2.307h3.586l-.467 3.624h-3.119V24h6.116C23.407 24 24 23.407 24 22.675V1.326C24 .593 23.407 0 22.675 0z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
