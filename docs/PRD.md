# Product Requirements Document
## Private AI Knowledge Base v1.0

**Status:** MVP / Initial baseline  
**Product:** Private AI Knowledge Base  
**Primary deployment:** Self-hosted / On-Premise  

## 1. Product Vision

Private AI Knowledge Base transforms company documents into a permission-aware AI knowledge system that employees can query using natural language.

The product must allow the customer to control where documents, embeddings, metadata and AI processing are hosted. LLM, embedding provider, object storage and vector database are configurable through **Settings**.

## 2. Target Customers

- Companies with sensitive internal documents
- Organizations using SOPs, policies, manuals and internal knowledge
- Mid-market and enterprise customers requiring private deployment
- Companies that want to use their own LLM/API credentials

## 3. Deployment Models

### 3.1 Cloud
Vendor-managed infrastructure.

### 3.2 Private Cloud
Dedicated customer environment.

### 3.3 On-Premise
All application components run inside the customer's network.

The application must not require vendor infrastructure for core operation in On-Premise mode.

## 4. Core Functional Requirements

### 4.1 Authentication

- Email/password authentication
- Optional Google OAuth
- Session management
- Password reset

### 4.2 RBAC

Roles:

- SUPER_ADMIN
- ADMIN
- MANAGER
- USER

Permissions must apply to Knowledge Spaces and documents.

### 4.3 Organization

Every tenant has isolated users, settings, knowledge spaces, documents, chats and audit records.

All tenant-owned entities must include `tenant_id` or an equivalent isolation mechanism.

### 4.4 Knowledge Spaces

A Knowledge Space is a logical collection of documents with its own membership and access rules.

Examples:

- HR
- Finance
- Legal
- Engineering
- Sales
- SOP

Users must only retrieve content they are authorized to access.

### 4.5 Document Management

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

Failure state:

`FAILED`

### 4.6 RAG Chat

Users can ask natural-language questions against a selected Knowledge Space.

Pipeline:

`Question -> Query processing -> Embedding -> Authorized vector retrieval -> Context building -> LLM -> Answer + citations`

Permission filtering must happen before context is sent to the LLM.

### 4.7 Citations

Every factual RAG answer should expose its source documents where available.

Citation metadata should include:

- Document name
- Page/section when available
- Relevant source reference

The UI should allow users to open the source document at the relevant location where technically possible.

## 5. Settings

Provider configuration belongs in the application Settings and must not be hard-coded in business logic.

### 5.1 Settings > AI > LLM Provider

Support an abstraction capable of:

- OpenAI
- Anthropic
- Google
- DeepSeek
- OpenAI-compatible APIs
- Ollama/local LLM
- Custom compatible endpoints

Configuration fields may include:

- Provider
- Base URL
- API key
- Default model
- Temperature
- Max output tokens
- Connection test

API keys must be encrypted at rest.

### 5.2 Settings > AI > Embedding

Configuration:

- Provider
- Base URL where applicable
- API key where applicable
- Model
- Dimensions
- Connection test

Local embedding must be supported for fully private deployments.

### 5.3 Settings > AI > RAG

Admin-configurable parameters:

- Top K
- Similarity threshold
- Chunk size
- Chunk overlap
- Maximum context
- Temperature/default generation controls where applicable

Advanced controls should be hidden from normal users.

### 5.4 Settings > Storage

Support:

- Local filesystem
- S3
- S3-compatible storage
- MinIO

Configuration may include:

- Endpoint
- Bucket
- Region
- Access key
- Secret key
- Base path/prefix
- Connection test

Storage credentials must be encrypted at rest.

### 5.5 Settings > Vector Database

MVP baseline: Qdrant.

Configuration:

- Endpoint
- API key
- Collection naming/configuration
- Connection test

The backend should use an abstraction so other vector databases can be introduced later.

## 6. Security Requirements

- Tenant isolation
- RBAC
- Knowledge Space access control
- Document-level permissions where required
- Encryption of provider credentials/secrets at rest
- TLS support
- Audit logging
- No secrets in application logs
- Permission filtering before LLM context construction
- Configurable data retention

## 7. Audit Log

Audit events include at minimum:

- Login/logout
- Upload
- Download
- Delete
- Re-index
- Chat/query
- Document access
- User changes
- Role changes
- Settings changes
- Provider changes

Each event should capture actor, tenant, timestamp, action, target and relevant metadata.

## 8. Dashboard

Dashboard should show:

- Document count
- Knowledge Space count
- User count
- Processing status
- Recent activity
- Failed processing items

## 9. Architecture Principles

### LLM abstraction

Application services must depend on an internal LLM interface rather than a vendor SDK directly.

Conceptual interface:

```text
generate()
stream()
embed()
countTokens()
```

Provider adapters implement this interface.

### Storage abstraction

Application document services must depend on an internal storage interface.

The implementation may target local filesystem, S3-compatible storage or MinIO.

### Vector abstraction

RAG services must depend on an internal vector-search interface, with Qdrant as the MVP implementation.

## 10. MVP Scope Lock

### Included

- Authentication
- RBAC
- Organization/tenant model
- Knowledge Spaces
- Document ingestion
- PDF/DOCX/TXT/CSV/Markdown support
- PostgreSQL
- Prisma
- Qdrant
- Storage abstraction
- LLM abstraction
- Embedding abstraction
- RAG chat
- Citations
- Settings
- Audit log
- Docker Compose deployment

### Explicitly out of scope for MVP

- Advanced OCR
- Multimodal RAG
- Voice
- Autonomous agents
- WhatsApp integration
- Mobile application
- Fine tuning
- Knowledge graph
- Multiple vector DB implementations in UI
- Advanced analytics
- Complex workflow automation

## 11. Success Criteria

The MVP is successful when:

1. It can run with Docker Compose.
2. Admin can configure the LLM through Settings.
3. Customer can use its own LLM/API credentials.
4. Customer can configure its own storage.
5. PDF/DOCX documents can be indexed.
6. Users can query a Knowledge Space.
7. Answers provide citations.
8. Unauthorized documents are never included in retrieved context.
9. Important activities appear in the audit log.
10. Core On-Premise operation does not depend on vendor-hosted services.

## 12. Product Differentiator

Primary positioning:

> **Private AI Knowledge Base with Bring Your Own Infrastructure.**

Customer controls:

- LLM
- Embedding
- Storage
- Vector database
- Deployment environment
- API credentials

This is intended to differentiate the product from generic hosted document-chat applications.

## 13. Roadmap

### V1.0
Private AI Knowledge Base MVP.

### V1.1
Enterprise security:

- SSO
- LDAP/Active Directory
- Vault integration
- Advanced audit controls

### V1.2
Enterprise connectors:

- Google Drive
- SharePoint
- OneDrive
- Additional document sources

### V1.3
AI agents:

- Knowledge -> Action
- Controlled tools
- Workflow integration

### V2
Enterprise AI platform and broader automation capabilities.
