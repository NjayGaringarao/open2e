import Markdown from "@/components/Markdown";

const RubricHelp = () => {
  const instructions = `

---
## Getting Started
This page will allow you to view, and manage the scoring criteria (analytical rubrics) that you can use for evaluations. Open2E provides a default rubric for you to use, but you can create your own custom rubrics to suit your needs.

---
### Rubric List
1. **View Rubric**: Click on any rubric name (e.g., **Default Rubric**) to view its details and score brackets.
2. **Create New Rubric**: Press the **+ Create New Rubric** button to define a new set of scoring rules.
3. **Delete Rubric**: Click the **trash icon** (🗑) next to a custom rubric to remove it from the system.

---
## Viewing a Rubric
This screen provides a list of your scoring models. Each Item's full details can be viewed by clicking on the item.
* **Rubric Name**: The name of the rubric.
* **Total Score**: The total score of the rubric.
* **Score Brackets**: Review the quality descriptions associated with each point range.
* **Additional Notes**: Check for any specific instructional rules the AI must follow during evaluation.

---
## Creating a New Rubric
Use this form to build a detailed scoring guide for the AI.

1. **Set Basics**: Provide a **Rubric Name** and define the **Total Score** (e.g., 10, 20).
2. **Define Score Brackets**:
    * Click **+ Add Score Bracket** to define a range of points (e.g., 0-4 points, 5-7 points).
    * For each bracket, write a clear, detailed criteria of the expected answer quality to earn that score.
3. **Additional Notes (Optional)**: Use this space for any special grading instructions for the AI, such as rules for proportional scoring.
4. **Ensure Coverage**: The **Score Coverage** bar must reach **100% Complete**. This means you have defined descriptions for every possible point from 0 up to your Total Score.
5. **Save**: Click **Save Rubric** once all ranges are covered.

> Note: Detailed, specific score bracket descriptions lead to more accurate and reliable AI evaluations.

---
## Updating a Rubric
Each item in the list can be edited by clicking the **edit icon**. This will open a form to edit the details of a rubric.
* Updating a rubric will not update the rubric in any evaluations that have already used it.

---
## Deleting a Rubric
Each item in the list can be deleted by clicking the **delete icon**. This will open a confirmation dialog to delete the rubric.
* Deleting a rubric will not delete the rubric from any evaluations that have already used it.



`;
  return (
    <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-background/50 via-background/30 to-background/50">
      <div className="prose prose-xs max-w-none">
        <h1 className="text-3xl font-bold py-8">Managing Rubrics</h1>
        <Markdown text={instructions} className="text-uGrayLight" />
      </div>
    </div>
  );
};

export default RubricHelp;
