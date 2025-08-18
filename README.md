# Open2E - Automated Evaluation of Open Ended Response for Basic Computer Literacy

[![Open2E Logo](app-icon.png)](app-icon.png)

## Overview

Open2E is a desktop application built with Tauri that provides automated evaluation of open-ended student responses for basic computer literacy assessments. The application uses AI-powered evaluation to score student answers on a scale of 0-10, providing detailed justifications and learning suggestions.

## Features

### 🎯 **AI-Powered Evaluation**
- Automated scoring of open-ended responses (0-10 scale)
- Detailed justifications for each score
- Support for both online (OpenAI) and offline (Ollama) evaluation modes
- AI detection to identify potentially AI-generated responses

### 💬 **Interactive Chat System**
- Built-in chat interface for discussing computer literacy topics
- Context-aware responses focused on educational content
- Voice interaction capabilities with speech recognition

### 📊 **Student Management**
- Track and manage student responses
- Historical evaluation data storage
- Performance analytics and insights

### 🔧 **Flexible Deployment**
- Works offline with local Ollama integration
- Online mode with cloud-based evaluation
- Cross-platform desktop application

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Chakra UI
- **Backend**: Tauri (Rust)
- **AI Models**: 
  - Online: OpenAI API
  - Offline: Ollama with Phi-4 Mini model
- **Database**: SQLite (local storage)
- **Additional**: Speech recognition, Voice visualization, Markdown rendering

## Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (latest stable version)
- **Windows 10/11** (currently optimized for Windows)
- **Minimum 8GB RAM** (for offline AI evaluation)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd open2e
```

### Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust dependencies (if not already installed)
cargo install tauri-cli
```

### Step 3: Build and Run

```bash
# Development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Usage

### First Launch

1. **Initial Setup**: The application will automatically download and install Ollama for offline AI capabilities
2. **Model Installation**: The Phi-4 Mini model will be downloaded automatically for local evaluation
3. **Configuration**: Set up your preferences in the Settings panel

### Main Features

#### 📝 **Evaluation Mode**
1. Navigate to the "Evaluate" tab
2. Enter or paste your question about computer literacy
3. Input the student's answer
4. Click "Evaluate" to get an AI-powered assessment
5. Review the score (0-10), detailed justification, and suggested learning resources

#### 💬 **Chat Mode**
1. Go to the "Chat" tab
2. Ask questions about computer literacy topics
3. Get educational responses and explanations
4. Use voice interaction for hands-free operation

#### ⚙️ **Settings**
- Configure AI model preferences
- Manage offline/online evaluation modes
- Adjust voice and speech settings
- View system information and requirements

### Evaluation Rubric

The application uses a comprehensive scoring system:

| Score | Criteria |
|-------|----------|
| **10** | Accurate, complete, and relevant response with expected core concepts |
| **9** | Mostly correct and relevant with minor omissions |
| **8** | Correct but noticeably incomplete or brief |
| **7** | Partially correct with weak justification |
| **6** | Fragmented answer with major missing ideas |
| **5 and below** | Incorrect, irrelevant, or nonsensical information |

## Development

### Project Structure

```
open2e/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Application pages
│   ├── context/           # React context providers
│   ├── lib/               # Utility libraries
│   └── database/          # Database operations
├── src-tauri/             # Tauri backend
│   ├── src/               # Rust source code
│   ├── scripts/           # PowerShell scripts
│   └── Cargo.toml         # Rust dependencies
└── windows/               # Application windows
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run tauri        # Run Tauri commands
```

### Database Schema

The application uses two SQLite databases:
- `evaluator.db`: Stores evaluation data and results
- `learner.db`: Stores student responses and learning analytics

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11
- **RAM**: 8GB (16GB recommended for offline AI)
- **Storage**: 2GB free space
- **Internet**: Required for initial setup and online mode

### Recommended Requirements
- **OS**: Windows 11
- **RAM**: 16GB
- **Storage**: 5GB free space
- **Internet**: Stable connection for online features

## Troubleshooting

### Common Issues

1. **Ollama Installation Fails**
   - Ensure PowerShell execution policy allows script execution
   - Check Windows Defender isn't blocking the installation
   - Restart the application and try again

2. **AI Evaluation Not Working**
   - Verify internet connection for online mode
   - Check system memory (minimum 8GB required)
   - Restart the application to reinitialize Ollama

3. **Voice Features Not Working**
   - Ensure microphone permissions are granted
   - Check browser/application microphone access
   - Verify speech recognition is enabled in Windows

### Getting Help

If you encounter issues:
1. Check the application logs in the Settings panel
2. Restart the application
3. Ensure all system requirements are met
4. Contact support with detailed error information

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

[Add your license information here]

## Team

- **Alyssa Jane P. Marquez** - Principal Investigator
- **Niño Jr V. Garingarao** - Software Engineer  
- **John Paul C. Marquez** - Research & Development Support

## Acknowledgments

This project is designed for educational assessment and computer literacy evaluation. Special thanks to the open-source community for the tools and libraries that made this project possible.
