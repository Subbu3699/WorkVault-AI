# WorkVault AI

### Enterprise AI-Powered Document Intelligence & Knowledge Retrieval Platform

WorkVault AI is an AI-powered document intelligence platform that enables users to upload, organize, search, and interact with private documents using Retrieval-Augmented Generation (RAG).

It combines semantic search, vector embeddings, and large language models to provide context-aware answers grounded in uploaded documents.

## Key Features

- **Secure Authentication:** User registration, login, JWT-based authentication, and protected APIs.
- **Document Management:** Upload and process PDF and DOCX files.
- **Document Processing:** Automatic text extraction and intelligent text chunking.
- **Semantic Search:** Find relevant document content using vector embeddings.
- **RAG-Based AI Assistant:** Ask natural-language questions about uploaded documents.
- **Source Citations:** Answers include relevant document names and source chunks.
- **User Data Isolation:** Users can access only their own uploaded documents.
- **Database Integration:** PostgreSQL with pgvector for vector storage and similarity search.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL, SQLAlchemy |
| Vector Search | pgvector |
| AI / Embeddings | Sentence Transformers, Ollama |
| Language Model | Llama 3.2 (1B) |
| Authentication | JWT, Password Hashing |
| Document Processing | PyPDF, python-docx |
| Infrastructure | Docker, Docker Compose |
| Testing | Pytest |
| Version Control | Git, GitHub |

### AI and Retrieval Configuration

| Component | Configuration |
|---|---|
| Language Model | Ollama - Llama 3.2 (1B) |
| Embedding Model | sentence-transformers/all-MiniLM-L6-v2 |
| Embedding Dimensions | 384 |
| Embedding Normalization | Enabled |
| Chunk Size | 1,000 characters |
| Chunk Overlap | 150 characters |
| Vector Database | PostgreSQL + pgvector |

## System Architecture

```text
                         USER
                           |
                           v
                  React + TypeScript
                       Frontend
                           |
                        REST API
                           |
                           v
                        FastAPI
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
       Authentication  Document       AI Chat
                       Processing        |
                           |             v
                           v         RAG Pipeline
                     Text Chunking       |
                           |             v
                           v        Semantic Search
                      Embeddings         |
                           |             |
                           +-------------+
                                  |
                                  v
                         PostgreSQL + pgvector
                                  |
                                  v
                           Relevant Context
                                  |
                                  v
                              Ollama LLM
                                  |
                                  v
                           Answer + Sources
```

## How It Works

1. A user registers and logs in securely.
2. The user uploads a PDF or DOCX document.
3. The backend extracts the document text.
4. Extracted text is divided into manageable chunks.
5. Sentence Transformers generate vector embeddings.
6. Embeddings are stored in PostgreSQL using pgvector.
7. The user asks a question through the AI assistant.
8. Semantic search retrieves relevant document chunks.
9. The LLM generates an answer using the retrieved context.
10. The response includes relevant source documents.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Authenticate a user |
| POST | `/auth/token` | Generate OAuth2 access token |
| GET | `/auth/me` | Get authenticated user |
| POST | `/documents/upload` | Upload a document |
| GET | `/documents` | List user documents |
| POST | `/search` | Semantic document search |
| POST | `/chat` | Ask questions using RAG |
| GET | `/health` | Backend health check |
| GET | `/health/database` | Database health check |

## Local Setup

### Prerequisites

Install the following software:

- Python 3.13+
- Node.js and npm
- Docker Desktop
- Git
- Ollama

### 1. Clone the Repository

```powershell
git clone https://github.com/Subbu3699/WorkVault-AI.git
cd WorkVault-AI
```

### 2. Configure Environment Variables

Create a `.env` file in the project root directory.

Add the following variables:

```env
POSTGRES_PASSWORD=your_secure_database_password
JWT_SECRET_KEY=your_long_random_secret_key
```

Use your own secure values. Never upload your actual `.env` file or credentials to GitHub.

### 3. Start PostgreSQL with pgvector

Make sure Docker Desktop is running.

From the project root, execute:

```powershell
docker compose up -d db
```

Verify the database container:

```powershell
docker compose ps
```

Wait until the database reports a healthy status.

### 4. Configure and Start the Backend

From the project root, create a Python virtual environment:

```powershell
python -m venv backend/.venv
```

Activate it:

```powershell
.\backend\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r backend/requirements.txt
```

Configure the Python module path:

```powershell
$env:PYTHONPATH = "$PWD\backend"
```

Run database migrations:

```powershell
alembic -c alembic.ini upgrade head
```

Start the FastAPI server:

```powershell
python -m uvicorn app.main:app --reload --app-dir backend --host 127.0.0.1 --port 8001
```

Backend API documentation:

http://127.0.0.1:8001/docs

### 5. Configure Ollama

Install Ollama and make sure its local service is running.

Download the configured language model:

```powershell
ollama pull llama3.2:1b
```

Verify the downloaded model:

```powershell
ollama list
```

The embedding model, `sentence-transformers/all-MiniLM-L6-v2`, is loaded by Sentence Transformers when required. An internet connection is needed for its initial download unless the model is already cached locally.

### 6. Start the Frontend

Open a second terminal in VS Code.

Navigate to the frontend directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev -- --port 5174
```

### 7. Access the Application

| Component | URL |
|---|---|
| Frontend | http://localhost:5174/ |
| Backend API | http://127.0.0.1:8001/ |
| API Documentation | http://127.0.0.1:8001/docs |
| Database Health | http://127.0.0.1:8001/health/database |

Keep Docker, Ollama, the backend terminal, and the frontend terminal running while using the application.

## Testing

Automated backend tests are implemented using Pytest.

Run the tests from the project root:

```powershell
python -m pytest -v
```

**Latest recorded test result: 13 tests passed.**

Test coverage includes:

- Password hashing and authentication.
- JWT creation and expiration.
- Unauthorized API request protection.
- User-specific document access.
- Search input validation.

## Security

- JWT-based authentication.
- Hashed passwords.
- Protected document and chat APIs.
- User-specific document filtering.
- Environment-based secret configuration.
- `.env` and uploaded documents excluded from Git.

## Current Project Status

The core application has been implemented and tested locally.

Verified functionality includes:

- Backend API integration.
- Frontend authentication and dashboard.
- PDF and DOCX document processing.
- Semantic retrieval using vector embeddings.
- RAG-based AI responses.
- Source citations.
- Account-level document isolation.

Public production deployment and additional production-hardening work are separate from the current local implementation.

## Future Enhancements

- Cloud deployment and scalable infrastructure.
- Advanced document management.
- Improved retrieval evaluation and ranking.
- More comprehensive automated and integration tests.
- Monitoring, observability, and audit logging.

## Author

**Subbu3699**

GitHub: https://github.com/Subbu3699

## License

This project is currently maintained as a personal portfolio project.
