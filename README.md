
# TaxCopilot

**TaxCopilot** is an advanced AI-powered legal and tax workspace designed to streamline case management, document analysis, and drafting. It acts as an intelligent assistant for legal and tax professionals by providing tools for organizing documents, performing deep research, engaging in conversational analysis, and writing professional drafts in a rich text editor.

## ✨ Key Features

- **💼 Intelligent Case Management**
  - Organize files, drafts, and notes by client and case.
  - Interactive sidebar navigation to switch contexts instantly.

- **🔍 AI-Powered Document Analysis**
  - Instant file uploading with secure processing.
  - **Deep Research Mode:** Summarize notices, extract key information, and find specific legal precedents from hundreds of pages.
  - Answers are accompanied by source citations to help professionals verify references.

- **💬 Multi-Mode Case Chat**
  - **Normal Chat:** Converse naturally with context about your active case.
  - **Analysis / Deep Research:** Instruct the AI to scrutinize uploaded documents for specific details.
  - **Create Draft:** Automatically generate formatted letters, responses, or memos based directly on chat instructions.

- **📝 Advanced Document Editor**
  - Built-in rich text editor powered by Tiptap.
  - Pagination and A4-ready layouts identical to Google Docs or Word.
  - Advanced formatting: headings, custom font families, real sizes (pt), text coloring, highlights, alignment, and quotes.
  - Beautiful auto-export to PDF preserving exact typography and sizing.

- **🔐 Secure Authentication**
  - Secure login/signup system with a polished modern UI.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Editor:** [Tiptap](https://tiptap.dev/) (Headless Editor Framework)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **PDF Export:** [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Installation

Clone this repository and install the required dependencies:

\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables

Create a \`.env.local\` file in the root of the project and define your AI configuration:

\`\`\`env
# Set your Gemini API key (Required for AI Chat, Analysis, and Drafting)
GEMINI_API_KEY=your_api_key_here
\`\`\`

### 3. Run the Development Server

Start the application locally:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- \`app/\` - Next.js App Router folders (Auth, Workspace, Editor, Case views).
- \`components/\` - Reusable React components (Chat UI, Editor toolbar, Sidebars).
- \`hooks/\` - Custom React hooks for interacting with state and services.
- \`services/\` - Client/server-side services for calling backend APIs (AI inference, documents).
- \`lib/\` - Tiptap extensions and utility functions.
- \`public/\` - Static assets including images and fonts.

## 📄 License

This project is proprietary and confidential. All rights reserved.
