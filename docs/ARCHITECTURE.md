# Architecture — Private AI Knowledge Base

## Baseline

```text
                    Browser
                       |
                 Next.js Frontend
                       |
                    NestJS API
                       |
        +--------------+--------------+
        |              |              |
   PostgreSQL        Redis         RAG Core
        |                             |
        |                    +--------+--------+
        |                    |        |        |
     Metadata             Qdrant   LLM      Embedding
                                  Gateway    Gateway
                                    |           |
                              Provider Adapters |
                                             Provider

Document Service
      |
Storage Abstraction
  /           \
Local        S3-compatible
```

## Domain boundaries

Backend should be organized around domain/application boundaries rather than vendor SDKs:

- Auth
- Organizations
- Users/RBAC
- Knowledge Spaces
- Documents
- Ingestion
- Retrieval/RAG
- Chat
- Settings
- Audit

## Provider ports

Application code depends on interfaces such as:

```ts
interface LlmProvider {
  generate(input: GenerateInput): Promise<GenerateOutput>;
  stream(input: GenerateInput): AsyncIterable<GenerateChunk>;
}

interface EmbeddingProvider {
  embed(input: string[]): Promise<number[][]>;
}

interface DocumentStorage {
  put(input: StorageObject): Promise<void>;
  get(key: string): Promise<ReadableStream>;
  delete(key: string): Promise<void>;
}

interface VectorStore {
  upsert(chunks: VectorChunk[]): Promise<void>;
  search(query: number[], filter: RetrievalFilter): Promise<SearchResult[]>;
  delete(ids: string[]): Promise<void>;
}
```

The MVP can implement Qdrant, local storage/S3-compatible storage, and an OpenAI-compatible LLM path first. Additional adapters must not require changes to domain services.

## Security boundary

Authorization is applied before context construction:

```text
User
  -> authorize Knowledge Space
  -> retrieve only authorized chunks
  -> build context
  -> call LLM
```

The system must never retrieve all chunks and rely on the model to ignore unauthorized content.

## Deployment

Docker Compose is the first deployment target. The same application images should be usable in customer infrastructure. Kubernetes deployment is a later concern.

## Data ownership

On-Premise mode must be operational without vendor-hosted application services. External LLMs are optional; customer-hosted LLMs and customer-owned storage must be supported through Settings.
