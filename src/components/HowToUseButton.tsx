import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSIze";
import { useColorMode } from "@/components/ui/color-mode";
import Button from "./Button";
import Markdown from "./Markdown";

interface HowToUseButtonProps {
  page: "evaluate" | "chat";
}

const HowToUseButton = ({ page }: HowToUseButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const screenSize = useScreenSize();
  const { colorMode } = useColorMode();
  // Show full button only on extralarge screens (1024px and above), icon on smaller screens
  const isFullScreen = screenSize === "extralarge";

  const evaluateInstructions = `
# How to Use Open Ended Evaluation

## Getting Started
1. **Select Students**: Choose the students you want to evaluate from the student list
2. **Add Articles**: Upload or paste articles that students will answer questions about
3. **Create Questions**: Add open-ended questions for students to answer

## Evaluation Process
1. **Student Answers**: Students will provide their answers to the questions
2. **AI Evaluation**: Our AI will evaluate each answer based on:
   - Content accuracy
   - Critical thinking
   - Clarity of expression
   - Depth of understanding

## Viewing Results
- **Individual Scores**: See detailed scores for each student
- **Comparative Analysis**: Compare performance across students
- **Analytics Dashboard**: View trends and insights
- **Export Data**: Download results for further analysis

## Tips for Better Evaluation
- Use clear, specific questions
- Provide diverse article content
- Review AI evaluations for accuracy
- Use tags to organize students and questions
`;

  const chatInstructions = `
# How to Use AI Chat

## Starting a Conversation
1. **New Chat**: Click "New Chat" to start a fresh conversation
2. **Select Model**: Choose your preferred AI model (OpenAI, Ollama, etc.)
3. **Begin Typing**: Start your conversation with the AI

## Chat Features
- **Real-time Responses**: Get instant AI responses
- **Conversation History**: All chats are automatically saved
- **Model Switching**: Change AI models mid-conversation
- **Export Chats**: Save important conversations

## Best Practices
- Be specific in your questions
- Use follow-up questions for deeper insights
- Review and edit responses as needed
- Use the chat for brainstorming and problem-solving

## Settings
- **Model Configuration**: Adjust temperature and other parameters
- **Theme**: Switch between light and dark modes
- **Text-to-Speech**: Enable voice output if available
`;

  const instructions = page === "evaluate" ? evaluateInstructions : chatInstructions;

  return (
    <>
      {/* How to Use Button */}
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-40">
        {isFullScreen ? (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-background hover:bg-primary/90 shadow-lg text-sm sm:text-base"
          >
            <HelpCircle className="h-4 w-4" />
            How to use
          </Button>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 sm:p-3 bg-primary text-background rounded-full hover:bg-primary/90 transition-all shadow-lg"
            title="How to use"
          >
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
      </div>

             {/* Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
           <div className="bg-background rounded-lg shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-uGrayLight flex flex-col">
             {/* Header */}
             <div className="flex items-center justify-between p-4 sm:p-6 border-b border-uGrayLight bg-panel flex-shrink-0">
               <h2 className={`text-lg sm:text-2xl font-bold ${
                 colorMode === 'dark' ? 'text-background font-light' : 'text-uBlack font-semibold'
               }`}>
                 {page === "evaluate" ? "Evaluation" : "AI Chat"}
               </h2>
               <button
                 onClick={() => setIsModalOpen(false)}
                 className="p-2 hover:bg-uGrayLight rounded-full transition-colors"
               >
                 <X className={`h-5 w-5 sm:h-6 sm:w-6 ${
                   colorMode === 'dark' ? 'text-background' : 'text-uBlack'
                 }`} />
               </button>
             </div>

             {/* Content */}
             <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-background">
               <Markdown text={instructions} className={colorMode === 'dark' ? "text-white" : "text-black"} />
             </div>

             {/* Footer */}
             <div className="flex justify-end p-4 sm:p-6 border-t border-uGrayLight bg-panel flex-shrink-0">
               <Button
                 onClick={() => setIsModalOpen(false)}
                 className="bg-primary text-background hover:bg-primary/90 px-4 sm:px-6 py-2"
               >
                 Got it!
               </Button>
             </div>
           </div>
         </div>
       )}
    </>
  );
};

export default HowToUseButton;
