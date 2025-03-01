
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn } from "@/lib/animations";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-overlay z-0"></div>
      
      <header className="py-6 px-4 md:px-8 border-b border-neutral-100/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm relative z-10 shadow-sm">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-500">
            InterviewInsight
          </Link>
          <nav className="flex gap-6">
            <Link 
              to="/upload" 
              className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 dark:after:bg-blue-400 after:transition-all"
            >
              Upload
            </Link>
            <Link 
              to="/practice" 
              className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 dark:after:bg-blue-400 after:transition-all"
            >
              Practice
            </Link>
          </nav>
        </div>
      </header>
      
      {title && (
        <div className="pt-10 pb-6 px-4 md:px-8 border-b border-neutral-100/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm relative z-10">
          <div className="container mx-auto max-w-7xl">
            <motion.h1 
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              animate="show"
              className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>
          </div>
        </div>
      )}
      
      <main className="flex-1 px-4 md:px-8 py-6 relative z-10">
        {children}
      </main>
      
      <footer className="py-6 px-4 md:px-8 border-t border-neutral-100/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm relative z-10 shadow-sm">
        <div className="container mx-auto max-w-7xl text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} InterviewInsight. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
