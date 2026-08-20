# Private AI Knowledge Base

Private, self-hosted AI Knowledge Base for enterprise documents.

## Vision

A secure enterprise knowledge platform that can run in customer infrastructure while allowing the customer to control the LLM, embedding provider, object storage, and deployment model.

## Core principles

- Self-hosted / On-Premise first
- LLM-agnostic
- Storage-agnostic
- Permission-aware RAG
- Citation-first answers
- Secure secret handling
- Docker-first deployment

## MVP

- Authentication and RBAC
- Organization and Knowledge Spaces
- PDF/DOCX/TXT/CSV/Markdown ingestion
- PostgreSQL metadata
- Qdrant vector search
- Local/S3-compatible storage abstraction
- LLM provider abstraction
- Embedding provider abstraction
- RAG chat with source citations
- Audit log
- Settings for LLM, embedding, storage and vector database

## Planned stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: NestJS + TypeScript
- Database: PostgreSQL + Prisma
- Vector DB: Qdrant
- Storage: Local filesystem / S3-compatible / MinIO
- Queue/cache: Redis
- LLM: OpenAI-compatible abstraction, with adapters for hosted and local providers
- Deployment: Docker Compose initially; Kubernetes later

See `docs/PRD.md` and `docs/ARCHITECTURE.md` for product requirements and architecture.
