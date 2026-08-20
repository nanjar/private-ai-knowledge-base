# Product Requirements Document
## Private AI Knowledge Base v1.1

**Status:** MVP / Revised Baseline  
**Primary deployment:** Self-hosted / Private Cloud / On-Premise

## 1. Product Vision

Private AI Knowledge Base transforms company documents into a permission-aware AI knowledge system that employees can search and query using natural language.

The MVP prioritizes data sovereignty, low infrastructure cost, pluggable AI/search components, and deployment inside customer-controlled infrastructure. The MVP is intentionally **single-organization**; multi-tenancy is out of scope.

## 2. Target Customers

- Companies with sensitive internal documents
- Organizations using SOPs, policies, manuals and internal knowledge
- Mid-market and enterprise customers requiring private deployment
- Companies that want to use their own LLM/API credentials

## 3. Deployment Models

### 3.1 Self-hosted / On-Premise
All core components run inside the customer's network.

### 3.2 Private Cloud
Dedicated customer-controlled environment.

### 3.3 Cloud
Supported when the customer explicitly chooses cloud services.

Self-hosted/on-premise core operation must not require vendor-hosted infrastructure.

## 4. Core Functional Requirements

### 4.1 Authentication

- Email/password authentication
- Optional Google OAuth
- Session management
- Password reset

### 4.2 RBAC

MVP roles:

- **SUPER_USER** — full system administration, provider/storage/search configuration, user and role management
- **EDITOR** — manage documents/knowledge content and normal knowledge operations
- **VIEWER** — read/search permitted knowledge and use RAG chat; cannot modify content or system settings

There is no multi-tenant organization model in the MVP.

### 4.3 Knowledge Collections

A Knowledge Collection is a logical collection of company documents with access rules.

Examples:

- HR
- Finance
- Legal
- Engineering
- Sales
- SOP

Users may only search and retrieve content for which they have permission.

### 4.4 Document Management

MVP supported formats:

- PDF
- DOCX
- XLSX
- TXT
- CSV
- Markdown

Operations:

- Upload
- Browse
- Search
- Filter
- Delete
- Re-index
- Retry failed processing
- View metadata
- Version tracking
- Access control

Processing lifecycle:

`UPLOADED -> PROCESSING -> CHUNKING -> EMBEDDING -> INDEXED`

Failure state: `FAILED`

### 4.5 Search & RAG Chat

The MVP uses **hybrid retrieval**: lexical/full-text search plus semantic vector search.

RAG pipeline:

`Question -> Query processing -> Permission-aware lexical/vector retrieval -> Hybrid ranking -> Context building -> LLM -> Answer + citations`

Permission filtering **MUST** occur before context is sent to the LLM.

Default low-cost retrieval stack:

- PostgreSQL Full-Text Search (FTS)
- PostgreSQL + pgvector for semantic vector search
- Application-level hybrid ranking/fusion

This avoids requiring a separate search cluster for the default deployment.

Optional dedicated search adapters:

- Meilisearch
- OpenSearch

These are introduced only when scale or search requirements justify the additional infrastructure.

### 4.6 Citations

Every factual RAG answer should expose source documents where available.

Citation metadata should include:

- Document name
- Page/section when available
- Relevant source reference
- Ability to open the source document at the relevant location where technically possible

## 5. Provider & Infrastructure Settings

### 5.1 LLM Provider

LLM configuration is selectable between self-hosted and cloud-based providers.

Supported provider classes:

- Self-hosted: Ollama and other OpenAI-compatible/local inference endpoints
- Cloud: OpenAI, Anthropic, Google, DeepSeek and other OpenAI-compatible APIs
- Custom OpenAI-compatible endpoint

Configuration fields:

- Provider type
- Base URL where applicable
- API key where applicable
- Default model
- Temperature
- Max output tokens
- Connection test

After provider/model selection, the UI should expose a direct **How-To** link for configuring that provider/model.

Provider credentials must be encrypted at rest and never written to logs.

### 5.2 Embedding Provider

Configuration:

- Self-hosted compatible local endpoint
- Cloud embedding provider
- Model
- Dimensions
- Base URL/API key where applicable
- Connection test

### 5.3 Vector Provider — Pluggable

RAG services must depend on an internal **Vector Store** interface rather than a vendor SDK.

Recommended default:

- **PostgreSQL + pgvector** for the lowest operational complexity and cost in the MVP

Optional adapters:

- Qdrant self-hosted
- Qdrant Cloud

The MVP does not require multiple vector providers to be configured simultaneously in the UI. The architecture must permit additional adapters later.

### 5.4 Object Storage

Preferred production storage is the customer's existing **S3-compatible infrastructure**, including existing Biznet Gio S3-compatible storage.

Configuration:

- Endpoint
- Bucket
- Region
- Access key
- Secret key
- Base path/prefix
- Connection test

Local filesystem storage may be supported for development or minimal installations.

Storage credentials must be encrypted at rest.

### 5.5 Search Provider

Search is pluggable through an internal **Search Provider** interface.

Default implementation:

- PostgreSQL Full-Text Search

Optional implementations:

- Meilisearch
- OpenSearch

## 6. API & Developer Experience

- Backend API must be documented using OpenAPI/Swagger
- Swagger UI must be available in development and configurable for protected access in production
- Provider and storage connection-test endpoints must be available through the API
- API contracts should be versionable

