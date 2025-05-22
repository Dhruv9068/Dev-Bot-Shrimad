
# 📖 Dev Bot Shrimad: Spritual Journey begin poe

An interactive, multilingual platform to explore the *Shrimad Bhagavad Gita*, enriched with a 2D book-viewing experience, AI-powered chatbot interaction, and speech integration for a highly accessible and engaging user journey.

---

## ✨ Features

* 📘 **Interactive 2D Book Viewer**: Flip through all 18 chapters with smooth page-turning effects.
* 🌐 **Multilingual Support**: Read and interact in 20+ languages including English, Hindi, Sanskrit, and more.
* 🤖 **AI-Powered Chatbot**: Ask contextual questions about verses, teachings, or chapters — get accurate, insightful responses.
* 🎙 **Speech Capabilities**:

  * **Text-to-Speech**: Listen to translations and explanations.
  * **Speech-to-Text**: Talk to the chatbot using your voice.
* 📱 **Responsive Design**: Works flawlessly across mobile, tablet, and desktop devices.
* ♿ **Accessibility-First**: Includes screen reader support, keyboard navigation, and other inclusive features.

---

## 🛠 Technology Stack

* **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **UI Components**: [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
* **Speech**: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
* **Deployment**: [Netlify](https://www.netlify.com/)

---

## 🚀 Getting Started

### ✅ Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or higher)
* `npm` or `yarn` installed globally

### 🔧 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/bhagavad-gita-chatbot.git
   cd bhagavad-gita-chatbot
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**:

   * Create a `.env.local` file in the root directory.
   * Copy contents from `.env.example` and fill in required values.

4. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deployment

Deploy seamlessly to Netlify. Follow the detailed instructions in [`NETLIFY_DEPLOYMENT.md`](./NETLIFY_DEPLOYMENT.md) for setup and environment configuration.

---

## 📁 Project Structure

```
bhagavad-gita-chatbot/
├── app/                  # Next.js app directory
│   ├── actions/          # Server-side actions
│   ├── api/              # API endpoints
│   ├── layout.tsx        # App layout component
│   └── page.tsx          # Landing/home page
├── components/           # Reusable UI & logic components
│   ├── book-viewer-2d.tsx    # Flipbook-style Gita viewer
│   ├── chat-interface.tsx    # AI chatbot component
│   ├── language-selector.tsx # Language switcher
│   └── ui/               # shadcn/ui based UI elements
├── hooks/                # Custom React hooks
├── public/               # Static assets (images, audio, JSON)
│   ├── audio/            
│   └── data/             
├── styles/               # Tailwind/global styles
└── .env.example          # Sample env variables
```

---

## 🤝 Contributing

We welcome contributions to improve this experience for all. To contribute:

1. Fork the repo
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your updates: `git commit -m "Add feature"`
5. Push to the branch: `git push origin feature-name`
6. Submit a Pull Request

---

## 📫 Contact

For questions, ideas, or feedback, reach out at: **[info@yourdomain.com](mailto:info@yourdomain.com)**

---

## 🕉️ May the wisdom of the Gita guide your code and your life.


