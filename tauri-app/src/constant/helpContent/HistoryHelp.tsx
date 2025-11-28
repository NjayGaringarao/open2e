import Markdown from "@/components/Markdown";

const HistoryHelp = () => {
  const instructions = `

---
## Getting Started
The Evaluation History page stores and organizes all evaluations you have run, allowing you to review past scores and the AI's justification.

---
## Evaluation History List
This list shows a summary of every evaluation.

1.  **Filter by Date**: Use the date range selector (e.g., **Oct 18, 2025 - Oct 20, 2025**) to limit the displayed results to a specific time period.
2.  **Sort Order**: Click the **Oldest First** button to toggle the sorting order of the results (either oldest to newest or newest to oldest).
3.  **View Details**: Click anywhere on a specific evaluation entry to open the **Evaluation Details** pop-up.
4.  **Summary Information**: Each entry shows:
    * The **Question** you submitted.
    * The **Answer** that was evaluated.
    * The **Rubric** used (e.g., Default Rubric).
    * The **LLM** that performed the evaluation (e.g., phi4-mini, gpt-4o).
    * The **Final Score** and total points (e.g., 0/10, 10/10).

---
## Evaluation Details (Pop-up)
This pop-up provides a complete record of a single evaluation.

1.  **Review Input**: The top section displays the exact **Question** and **Answer** that were submitted.
2.  **LLM's Justification for the Score**: This is the AI's reasoning for the score it assigned, based on the rubric.
3.  **View Rubric**: Click the **View Rubric Used for Scoring** link to open a read-only view of the rubric criteria that were applied to the answer.
4.  **Metadata**: The bottom of the pop-up confirms the **LLM Model Used** and the **Creation date** of the evaluation.

> Tip: If a score seems inaccurate, reviewing the **LLM's Justification** and the **Rubric Used** can help you understand the scoring decision.

`;
  return (
    <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-background/50 via-background/30 to-background/50">
      <div className="prose prose-xs max-w-none">
        <h1 className="text-3xl font-bold py-8">Viewing Evaluation History</h1>
        <Markdown text={instructions} className="text-uGrayLight" />
      </div>
    </div>
  );
};

export default HistoryHelp;
