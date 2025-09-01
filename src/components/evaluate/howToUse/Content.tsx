import Markdown from "@/components/Markdown";

const Content = () => {
  const instructions = `
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
  return (
    <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-background/50 via-background/30 to-background/50">
      <div className="prose prose-xs max-w-none">
        <Markdown text={instructions} className="text-uGrayLight" />
      </div>
    </div>
  );
};

export default Content;
