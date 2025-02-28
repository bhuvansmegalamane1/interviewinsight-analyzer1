
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn } from "@/lib/animations";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 md:px-8 border-b border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-medium">
            InterviewInsight
          </Link>
          <nav className="flex gap-6">
            <Link 
              to="/upload" 
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              Upload
            </Link>
            <Link 
              to="/practice" 
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              Practice
            </Link>
          </nav>
        </div>
      </header>
      
      {title && (
        <div className="pt-10 pb-6 px-4 md:px-8 border-b border-neutral-100 dark:border-neutral-800">
          <div className="container mx-auto">
            <motion.h1 
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              animate="show"
              className="text-2xl font-medium"
            >
              {title}
            </motion.h1>
          </div>
        </div>
      )}
      
      <main className="flex-1 px-4 md:px-8">
        {children}
      </main>
      
      <footer className="py-6 px-4 md:px-8 border-t border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} InterviewInsight. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
