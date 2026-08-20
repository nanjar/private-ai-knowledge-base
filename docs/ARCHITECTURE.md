# Architecture

## 1. High-Level Architecture

```text
                         +----------------------+
                         |       Next.js        |
                         |       Web App        |
                         +----------+-----------+
                                    |
                               REST / API
                                    |
                         +----------v-----------+
                         |       NestJS         |
                         |      Backend         |
                         +----------+-----------+
                                    |
          +-------------------------+--------------------------+
          |                         |                          |
          v                         v                          v
     PostgreSQL                   Qdrant                  Storage Layer
     metadata                    vectors                  Local / S3 / MinIO
          |                         |                          |
          +-------------------------+--------------------------+
                                    |
                               RAG Engine
                                    |
                              LLM Gateway
                                    |
                +-------------------+-------------------+
                |                   |                   |
                v                   v                   v
            OpenAI            Anthropic / etc.      Local LLM
```

## 2. Backend Modules

Suggested NestJS modules:

```text
src/
├── auth/
├── users/
├── organizations/
├── knowledge-spaces/
├── documents/
├── ingestion/
├── chunking/
├── embeddings/
├── vector-store/
├── rag/
├── chat/
├── providers/
│   ├── llm/
│   ├── embedding/
│   └── storage/
├── settings/
├── audit/
└── common/
```

## 3. Provider Architecture

### LLM

```text
                    LLMService
                        |
             +----------+----------+
             |          |          |
          OpenAI    Anthropic   Compatible
                                  |
                              Local/Ollama
```

Business logic must not directly instantiate provider SDKs.

### Storage

```text
                    StorageService
                         |
             +-----------+-----------+
             |           |           |
          Local         S3         MinIO
```

### Vector Store

```text
                    VectorStore
                         |
                       Qdrant
```

The interface should allow future adapters.

## 4. Document Ingestion

```text
Upload
  |
  v
Validate file
  |
  v
Persist original document
  |
  v
Extract text
  |
  v
Chunk
  |
  v
Generate embeddings
  |
  v
Store vectors + metadata
  |
  v
INDEXED
```

Metadata must retain enough information to produce citations.

## 5. Permission-Aware RAG

The security boundary is retrieval.

```text
User
 |
 | identity + roles + memberships
 v
Knowledge Space authorization
 |
 v
Vector retrieval constrained by tenant/space/document permissions
 |
 v
Context builder
 |
 v
LLM
```

Never retrieve all tenant data and attempt to filter it after LLM generation.

## 6. Tenant Isolation

Core entities should include `tenant_id` where appropriate.

Conceptual model:

```text
Tenant
 |
 +-- Users
 +-- Knowledge Spaces
 |     +-- Documents
 |     +-- Members
 |     +-- Vectors
 +-- Settings
 +-- Audit Logs
```

For On-Premise single-company deployments, retain the tenant model so the same application architecture can support SaaS later.

## 7. Secrets

Provider secrets must be encrypted at rest.

Do not:

- log API keys
- expose API keys to normal users
- send provider credentials to the frontend
- store plaintext secrets in ordinary configuration tables

Enterprise deployments may later integrate Docker Secrets, Kubernetes Secrets or Vault.

## 8. Deployment

MVP should use Docker Compose.

Conceptual services:

```text
docker compose
 |
 +-- frontend
 +-- backend
 +-- worker
 +-- postgres
 +-- qdrant
 +-- redis
 +-- storage (optional MinIO)
```

Customer-owned external services may replace local storage and LLM components through Settings/environment configuration.

## 9. Data Flow

### Fully private deployment

```text
Document
   |
   v
Customer Storage
   |
   v
Local extraction/chunking
   |
   v
Local embedding
   |
   v
Qdrant
   |
   v
Local LLM
   |
   v
User
```

No document content needs to leave the customer environment.

### Hybrid deployment

```text
Document
   |
   v
Customer Storage
   |
   v
Customer Qdrant
   |
   v
Relevant chunks
   |
   v
External LLM API
   |
   v
Answer
```

In hybrid mode, relevant retrieved context may leave the customer environment. The UI and deployment documentation must clearly disclose this.

## 10. Technology Baseline

- Next.js
- TypeScript
- Tailwind CSS
- NestJS
- PostgreSQL
- Prisma
- Qdrant
- Redis
- Docker Compose
- S3-compatible storage

The implementation should preserve provider abstractions so infrastructure choices can evolve without rewriting domain logic.
