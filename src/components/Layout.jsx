import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Optional: Include the Header if it's on every page */}
      {/* Main Content */}
      <main className="flex-grow">
        {children} {/* This will render the page content */}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
