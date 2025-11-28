import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Link } from "react-router";
import { ClipboardCheck, MessageSquareText, Settings } from "lucide-react";
import { cn } from "@/utils/style";

export default function Home() {
  const quickActions = [
    {
      title: "Start Evaluation",
      description: "Evaluate student answers with AI",
      icon: <ClipboardCheck className="h-6 w-6" />,
      path: "/evaluate",
      color: "from-blue-500 via-blue-600 to-blue-700",
      bgGradient: "from-blue-500/10 via-blue-600/5 to-blue-700/10",
      borderGradient: "from-blue-400/30 to-blue-600/30",
    },
    {
      title: "AI Chat",
      description: "Chat with AI models",
      icon: <MessageSquareText className="h-6 w-6" />,
      path: "/chat",
      color: "from-emerald-500 via-emerald-600 to-emerald-700",
      bgGradient: "from-emerald-500/10 via-emerald-600/5 to-emerald-700/10",
      borderGradient: "from-emerald-400/30 to-emerald-600/30",
    },
    {
      title: "Settings",
      description: "Configure your preferences",
      icon: <Settings className="h-6 w-6" />,
      path: "/settings",
      color: "from-slate-500 via-slate-600 to-slate-700",
      bgGradient: "from-slate-500/10 via-slate-600/5 to-slate-700/10",
      borderGradient: "from-slate-400/30 to-slate-600/30",
    },
  ];

  return (
    <div className="flex h-screen flex-row">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Background Gradients */}
        <div
          className={cn(
            "absolute inset-0 ",
            "bg-gradient-to-br from-background via-background/95 to-background/90"
          )}
        />
        <div
          className={cn(
            "absolute top-0 left-1/4 w-96 h-96 ",
            "bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-1/4 w-96 h-96 ",
            "bg-gradient-to-tl from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"
          )}
        />

        <div className="flex flex-1 flex-col w-full h-full p-6 overflow-y-auto relative z-10">
          <div className="w-full max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="h-screen flex flex-col justify-center">
              <div className="text-center mb-12">
                <div className="relative inline-block mb-6">
                  <h1
                    className={cn(
                      "text-5xl font-bold ",
                      "bg-gradient-to-r from-uGray via-uGrayLight to-uGray bg-clip-text text-transparent mb-4"
                    )}
                  >
                    Welcome to Open2E
                  </h1>
                  <div
                    className={cn(
                      "absolute -inset-1 ",
                      "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur opacity-75"
                    )}
                  />
                </div>
                <p className="text-xl text-uGrayLight max-w-3xl mx-auto leading-relaxed">
                  AI-powered evaluation and analytics for open ended questions
                  related to computer literacy with extra features.
                </p>
              </div>

              {/* Quick Actions Grid */}
              <div className="flex justify-center mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.path}>
                      <div
                        className={cn(
                          "group relative rounded-2xl p-8 h-full",
                          "bg-gradient-to-br",
                          "border border-transparent ",
                          "hover:border-opacity-50 ",
                          "transition-all duration-500 hover:scale-105 ",
                          "cursor-pointer backdrop-blur-sm shadow-xl hover:shadow-2xl",
                          action.bgGradient
                        )}
                      >
                        {/* Gradient Border Effect */}
                        <div
                          className={cn(
                            "absolute inset-0",
                            "bg-gradient-to-br",
                            action.borderGradient,
                            "rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                          )}
                        />

                        <div
                          className={cn(
                            "w-16 h-16 rounded-xl",
                            "bg-gradient-to-br",
                            action.color,
                            "flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                          )}
                        >
                          <div className={cn("text-white p-3 rounded-lg")}>
                            {action.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-uGray mb-3">
                          {action.title}
                        </h3>
                        <p className="text-uGrayLight leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="relative min-h-screen flex flex-col">
              <AnalyticsDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
