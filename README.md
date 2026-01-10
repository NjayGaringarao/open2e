# Open2E - Automated Evaluation of Open Ended Response for Basic Computer Literacy

[![Open2E Logo](app-icon.png)](app-icon.png)

## Overview

Open2E is a desktop application built with Tauri that provides automated evaluation of open-ended student responses for basic computer literacy assessments. The application uses AI-powered evaluation with customizable rubrics.

## Features

### 🎯 **AI-Powered Evaluation**

- Automated scoring of open-ended responses
- Detailed justifications for each score
- Support for both online (OpenAI) and offline (Ollama) evaluation modes
- AI detection to identify potentially AI-generated responses

### 💬 **Interactive Chat System**

- Built-in chat interface for discussing computer literacy topics
- Context-aware responses focused on educational content
 

### 📊 **Analytics**

- Historical evaluation data storage
- Performance analytics and insights

### 🔧 **Flexible Deployment**

- Works offline with local Ollama integration
- Online mode with cloud-based evaluation

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Chakra UI
- **Backend**: Tauri (Rust)
- **AI Models**:
  - Online: OpenAI GPT-4o
  - Offline: Ollama with Phi-4 Mini model
- **Database**: SQLite (local storage)
- **Additional**: Markdown rendering

## Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (latest stable version)
- **Windows 11** (currently optimized for Windows)
- **Recommended 16GB RAM** (for offline AI evaluation)

### Step 1: Clone the Repository

```bash
git clone https://github.com/NjayGaringarao/open2e
cd open2e
```

### Step 2: Install Dependencies

```bash
# Navigate to the Tauri app directory
cd tauri-app

# Install Node.js dependencies
npm install
```

### Step 3: Build and Run

```bash
# Development mode
npm run tauri dev

# Build for production
npm run build:installer
```

## Usage

### First Launch

1. **Initial Setup**: The application will automatically download and install Ollama for offline AI capabilities
2. **Model Installation**: The Phi-4 Mini model will be downloaded automatically for local evaluation
3. **Configuration**: Set up your preferences in the Settings panel

### Main Features

#### 📝 **Evaluation Mode**

1. Navigate to the "Evaluate" tab
2. Select a rubric for scoring
3. Enter or paste your question about computer literacy
4. Input the student's answer
5. Click "Evaluate" to get an AI-powered assessment
6. Review the score, detailed justification, and suggested learning resources

#### 💬 **Chat Mode**

1. Go to the "Chat" tab
2. Ask questions about computer literacy topics
3. Get educational responses and explanations
 

#### ⚙️ **Settings**

- Configure Appearance
- Backup and Restore
- View LLM Source and concurrent capability
 

### Evaluation Rubric

Open2E supports customizable rubrics for evaluating student responses:

1. **Define or Edit Rubric:**

   - Navigate to the **Rubric Page** to create a grading rubric that fits your assessment criteria.
   - Rubrics support analytic-type rubrics. Define descriptions for each scoring bracket to enable detailed and transparent evaluation.

2. **Apply Rubric During Evaluation:**
   - In the **Evaluation** page, select your preferred rubric before evaluation.
   - The selected rubric will be used to grade open-ended responses, ensuring consistency and clarity in scoring.

You can update rubrics anytime to refine assessment standards, enabling flexible and accurate evaluation for various assignments and learning objectives.

## Development

### Project Structure

```
open2e/
├── tauri-app/                   # Tauri desktop application
│   ├── src/                     # Frontend source code
│   │   ├── components/          # React components
│   │   │   ├── analytics/      # Analytics dashboard components
│   │   │   ├── chat/           # Chat system components
│   │   │   ├── container/      # Container and modal components
│   │   │   ├── evaluate/       # Evaluation components
│   │   │   ├── history/        # Evaluation history components
│   │   │   ├── rubric/         # Rubric management components
│   │   │   ├── settings/       # Settings panel components
│   │   │   ├── setup/          # Setup wizard components
│   │   │   └── ui/            # Reusable UI components
│   │   ├── constant/           # Application constants
│   │   │   ├── eula.ts        # End User License Agreement
│   │   │   ├── helpContent/   # Help content components
│   │   │   └── ...            # Other constants
│   │   ├── context/            # React context providers
│   │   │   ├── main/          # Main application context
│   │   │   ├── setup/         # Setup wizard context
 
│   │   ├── database/           # Database operations
│   │   │   ├── analytics/     # Analytics data management
│   │   │   └── ...            # Database schemas and operations
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries
│   │   │   ├── ollama/        # Ollama integration
│   │   │   ├── openai/        # OpenAI API integration
│   │   │   └── sapling/       # Sapling AI integration
│   │   ├── models/             # TypeScript type definitions
│   │   ├── pages/              # Application pages
│   │   │   ├── main/          # Main application pages
│   │   │   └── setup/         # Setup wizard pages
│   │   ├── types/              # Type definitions
│   │   └── utils/              # Utility functions
│   ├── src-tauri/              # Tauri backend (Rust)
│   │   ├── src/                # Rust source code
│   │   │   ├── commands/      # Tauri commands
│   │   │   ├── migrations/    # Database migrations
│   │   │   └── scripts/       # PowerShell scripts
│   │   ├── icons/              # Application icons
│   │   └── capabilities/      # Tauri capabilities
│   ├── public/                 # Static assets
│   ├── dist/                   # Build output
│   ├── EULA.txt                # End User License Agreement
│   ├── package.json            # Node.js dependencies
│   └── ...                     # Other Tauri app files
├── next-app/                # Next.js web server
│   ├── src/                    # Next.js source code
│   │   ├── app/                # Next.js app directory
│   │   │   ├── api/           # API routes
│   │   │   └── ...            # Next.js pages
│   │   ├── components/         # React components
│   │   ├── lib/               # Utility libraries
│   │   └── types/             # Type definitions
│   ├── public/                # Static assets
│   └── package.json           # Node.js dependencies
├── LICENSE.md                  # Project license
└── README.md                   # Project documentation
```

### Available Scripts

Navigate to the `tauri-app` directory first, then run:

```bash
npm run tauri dev          # Start development server
npm run tauri build        # Creates Binary Installer
```

### Database Schema

The application uses two SQLite databases:

- `main.db`: Stores rubrics, questions, evaluations, conversation, and messages

## System Requirements

### Minimum Requirements

- **OS**: Windows 11
- **RAM**: 4GB (16GB recommended for offline AI)
- **Storage**: 10GB free space
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
   - Check system memory (16GB required is required for offline mode)
   - Restart the application to reinitialize Ollama

 

### Getting Help

If you encounter issues:

1. Check the application logs in the Settings panel
2. Restart the application
3. Ensure all system requirements are met
4. Contact support with detailed error information

## Contributing

We welcome contributions! Please contact us for more information.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. See [LICENSE.md](LICENSE.md) for full details.

**Summary**: You are free to share and adapt this material for non-commercial purposes, provided you give appropriate credit to the original creators.

## Team

- **Alyssa Jane P. Marquez** - Principal Investigator
- **Niño Jr V. Garingarao** - Software Engineer
- **John Paul C. Marquez** - Research & Development Support

## Acknowledgments

This project is designed for educational assessment and computer literacy evaluation. Special thanks to the open-source community for the tools and libraries that made this project possible.
