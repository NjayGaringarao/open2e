import Markdown from "@/components/Markdown";

const EvaluateHelp = () => {
  const instructions = `

---
## Getting Started
1. **Select Rubrics**: Choose the rubrics you want to evaluate from the rubrics list
2. **Create Questions**: Add open-ended questions for students to answer
3. **Press Evaluate Button**: Press the evaluate button to start the evaluation process.

---
## Evaluation Process
1. **Student Answers**: Students will provide their answers to the questions
2. **AI Evaluation**: Our AI will evaluate each answer based on the provided rubrics
3. **Resouces to use**: The AI will use internet or local resources (depending on system memory) to evaluate the answer.

---
## Results
- **View Scores**: Press the score button example : [8/10] to view ai's justification for the score.
- **Re-evaluate**: Press the > Evaluation Input < and re-evaluate the answer.
- **AI Detection**: The answer will be scanned for AI usage and will be scored accordingly. Detaild breakdown can be shown.

---
## Save Evaluation
- **Save Evaluation**: Press the save button to save the evaluation results.
- **View History**: Saved evaluations can be viewed from the history tab.
- **Delete Evaluation**: Saved evaluations cannot be deleted.

---
## Tips for Better Evaluation
- Use clear, accurate, and specific questions
- Review AI evaluations for accuracy.

> Note: AI is not perfect and makes mistakes, so please review the evaluation results carefully.

`;
  return (
    <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-background/50 via-background/30 to-background/50">
      <div className="prose prose-xs max-w-none">
        <h1 className="text-3xl font-bold py-8">Using Open Ended Evaluation</h1>
        <Markdown text={instructions} className="text-uGrayLight" />
      </div>
    </div>
  );
};

export default EvaluateHelp;
