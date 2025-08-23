import { useState, Fragment } from "react";
import { HelpCircle, X } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSIze";
import { useColorMode } from "@/components/ui/color-mode";
import Button from "./Button";
import Markdown from "./Markdown";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface HowToUseButtonProps {
  page: "evaluate" | "chat";
  onPanelVisibilityChange?: (isVisible: boolean) => void;
}

const HowToUseButton = ({ page, onPanelVisibilityChange }: HowToUseButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);
  const screenSize = useScreenSize();
  const { colorMode } = useColorMode();
  
  // Show right panel on large screens (768px and above)
  const showRightPanel = screenSize === "large" || screenSize === "extralarge";

  const handleRightPanelToggle = (visible: boolean) => {
    setIsRightPanelVisible(visible);
    onPanelVisibilityChange?.(visible);
  };

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
      {/* Desktop view - Right Panel */}
      {showRightPanel && isRightPanelVisible && (
        <div className="hidden lg:block fixed right-0 top-0 w-80 h-full bg-gradient-to-br from-panel via-panel/95 to-panel/90 border-l border-uGrayLight/30 backdrop-blur-sm z-30">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-uGrayLight/30 bg-gradient-to-r from-panel/80 to-panel/60">
              <h2 className={`text-base font-bold bg-gradient-to-r from-uGray via-primary to-uGray bg-clip-text text-transparent ${
                colorMode === 'dark' ? 'font-light' : 'font-semibold'
              }`}>
                How to Use
              </h2>
              <button
                onClick={() => handleRightPanelToggle(false)}
                className="p-1.5 hover:bg-gradient-to-r hover:from-uGrayLight/20 hover:to-uGrayLight/10 rounded-full transition-all duration-300"
              >
                <X className={`h-4 w-4 ${
                  colorMode === 'dark' ? 'text-background' : 'text-uBlack'
                }`} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-background/50 via-background/30 to-background/50">
              <div className="prose prose-xs max-w-none">
                <Markdown text={instructions} className={`${colorMode === 'dark' ? "text-white" : "text-black"} text-xs leading-tight`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button for Right Panel (Desktop) */}
      {showRightPanel && (
        <div className="hidden lg:block fixed top-6 right-6 z-40">
          <button
            onClick={() => handleRightPanelToggle(!isRightPanelVisible)}
            className="bg-gradient-to-r from-primary to-primary/90 text-background hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl p-3 rounded-full transition-all duration-300"
            title="How to use"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Floating button for mobile/tablet */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-40 lg:hidden bg-gradient-to-r from-primary to-primary/90 text-background p-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:from-primary/90 hover:to-primary"
        aria-label="How to use"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Slide-in drawer for mobile/tablet */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 right-0 w-80 max-w-full bg-gradient-to-b from-background via-background/95 to-background/90 shadow-2xl border-l border-uGrayLight/30 z-50 flex flex-col backdrop-blur-sm">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-uGrayLight/30 bg-gradient-to-r from-panel/80 to-panel/60">
                  <h2 className={`text-base font-bold bg-gradient-to-r from-uGray via-primary to-uGray bg-clip-text text-transparent ${
                    colorMode === 'dark' ? 'font-light' : 'font-semibold'
                  }`}>
                    How to Use
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-gradient-to-r hover:from-uGrayLight/20 hover:to-uGrayLight/10 rounded-full transition-all duration-300"
                  >
                    <X className={`h-4 w-4 ${
                      colorMode === 'dark' ? 'text-background' : 'text-uBlack'
                    }`} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-background/50 via-background/30 to-background/50">
                  <div className="prose prose-xs max-w-none">
                    <Markdown text={instructions} className={`${colorMode === 'dark' ? "text-white" : "text-black"} text-xs leading-tight`} />
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
};

export default HowToUseButton;
