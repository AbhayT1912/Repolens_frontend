# RepoLink: Technical Documentation & Architecture

## 1️⃣ Project Overview
**RepoLink** is a production-grade, AI-powered codebase analysis platform designed to help developers and teams understand, navigate, and maintain complex repositories. In an era of rapidly growing codebases, RepoLink solves the "cognitive overload" problem by providing high-level architectural insights, interactive call graphs, and natural language querying directly against the source code.

This project specifically targets:
- **Onboarding Engineers**: Rapidly understanding a new codebase without manual tracing.
- **Architects**: Visualizing system structure and identifying anti-patterns or "spaghetti code."
- **Reviewers**: Analyzing the impact of pull requests before they are merged.

---

## 2️⃣ Features
- **GitHub Repository Analysis**: Automated parsing and indexing of entire repositories.
- **AI-Powered Code Explanation**: Deep-dive explanations of functions, classes, and logic.
- **PR Review Assistant**: AI-driven analysis of incoming pull requests for potential bugs and architecture violations.
- **RAG-Based Code Search**: Context-aware search that understands the meaning of code, not just keywords.
- **Interactive Call Graph**: Visualizing how functions interact across different modules.
- **Architecture Visualization**: High-level map of the system's layers and dependencies.
- **Developer Productivity Insights**: Metrics on code complexity, impact analysis, and technical debt.
- **Minecraft-Themed UI**: A unique, premium "gamified" developer experience using pixel-art aesthetics.

---

## 3️⃣ System Architecture
RepoLink follows a modern **microservices-oriented architecture** to ensure scalability and reliability.

- **Frontend**: Built with **React** and **Vite**, utilizing a highly custom "Minecraft-themed" design system. It uses **Clerk** for authentication and **Razorpay** for tiered subscription management.
- **Backend (API Gateway)**: A **Node.js/Express** service that handles request routing, authentication verification, and user management.
- **Repo Analyzer Service**: A specialized worker that clones repositories, parses ASTs (Abstract Syntax Trees), and extracts structural metadata.
- **AI RAG Service**: Integrates with **Gemini/OpenAI** models to provide intelligent answers. It handles "Code Chunking" and context injection.
- **Vector Database**: Uses **Pinecone** or **Milvus** to store and retrieve high-dimensional code embeddings.
- **Primary Database**: **MongoDB** for storing user profiles, repository metadata, and persistent analysis reports.
- **Caching Layer**: **Redis** is used for session management and caching expensive API responses (like graph layouts).

---

## 4️⃣ Architecture Diagram (ASCII)

```text
       [  User Browser  ]
              │
              ▼ (HTTPS / Clerk Auth)
      ┌─────────────────────────┐
      │    Frontend (React)     │
      └───────────┬─────────────┘
                  │
                  ▼ (REST API)
      ┌─────────────────────────┐
      │   API Gateway (Node.js) │
      └─────┬─────────────┬─────┘
            │             │
      ┌─────▼─────┐ ┌─────▼──────────┐
      │ Repo      │ │ AI RAG Service │
      │ Analyzer  │ │ (LLM + Vector) │
      └─────┬─────┘ └─────┬──────┬───┘
            │             │      │
      ┌─────▼─────┐ ┌─────▼───┐┌─▼─────────┐
      │ MongoDB   │ │ Pinecone││ Redis     │
      │ (Metadata)│ │ (Embeds)││ (Caching) │
      └───────────┘ └─────────┘└───────────┘
```

---

## 5️⃣ Data Flow: GitHub Repo Upload
1. **User Input**: User provides a GitHub URL in the dashboard.
2. **Cloning**: The `Repo Analyzer` clones the repo into a secure, ephemeral volume.
3. **AST Parsing**: The analyzer walks the file tree, parsing every file to extract functions, classes, and imports.
4. **Metadata Storage**: Structural data (folders/files/symbols) is saved to **MongoDB**.
5. **Embedding**: Code chunks are sent to the `AI RAG Service`, which generates embeddings.
6. **Vector Search Ready**: Embeddings are stored in **Pinecone** indexed by `repo_id`.
7. **Notification**: The frontend is notified via polling (or WebSockets) that the analysis is complete.

---

## 6️⃣ Workflow: Internal System Processing
`User` → `Submit URL` → `Clone` → `Parse AST` → `Extract Logic` → `Generate Embeddings` → `Store in Vector DB` → `AI Analysis Report` → `Dashboard Update`

---

## 7️⃣ Folder Structure (Ideal Production Layout)

