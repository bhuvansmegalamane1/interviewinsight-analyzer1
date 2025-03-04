
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ArrowRight, Video, PieChart, Award } from "lucide-react";
import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex-1 w-full py-12 flex flex-col items-center justify-center"
      >
        <motion.div 
          variants={fadeIn("up", 0.3)}
          className="text-center max-w-3xl mx-auto mb-16 w-full"
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
            AI-Powered Interview Analysis
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animated-gradient-text">
            Practice with AI Interviewers
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Meet our AI interviewers and practice your skills with real-time feedback on your body language, eye contact, grammar, and confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/practice">
              <Button size="lg" className="rounded-full px-8 transition-all duration-300 hover:translate-y-[-2px] gradient-button text-white shadow-lg hover:shadow-blue-500/25 group depth-effect">
                Start Practice Interview
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeIn("up", 0.5)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto"
        >
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 overflow-hidden glass-card group">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg float-animation group-hover:scale-110 transition-transform">
              <Video size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform">AI Interviewers</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Practice with our realistic AI interviewers who adapt to different interview types and provide personalized questions.
            </p>
          </Card>
          
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-800 hover:border-purple-200 dark:hover:border-purple-800 overflow-hidden glass-card group">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg float-animation group-hover:scale-110 transition-transform">
              <PieChart size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-400 group-hover:translate-x-1 transition-transform">Real-time Analysis</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Get instant feedback on your speech, body language, eye contact, grammar, and confidence during the interview.
            </p>
          </Card>
          
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-200 dark:hover:border-indigo-800 overflow-hidden glass-card group">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg float-animation group-hover:scale-110 transition-transform">
              <Award size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">Personalized Coaching</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Receive tailored recommendations to improve your interview performance based on detailed AI analysis.
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Index;
