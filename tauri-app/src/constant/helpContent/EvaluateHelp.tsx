import Markdown from "@/components/Markdown";

const EvaluateHelp = () => {
  const instructions = `

---
## Getting Started
1. **Select Rubric**: Choose a rubric from the dropdown in the Input card
2. **Enter Question**: Type or use voice input to add the question you want to evaluate
3. **Enter Answer**: Type or use voice input to add the student's answer
4. **Evaluate**: Click the "Evaluate" button in the Input card header when all fields are filled

---
## Interface Overview
The evaluation interface uses a **horizontal carousel** with two cards:

### Input Card
- Contains: Rubric picker, Question input, and Answer input
- **Evaluate Button**: Appears in the header when all inputs are ready
- **View Result Button**: Appears after evaluation to navigate to results

### Output Card
- Automatically appears after evaluation completes
- Contains: Score display, Justification, AI Detection, and Recommended articles
- **Save Button**: Save the evaluation to history (appears when not saved)
- **Delete Button**: Clear the evaluation result and return to Input card
- **View Input Button**: Navigate back to the Input card

---
## Evaluation Process
1. **Fill Required Fields**: Select a rubric, enter a question, and provide an answer
2. **Click Evaluate**: The Evaluate button in the Input card header will start the process
3. **Loading State**: A loading overlay appears during evaluation
4. **Auto-Navigation**: The interface automatically scrolls to the Output card when evaluation completes
5. **Resources**: The AI uses internet or local resources (depending on system memory and connection)

---
## Viewing Results

### Score Display
- The score appears as a large colored badge (e.g., 8/10) indicating performance level
- Color coding: Red (low) to Green (high) based on score percentage

### Justification
- Detailed explanation of the score is displayed next to the score badge
- Use the volume button to hear the justification read aloud
- Scroll to view the full justification text

### AI Detection
- **Semi-Circle Speedometer**: Shows the AI detection percentage (0-100%)
- **Color Indicators**: 
  - Green (<60%): Low AI probability
  - Yellow (60-84%): Medium AI probability  
  - Red (85%+): High AI probability
- **Token Highlights**: Colored text shows which parts of the answer have higher AI probability
- **Note**: AI detection is not perfect and may have false positives/negatives

### Recommended Articles
- Articles related to the topic appear below the results
- Click any article to open it in your browser

---
## Navigation
- **Swipe or Scroll**: Use horizontal swipe gestures or scroll to move between Input and Output cards
- **View Result Button**: In Input card header (when result exists) - navigates to Output card
- **View Input Button**: In Output card header - navigates back to Input card

---
## Managing Evaluations

### Save Evaluation
- Click the **Save** button in the Output card header
- Saved evaluations appear in the History tab
- Once saved, the Save button disappears

### Clear Result
- Click the **Delete** button in the Output card header
- Clears the evaluation result and returns to Input card
- Allows you to start a new evaluation

### Re-evaluate
- After viewing results, navigate back to Input card using "View Input" button
- Modify the answer if needed
- Click "Evaluate" again to re-run the evaluation

---
## Tips for Better Evaluation
- **Clear Questions**: Use specific, well-defined questions for more accurate evaluations
- **Review Results**: Always review AI evaluations for accuracy
- **Check AI Detection**: Use AI detection scores as a guide, not absolute truth
- **Explore Articles**: Review recommended articles for additional learning resources

---
## Additional Features
- **Voice Input**: Use the microphone icon to input questions and answers via speech
- **Text-to-Speech**: Click the volume icon to hear the justification read aloud
- **Continue to Chat**: Click "Continue to Chat" to discuss the topic further with the AI assistant

> **Note**: AI is not perfect and makes mistakes. Please review evaluation results carefully and use your judgment.

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
