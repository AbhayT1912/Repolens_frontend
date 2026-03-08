# 📦 RepoLink: AI-Powered Repository Intelligence

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAbhayT1912%2FRepolens_frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RepoLink** is a production-grade codebase analysis platform that transforms how developers interact with their repositories. Using a sophisticated RAG (Retrieval-Augmented Generation) pipeline and interactive visualizations, RepoLink provides deep architectural insights, call graphs, and natural language querying capabilities.

---

## ✨ Features

- **🔍 Intelligent Code Search**: Find logic and patterns using natural language, not just keywords.
- **🕸 Interactive Call Graph**: Visualize function relationships and dependencies in real-time.
- **📊 Architecture Analytics**: Gain insights into code complexity, impact analysis, and technical debt.
- **🔍 AI PR Analysis**: Automated reviews for pull requests to ensure code quality and consistency.
- **🎨 Minecraft-Themed UI**: A unique, premium developer experience with pixel-art aesthetics.
- **🔐 Secure & Scalable**: Enterprise-grade authentication via Clerk and scalable microservices architecture.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbhayT1912/Repolens_frontend.git
   cd RepoLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_API_URL=https://api.repolink.com/v1
   VITE_RAZORPAY_KEY=your_razorpay_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 🏗 System Architecture

RepoLink utilizes a distributed architecture to handle large-scale repository processing.

- **Frontend**: React + Vite (Minecraft-themed UI)
- **Backend API**: Node.js / Express
- **Analysis Workers**: AST Parsing & Metadata Extraction
- **RAG Engine**: Python-based LLM integration (Gemini/OpenAI)
- **Vector Storage**: Pinecone / Milvus
- **Caching**: Redis

For a deep dive into the architecture, see our [Full Technical Documentation](./DOCUMENTATION.md).

---

## 🛠 Tech Stack

- **Frontend**: React, React Router, Vite, Clerk (Auth), Razorpay (Payments)
- **Backend**: Node.js, Express, MongoDB (Metadata)
- **AI/ML**: LangChain, Pinecone (Vector DB), Gemini Pro
- **Infrastructure**: Vercel (Frontend), AWS/Render (Backend Services), Docker

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing bugs, improving documentation, or suggesting new features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Support

If you have any questions or need help, please open an issue or contact us at `support@repolink.com`.

**Built with ❤️ by the RepoLink Team.**
