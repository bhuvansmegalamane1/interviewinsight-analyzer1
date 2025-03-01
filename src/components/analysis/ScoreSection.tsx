
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { AnalysisData } from "@/types/analysis";

interface ScoreSectionProps {
  data: AnalysisData;
  hasContent: boolean;
}

const ScoreSection = ({ data, hasContent }: ScoreSectionProps) => {
  // For no content case, create data with all zeros
  const mainScores = hasContent ? [
    { name: "Verbal", value: data.scores.verbal },
    { name: "Non-verbal", value: data.scores.nonVerbal },
    { name: "Content", value: data.scores.content },
    { name: "Engagement", value: data.scores.engagement },
  ] : [
    { name: "Verbal", value: 0 },
    { name: "Non-verbal", value: 0 },
    { name: "Content", value: 0 },
    { name: "Engagement", value: 0 },
  ];
  
  const detailedScores = hasContent ? [
    { name: "Clarity", value: data.detailedScores.clarity },
    { name: "Conciseness", value: data.detailedScores.conciseness },
    { name: "Eye Contact", value: data.detailedScores.eyeContact },
    { name: "Posture", value: data.detailedScores.posture },
    { name: "Relevance", value: data.detailedScores.relevance },
    { name: "Confidence", value: data.detailedScores.confidence },
  ] : [
    { name: "Clarity", value: 0 },
    { name: "Conciseness", value: 0 },
    { name: "Eye Contact", value: 0 },
    { name: "Posture", value: 0 },
    { name: "Relevance", value: 0 },
    { name: "Confidence", value: 0 },
  ];
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 p-3 rounded-md shadow-md border border-neutral-200 dark:border-neutral-700">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}/100`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (!hasContent) {
    return (
      <div className="space-y-8">
        <motion.div variants={fadeIn("up", 0.3)}>
          <Card className="p-8 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="flex flex-col items-center max-w-xl mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4">
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
                <path d="M3.44 19h17.12a2 2 0 0 0 1.72-3.01L13.8 4.1a2 2 0 0 0-3.6 0L1.72 15.99A2 2 0 0 0 3.44 19z"/>
              </svg>
              <h3 className="text-xl font-medium mb-3">No Performance Data Available</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                We couldn't analyze your performance because no speech was detected in your interview. 
                To receive meaningful feedback, please ensure:
              </p>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0 mt-1">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <span>Your microphone is properly connected and working</span>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0 mt-1">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <span>You're speaking clearly enough for the system to detect</span>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0 mt-1">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <span>You're actually responding to the interview questions</span>
                </li>
              </ul>
              <p className="text-neutral-600 dark:text-neutral-400">
                Try recording another interview while actively speaking to receive a full analysis of your performance.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Additional section to show zero scores in charts for visual reference */}
        <motion.div variants={fadeIn("up", 0.4)}>
          <h2 className="text-xl font-medium mb-4">Performance Metrics (No Data)</h2>
          <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium mb-4">Main Categories</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mainScores}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => `${name}: 0%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mainScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#cccccc" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <motion.div variants={fadeIn("up", 0.3)}>
        <h2 className="text-xl font-medium mb-4">Performance Metrics</h2>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Main Categories</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mainScores}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mainScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeIn("up", 0.4)}>
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-medium mb-4">Detailed Metrics</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={detailedScores}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {detailedScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
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