## 7. Security Requirements

- RBAC enforcement on every protected operation
- Knowledge/document permission filtering before retrieval results enter LLM context
- Encryption of provider and storage credentials at rest
- TLS support
- Audit logging
- No secrets in application logs
- Configurable data retention
- Self-hosted/on-premise operation without vendor infrastructure

## 8. Audit Log

Audit events include at minimum:

- Login/logout
- Upload/download/delete
- Re-index and processing failures
- Search/query/chat
- Document access
- User and role changes
- Settings/provider changes

Each event should capture actor, timestamp, action, target and relevant metadata.

## 9. Dashboard

Dashboard should show:

- Document count
- Knowledge Collection count
- User count
- Processing status
- Recent activity
- Failed processing items
- Active AI/search/storage provider summary

## 10. Architecture Principles

### 10.1 Frontend / Backend

The MVP consists of a web frontend and a backend API.

- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL + Prisma
- API documentation: OpenAPI/Swagger
- Deployment: Docker Compose

The frontend must not access PostgreSQL, object storage or vector stores directly for business operations; these concerns belong behind the backend API.

### 10.2 Provider Abstractions

Business services must depend on internal interfaces rather than vendor SDKs:

- LLM Provider
- Embedding Provider
- Vector Store
- Search Provider
- Object Storage

## 11. Recommended Low-Cost Technology Options

| Layer | Self-hosted Default | Cloud Alternative | Rationale |
|---|---|---|---|
| Database + vector | PostgreSQL + pgvector | Managed PostgreSQL + pgvector | One core datastore; lowest operational complexity |
| Lexical search | PostgreSQL FTS | Managed PostgreSQL FTS | No extra service for MVP |
| Dedicated search | Meilisearch / OpenSearch | Managed OpenSearch | Optional when scale justifies it |
| Object storage | S3-compatible | S3-compatible cloud | Use existing customer infrastructure |
| LLM | Ollama / OpenAI-compatible local | OpenAI / Anthropic / Google / DeepSeek / compatible | Avoid vendor lock-in |
| Embeddings | Local compatible model | Cloud embedding API | Supports private and cloud modes |

## 12. MVP Scope Lock

### Included

- Authentication and session management
- RBAC: SUPER_USER, EDITOR, VIEWER
- Single-organization deployment; no multi-tenancy
- Knowledge Collections and permissions
- PDF/DOCX/XLSX/TXT/CSV/Markdown ingestion
- PostgreSQL + Prisma
- Pluggable vector provider with pgvector as the default
- Hybrid search using PostgreSQL FTS + vector retrieval
- S3-compatible object storage
- Pluggable LLM and embedding providers
- RAG chat with citations
- Settings with provider selection and connection tests
- How-To links for selected LLM/provider configuration
- Audit log
- Swagger/OpenAPI
- Docker Compose deployment

### Explicitly Out of Scope for MVP

- Multi-tenancy
- Advanced OCR
- Multimodal RAG
- Voice
- Autonomous agents
- WhatsApp integration
- Mobile application
- Fine tuning
- Knowledge graph
- Complex workflow automation
- LDAP/Active Directory
- Multiple vector/search engines configured concurrently in the UI

## 13. Success Criteria

The MVP is successful when:

1. It can run with Docker Compose.
2. SUPER_USER can configure the selected LLM, embedding, vector and storage providers.
3. The customer can use either self-hosted or cloud LLM/embedding services.
4. Production documents can use S3-compatible object storage.
5. PDF/DOCX/XLSX/TXT/CSV/Markdown documents can be indexed.
6. Users can search and chat against authorized Knowledge Collections.
7. Hybrid lexical + semantic retrieval works without requiring a separate search cluster.
8. Answers provide citations.
9. Unauthorized documents never enter retrieved context.
10. Important activities appear in the audit log.
11. Swagger UI documents the backend API.
12. Core self-hosted/on-premise operation does not depend on vendor-hosted services.

## 14. Product Differentiator

Primary positioning:

> **Private AI Knowledge Base with Bring Your Own Infrastructure.**

Customer controls:

- LLM
- Embedding
- Object storage
- Vector store
- Search implementation
- Deployment environment
- API credentials

## 15. Roadmap

### V1.0 / MVP

- Private AI Knowledge Base core
- Single organization
- Pluggable providers
- Hybrid retrieval

### V1.1

- SSO
- LDAP/Active Directory
- Vault integration
- Advanced audit controls
- Enterprise connectors

### V1.2

- Google Drive
- SharePoint
- OneDrive
- Additional document sources

### V1.3

- Controlled AI agents
- Knowledge -> Action
- Workflow/tool integration

### V2

Broader enterprise AI platform and automation capabilities.

## 16. Key Architectural Decisions

1. No multi-tenancy in MVP.
2. RBAC is limited to SUPER_USER, EDITOR and VIEWER.
3. PostgreSQL + pgvector is the default vector stack to minimize infrastructure cost.
4. PostgreSQL FTS is the default lexical search engine; dedicated search engines are optional.
5. Vector and search components are pluggable through internal interfaces.
6. Customer S3-compatible object storage is the preferred production storage.
7. LLM and embedding providers are selectable as self-hosted or cloud-based.
8. Swagger/OpenAPI is mandatory for backend API documentation.
