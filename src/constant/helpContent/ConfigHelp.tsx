import Markdown from "@/components/Markdown";

const ConfigHelp = () => {
  const instructions = `

---
## Getting Started
This page allows you to customize the appearance, backup and restore your data, set up text-to-speech, and view the current LLM source and capability for the entire application.

---
## Appearance
1. **Theme**: Switch between **Light** and **Dark** mode to change the visual theme of the application. The current setting is highlighted.

---
## Backup and Restore
This section allows you to backup and restore your data. This includes all your evaluations, rubrics, and AI Chats.
1. **Backup**: Click the \`[ Create Backup ]\` and select a folder to save the backup file.
2. **Restore**: Click the \`[ Restore from Backup ]\` and select the backup file to restore your data.

> Note: Restoring from backup will completely replace all existing data including evaluations, rubrics, and AI Chats. Make sure to create a backup before restoring if you want to keep your current data.

---
## LLM Source and Capability
This is the most critical section, defining which **Large Language Model (LLM)** powers the AI features.

### Switching LLMs
* **Online LLMs (e.g., OpenAI GPT-4o)**: These require a **live internet connection** to function. They are generally faster and more powerful.
* **Local LLMs (e.g., Microsoft Phi4-mini)**: These run **offline** using your system's resources (CPU/GPU). They do not require the internet but may be slower.

### Feature Status Table
This table shows which AI features are available based on the currently selected LLM and internet connection.

| Feature | Description | Status Indication |
|---|---|---|
| **Available** (✔) | The feature is fully functional and ready to use. | **Green** indicates the feature is available. |
| **Unavailable** (X) | The feature is not working, often due to a missing requirement (e.g., missing **Internet** for AI Detection on Local LLM). | **Red** indicates the feature is unavailable. |

### Troubleshooting
* **Reinstall Local LLM**: If you encounter issues with a local model, click **Reinstall Local LLM** at the bottom to attempt to fix the local installation.
* **Connectivity**: If using an Online LLM, ensure your device has a stable internet connection.

> Note: Feature availability (Evaluation, AI Detection, AI Chat) can change instantly based on your chosen LLM and network status.

---
## Text to Speech
This section controls the audio output settings used throughout the application.

1. **Voice Selection**: Use the dropdown menu (e.g., **Microsoft David - English (United States) (en-US)**) to select a different voice.
2. **Adjust Controls**:
    * **Rate**: Controls the speed of the speech.
    * **Pitch**: Adjusts the tone or frequency of the voice.
    * **Volume**: Sets the loudness of the audio output.

`;
  return (
    <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-background/50 via-background/30 to-background/50">
      <div className="prose prose-xs max-w-none">
        <h1 className="text-3xl font-bold py-8">Configuring Open2E</h1>

        <Markdown text={instructions} className="text-uGrayLight" />
      </div>
    </div>
  );
};

export default ConfigHelp;
