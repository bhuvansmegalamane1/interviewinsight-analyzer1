
import { Card } from "@/components/ui/card";
import { BarChart } from "recharts";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { AnalysisData } from "@/types/analysis";

interface ScoreSectionProps {
  data: AnalysisData;
}

const ScoreSection = ({ data }: ScoreSectionProps) => {
  const mainScores = [
    { name: "Verbal", value: data.scores.verbal },
    { name: "Non-verbal", value: data.scores.nonVerbal },
    { name: "Content", value: data.scores.content },
    { name: "Engagement", value: data.scores.engagement },
  ];
  
  const detailedScores = [
    { name: "Clarity", value: data.detailedScores.clarity },
    { name: "Conciseness", value: data.detailedScores.conciseness },
    { name: "Eye Contact", value: data.detailedScores.eyeContact },
    { name: "Posture", value: data.detailedScores.posture },
    { name: "Relevance", value: data.detailedScores.relevance },
    { name: "Confidence", value: data.detailedScores.confidence },
  ];
  
  return (
    <div className="space-y-8">
      <motion.div variants={fadeIn("up", 0.3)}>
        <h2 className="text-xl font-medium mb-4">Performance Metrics</h2>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Main Categories</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mainScores}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}/100`, "Score"]}
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.5rem",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="currentColor"
                  className="text-primary"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeIn("up", 0.4)}>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Detailed Metrics</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={detailedScores}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}/100`, "Score"]}
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.5rem",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="currentColor"
                  className="text-primary/80"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeIn("up", 0.5)}>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Performance Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Strengths</h4>
              <ul className="space-y-2">
                {data.strengths.map((strength, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 flex-shrink-0 mt-0.5">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Areas for Improvement</h4>
              <ul className="space-y-2">
                {data.improvements.map((improvement, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 flex-shrink-0 mt-0.5">
                      <path d="M12 9v4"/>
                      <path d="M12 17h.01"/>
                      <path d="M3.44 19h17.12a2 2 0 0 0 1.72-3.01L13.8 4.1a2 2 0 0 0-3.6 0L1.72 15.99A2 2 0 0 0 3.44 19z"/>
                    </svg>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recommendations</h4>
              <ul className="space-y-2">
                {data.recommendations.map((recommendation, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" x2="12" y1="8" y2="16"/>
                      <line x1="8" x2="16" y1="12" y2="12"/>
                    </svg>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScoreSection;