```text
/
├── apps/
│   ├── web/               # React + Vite Frontend
│   └── backend/           # Express API Gateway
├── services/
│   ├── analyzer/          # AST Parsing & Structural Analysis
│   └── rag-engine/        # Python/FastAPI service for LLM & Vector Ops
├── packages/
│   ├── db/                # Shared Prisma/Mongoose schemas
│   └── ui/                # Shared Design System components
├── infra/                 # Docker Compose, K8s manifests, Terraform
└── docs/                  # Technical documentation
```
- **apps/web**: The premium Minecraft-themed UI.
- **services/analyzer**: The "heavy lifter" for repository processing.
- **services/rag-engine**: Handles complex retrieval-augmented generation logic.

---

## 8️⃣ Wireframes (ASCII)

### Landing Page
```text
+------------------------------------------+
|  RepoLink [Logo]       Login | Sign Up   |
+------------------------------------------+
|                                          |
|    UNDERSTAND YOUR CODE LIKE NEVER BEFORE |
|    [ Enter GitHub Repo URL ] [ ANALYZE ] |
|                                          |
+------------------------------------------+
|  Built for: FAANG, Startups, Indie Devs  |
+------------------------------------------+
```

### Dashboard / Analysis Page
```text
+------------------------------------------+
| Structure | Graph | AI Chat | PR Review  |
+------------------------------------------+
| [ File Tree ] | [ Call Graph Visualization]|
| src/          |           ( )---( )      |
|  main.js      |          /   \ /         |
|  utils/       |        ( )---( )         |
+------------------------------------------+
| [ AI Chat Box: "How does auth work?" ]   |
+------------------------------------------+
```

---

## 9️⃣ API Design

### `POST /v1/repos/analyze`
Starts the analysis for a new repository.
- **Request**: `{ "url": "github.com/user/repo", "branch": "main" }`
- **Response**: `{ "jobId": "uuid-123", "status": "queued" }`

### `POST /v1/repos/{id}/chat`
Query the repository using AI.
- **Request**: `{ "query": "Where is the database initialized?" }`
- **Response**: `{ "answer": "The database is initialized in `src/db.js`...", "sources": ["src/db.js"] }`

---

## 10️⃣ Database Schema (MongoDB)

### **Collection: `repositories`**
```json
{
  "_id": "ObjectId",
  "owner_id": "String",
  "name": "String",
  "github_url": "String",
  "status": "String (queued|processing|completed)",
  "metadata": {
    "language": "String",
    "loc": "Number",
    "file_count": "Number"
  }
}
```

### **Collection: `embeddings`**
(Metadata reference for Pinecone vectors)
```json
{
  "_id": "ObjectId",
  "repo_id": "ObjectId",
  "file_path": "String",
  "chunk_hash": "String",
  "content_preview": "String"
}
```

---

## 11️⃣ RAG Pipeline

1. **Chunking**: Code is split by function boundaries or a sliding window (500-1000 tokens) to preserve context.
2. **Metadata Tagging**: Each chunk is tagged with `file_path`, `imports`, and `exports`.
3. **Retrieval**: When a user asks a question, the top 5-10 most relevant code chunks are fetched using Cosine Similarity.
4. **Context Injection**: Code chunks are injected into a prompt: *"Based on the following code snippets, answer the user's question..."*
5. **Response Generation**: The LLM generates a structured response with file references.

---

## 12️⃣ Deployment Architecture
- **Vercel**: Hosts the React frontend (Global CDN, Serverless functions).
- **Render / AWS ECS**: Hosts the Node.js backend and specialized Workers.
- **MongoDB Atlas**: Managed multi-region database.
- **Docker**: All services are containerized for environment consistency.

---

## 13️⃣ Scaling Strategy
- **Horizontal Scaling**: API Gateway and Workers scale based on CPU/Queue depth.
- **Redis Queue**: Use BullMQ or RabbitMQ to handle repo analysis jobs asynchronously.
- **Database Sharding**: Metadata is sharded by `owner_id` to handle millions of repos.
- **Load Balancing**: Nginx or AWS ALB for traffic distribution.

---

## 14️⃣ Security
- **Clerk Auth**: Secure JWT-based authentication.
- **Environment Isolation**: Each repo analysis happens in an isolated container/sandbox.
- **Data Encryption**: All API keys and source code (if cached) are encrypted at rest.
- **GitHub OAuth**: Minimal scope requested to protect user privacy.

---

## 15️⃣ Future Improvements
- **Automated Refactoring Suggestions**: AI that writes PRs to fix tech debt.
- **IDE Integration**: VS Code extension for real-time architectural insights.
- **Architecture Drift Detection**: Alerts when code violates predefined structural rules.

---

## 16️⃣ README (Snippet)
Refer to the [README.md](file:///c:/Users/patid/Desktop/Acehack%20work/RepoLink_frontend-main/RepoLink_frontend-main/README.md) for installation and usage instructions.
