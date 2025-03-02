
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ArrowRight, Video, BarChart3, Award, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="py-8 px-4 md:px-8 border-b border-neutral-100/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm w-full">
        <div className="container mx-auto w-full max-w-full px-4 md:px-8">
          <h1 className="text-3xl font-bold highlight-gradient flex items-center gap-2">
            <Globe size={28} className="text-blue-600 dark:text-blue-400" />
            InterviewInsight
          </h1>
        </div>
      </header>
      
      <motion.main 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 w-full py-12 px-4 md:px-8 flex flex-col items-center justify-center bg-gradient-pro"
      >
        <motion.div 
          variants={fadeIn("up", 0.3)}
          className="text-center max-w-3xl mx-auto mb-16 w-full"
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
            AI-Powered Interview Analysis
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 highlight-gradient">
            Elevate Your Interview Performance
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Receive detailed feedback, insights, and performance scores by analyzing your interview videos or practice directly within our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="rounded-full px-8 transition-all duration-300 hover:translate-y-[-2px] gradient-button text-white shadow-md group">
                Upload Interview
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/practice">
              <Button size="lg" variant="outline" className="rounded-full px-8 transition-all duration-300 hover:translate-y-[-2px] border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 group">
                Practice Interview
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeIn("up", 0.5)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto"
        >
          <Card className="p-6 hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800 glow-effect hover:border-blue-200 dark:hover:border-blue-800 overflow-hidden card-scale-hover glass-card">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 text-white shadow-md float-animation">
              <Video size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-400">Upload Interviews</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Upload recorded interviews for AI analysis and receive detailed feedback.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800 glow-effect hover:border-purple-200 dark:hover:border-purple-800 overflow-hidden card-scale-hover glass-card">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 text-white shadow-md float-animation">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2 text-purple-700 dark:text-purple-400">Practice Mode</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Practice interviews directly in the app with real-time recording and analysis.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800 glow-effect hover:border-indigo-200 dark:hover:border-indigo-800 overflow-hidden card-scale-hover glass-card">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 text-white shadow-md float-animation">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-400">Insightful Analytics</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Visualize your performance with comprehensive scores and charts.
            </p>
          </Card>
        </motion.div>
      </motion.main>
      
      <footer className="py-6 px-4 md:px-8 border-t border-neutral-100/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm w-full">
        <div className="container mx-auto text-center text-sm text-neutral-500 w-full max-w-full">
          © {new Date().getFullYear()} InterviewInsight. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
