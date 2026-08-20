# Default Model Registry

The application ships with a small default model catalog. The catalog is intentionally provider-agnostic and can be extended without changing domain logic.

## LLM defaults

| Provider | Model | Type | Default |
|---|---|---|---|
| Qwen Local | Qwen3 8B | Local | Yes |
| DeepSeek | DeepSeek V4 Flash | API | No |
| OpenAI | GPT-5.6 mini | API | No |
| Anthropic | Claude Haiku | API | No |

## Embedding default

| Provider | Model | Type | Default |
|---|---|---|---|
| Qwen Local | Qwen3 Embedding 0.6B | Local | Yes |

## Important implementation rule

Model names in this registry are defaults only. The runtime must not assume that a provider is installed or reachable. Settings must allow administrators to replace the base URL, credentials and model.

For fully private deployments, the selected LLM and embedding endpoint should resolve to infrastructure inside the customer network.

The registry is stored in `config/default-models.json` and should be loaded by a provider/model catalog service rather than hard-coded into UI components.
