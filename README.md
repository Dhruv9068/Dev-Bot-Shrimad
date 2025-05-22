# Bhagavad Gita Chatbot

An interactive multilingual platform for engaging with the Shrimad Bhagavad Gita, featuring a 2D book viewer, AI-powered chatbot, and speech capabilities.

## Features

- **Interactive 2D Book Viewer**: Navigate through all 18 chapters with page-turning effects
- **Multilingual Support**: Access content in 20 languages including English, Hindi, and Sanskrit
- **AI-Powered Chatbot**: Ask questions about the Gita and receive contextual responses
- **Speech Capabilities**: Text-to-speech for translations and explanations, speech-to-text for chatbot interaction
- **Responsive Design**: Seamless experience across all devices
- **Accessibility Features**: Screen reader support, keyboard navigation, and more

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Speech**: Web Speech API
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/bhagavad-gita-chatbot.git
   cd bhagavad-gita-chatbot
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

3. Create a `.env.local` file with required environment variables (see `.env.example`).

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions on deploying to Netlify.

## Project Structure

\`\`\`
bhagavad-gita-chatbot/
├── app/                  # Next.js app directory
│   ├── actions/          # Server actions
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── book-viewer-2d.tsx    # 2D book viewer
│   ├── chat-interface.tsx    # Chatbot interface
│   ├── language-selector.tsx # Language selection
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── public/               # Static assets
│   ├── audio/            # Audio files
│   └── data/             # JSON data files
└── styles/               # Global styles
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed by Dhruv Chaturvedi
- Sanskrit text and translations sourced from [source]
- Special thanks to [acknowledgments]
