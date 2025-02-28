
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn, staggerContainer } from "@/lib/animations";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-8 px-4 md:px-8 border-b border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto">
          <h1 className="text-3xl font-medium">InterviewInsight</h1>
        </div>
      </header>
      
      <motion.main 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 container mx-auto py-12 px-4 md:px-8 flex flex-col items-center justify-center"
      >
        <motion.div 
          variants={fadeIn("up", 0.3)}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm mb-4">
            AI-Powered Interview Analysis
          </span>
          <h2 className="text-4xl md:text-5xl font-medium mb-6">
            Elevate Your Interview Performance
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Receive detailed feedback, insights, and performance scores by analyzing your interview videos or practice directly within our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="rounded-full px-8 transition-all duration-300 hover:translate-y-[-2px]">
                Upload Interview
              </Button>
            </Link>
            <Link to="/practice">
              <Button size="lg" variant="outline" className="rounded-full px-8 transition-all duration-300 hover:translate-y-[-2px]">
                Practice Interview
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeIn("up", 0.5)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800">
            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Interviews</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Upload recorded interviews for AI analysis and receive detailed feedback.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800">
            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect width="15" height="14" x="1" y="5" rx="2" ry="2" /></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Practice Mode</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Practice interviews directly in the app with real-time recording and analysis.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800">
            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Insightful Analytics</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Visualize your performance with comprehensive scores and charts.
            </p>
          </Card>
        </motion.div>
      </motion.main>
      
      <footer className="py-6 px-4 md:px-8 border-t border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} InterviewInsight. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
