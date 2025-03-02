
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn } from "@/lib/animations";
import { Globe } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative w-full">
      {/* Professional background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-overlay z-0"></div>
      
      {/* Background graphics elements */}
      <div className="floating-shapes">
        {Array.from({ length: 12 }).map((_, i) => {
          const size = Math.floor(Math.random() * 200) + 50;
          const left = Math.floor(Math.random() * 100);
          const top = Math.floor(Math.random() * 100);
          const delay = Math.floor(Math.random() * 10);
          const duration = Math.floor(Math.random() * 20) + 15;
          const type = i % 3 === 0 ? 'shape-blue' : i % 3 === 1 ? 'shape-purple' : 'shape-indigo';
          
          return (
            <div 
              key={i} 
              className={`shape ${type}`} 
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Decorative background patterns */}
      <div className="bg-lines"></div>
      <div className="bg-gradient-radial"></div>
      <div className="bg-grid absolute inset-0 z-[-1]"></div>
      
      <header className="py-6 px-4 md:px-8 border-b border-neutral-100/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm relative z-10 shadow-sm w-full">
        <div className="container mx-auto flex justify-between items-center w-full max-w-full px-4 md:px-8">
          <Link to="/" className="text-xl font-bold highlight-gradient flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Globe size={24} className="text-blue-600 dark:text-blue-400" />
            <span>InterviewInsight</span>
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
        <div className="pt-10 pb-6 px-4 md:px-8 border-b border-neutral-100/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm relative z-10 w-full section-bg">
          <div className="container mx-auto w-full max-w-full px-4 md:px-8">
            <motion.h1 
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              animate="show"
              className="text-2xl font-medium highlight-gradient"
            >
              {title}
            </motion.h1>
          </div>
        </div>
      )}
      
      <main className="flex-1 px-4 md:px-8 py-6 relative z-10 w-full bg-gradient-pro">
        <div className="w-full max-w-full mx-auto">
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-4 md:px-8 border-t border-neutral-100/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm relative z-10 shadow-sm w-full">
        <div className="container mx-auto text-center text-sm text-neutral-500 w-full max-w-full">
          © {new Date().getFullYear()} InterviewInsight. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
