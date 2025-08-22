import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import Button from "@/components/Button";
import { Link } from "react-router";
import { 
  ClipboardCheck, 
  MessageSquareText, 
  Settings
} from "lucide-react";

export default function Home() {
  const quickActions = [
    {
      title: "Start Evaluation",
      description: "Evaluate student answers with AI",
      icon: <ClipboardCheck className="h-6 w-6" />,
      path: "/evaluate",
      color: "from-blue-500 via-blue-600 to-blue-700"
    },
    {
      title: "AI Chat",
      description: "Chat with AI models",
      icon: <MessageSquareText className="h-6 w-6" />,
      path: "/chat",
      color: "from-emerald-500 via-emerald-600 to-emerald-700"
    },
    {
      title: "Settings",
      description: "Configure your preferences",
      icon: <Settings className="h-6 w-6" />,
      path: "/settings",
      color: "from-slate-500 via-slate-600 to-slate-700"
    }
  ];

  return (
    <div className="flex h-screen flex-row">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-1 flex-col w-full h-full p-6 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-uGray mb-2">Welcome to Open2E</h1>
                <p className="text-lg text-uGrayLight max-w-2xl mx-auto">
                  Your comprehensive platform for AI-powered educational evaluation and analytics
                </p>
              </div>

                             {/* Quick Actions Grid */}
               <div className="flex justify-center mb-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                   {quickActions.map((action, index) => (
                     <Link key={index} to={action.path}>
                       <div className={`group bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl shadow-lg p-6 border border-uGrayLight/50 hover:shadow-xl transition-all duration-300 hover:border-uBlue/50 cursor-pointer h-full backdrop-blur-sm`}>
                         <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                           <div className="text-white p-2 rounded-lg">
                             {action.icon}
                           </div>
                         </div>
                         <h3 className="text-lg font-semibold text-uGray mb-2">{action.title}</h3>
                         <p className="text-sm text-uGrayLight">{action.description}</p>
                       </div>
                     </Link>
                   ))}
                 </div>
               </div>

              
            </div>

            {/* Analytics Dashboard */}
            <div className="border-t border-uGrayLight pt-8">
              <AnalyticsDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
