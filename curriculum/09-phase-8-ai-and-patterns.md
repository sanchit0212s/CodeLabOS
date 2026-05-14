# Phase 8 — AI Integration & Advanced Patterns

**Essence:** modern SaaS is increasingly AI-native. Phase 8 turns "LLMs
are magic" into a working understanding of how to build, deploy, evaluate,
and reason about AI features. It also covers the advanced patterns
(queues, websockets, sagas, etc.) that apply to non-AI work too.

**Gate:** read an LLM-powered application end-to-end and audit it: how
prompts are versioned and tested, how outputs are validated and recovered
when malformed, how cost is bounded, how latency is managed (streaming,
caching, smaller models in cascade), how user data is handled, how the
agent loop terminates safely, how evaluations measure quality.

**Restructuring note:** the original scaffold had 18 lessons across 3
modules — and the AI section was 8 lessons total. **That is wildly
under-budgeted for 2026.** Expanded here to ~40 lessons across 7 modules.

**Primary references**
- Anthropic's official documentation (docs.anthropic.com) — the deepest
  vendor docs on prompt engineering, tool use, computer use, agent
  patterns.
- OpenAI Cookbook (github.com/openai/openai-cookbook) — practical patterns.
- *Designing Machine Learning Systems* (Chip Huyen) — production ML.
- *AI Engineering* (Chip Huyen, 2024) — modern LLM-app book.
- *Building LLM Applications with Python and LangChain* — pragmatic.
- Andrej Karpathy's videos (especially "Intro to LLMs," "Let's build
  GPT," "Build a GPT-2 from scratch in 4 hours").
- LangChain / LlamaIndex / Haystack documentation.
- Eugene Yan's blog (eugeneyan.com) — practical ML engineering.
- Hamel Husain on LLM evals.
- "The Annotated Transformer" (Harvard NLP) — model internals.
- *Designing Distributed Systems* (Burns) — for the non-AI patterns.
- Stripe's idempotency and webhook docs (gold standard for non-AI APIs).

**Cross-phase threads touched here**
- Testing — LLM evals as a distinct discipline; A/B testing; offline
  vs online evaluation.
- Debugging — tracing AI workflows; LangSmith / Langfuse / Arize.
- Performance — streaming, caching, cascading models, batching.
- Security — prompt injection; data exfiltration; PII handling;
  output sanitization.

---

## Module 8.1 — Working with data

### L1 · ETL / ELT pipelines · STANDARD · ~50 min
Subtopics: ETL vs ELT (transform before vs after load); the modern
data stack (Fivetran/Airbyte for extract, dbt for transform, Snowflake/
BigQuery/Redshift for warehouse, Looker/Metabase for visualization);
the "small SaaS rarely needs a real warehouse until late" reality;
the "Postgres for OLTP, optionally DuckDB or BigQuery for analytics"
modern split.

### L2 · CSV, JSON, JSON Lines, Parquet, Arrow · STANDARD · ~50 min
Subtopics: when each: CSV (interop), JSON (web payloads), JSONL (streaming
log-like records), Parquet (columnar — efficient for analytics), Arrow
(in-memory columnar — fast across languages); the "stream-not-buffer
when large" principle; gzip / zstd compression.

### L3 · Schema design for analytics · STANDARD · ~50 min
Subtopics: star schema (fact + dimensions); slowly-changing dimensions
(SCD types I/II); denormalization for OLAP; the "your OLAP schema is
not your OLTP schema" reality; dbt's incremental models.

### L4 · Data warehouses · STANDARD · ~50 min
Subtopics: Snowflake / BigQuery / Redshift / Databricks SQL trade-offs;
columnar storage; query engine differences; cost models (per-query vs
per-second); the new lightweight options (ClickHouse, DuckDB, MotherDuck);
when SaaS needs one (analytics dashboards beyond what OLTP can serve).

---

## Module 8.2 — LLM API fundamentals

### L5 · How LLM APIs work · DEEP · ~70 min
Subtopics: the chat-completion request shape (messages with roles:
system, user, assistant, tool); the response shape (choices, finish_reason,
usage); models as families (Claude Opus/Sonnet/Haiku tiers; GPT-4 family;
Gemini family; open Llama / Mistral / Qwen variants); the "system prompt
is the personality / instruction" pattern; multi-turn conversation
construction; max_tokens limits; pricing per million tokens, separate
input/output rates; the "you pay for the entire conversation history each
turn" cost reality.

### L6 · Sampling parameters · DEEP · ~50 min
Subtopics: temperature (0.0 = deterministic, 1.0 = creative); top_p
(nucleus sampling); top_k; frequency_penalty / presence_penalty;
stop sequences; max_tokens; n (multiple responses); the "lower
temperature for facts, higher for creativity" rule; reproducibility
via temperature=0 + same seed (when supported).

### L7 · Streaming responses · DEEP · ~50 min
Subtopics: why stream (perceived latency); server-sent events transport;
the "delta" / "chunk" message shape; aggregating chunks client-side; the
"reading a stream and rendering markdown as it arrives" UX pattern;
backpressure; cancellation (abort the stream when user navigates away);
the relationship to SSE (Phase 5 L33).

### L8 · Tokenization and context windows · DEEP · ~60 min
Subtopics: BPE / SentencePiece / Tiktoken; the "tokens aren't words"
reality; counting tokens before sending (tiktoken, anthropic.tokenizer);
context window sizes (Claude 200K-1M, GPT 128K, Gemini up to 1M+);
"long context but quality degrades with depth" reality; the "needle in
a haystack" benchmark; how to truncate / summarize / chunk; the
"input cost grows linearly, output cost grows linearly, latency grows
with output length most" budgeting fact.

### L9 · Prompt engineering as code · VERY-DEEP · ~120 min
Subtopics (~22):
1. The system prompt as the "persistent personality / instruction."
2. Few-shot vs zero-shot.
3. The "structure your prompt as a document" pattern: <role>...</role>,
   <task>...</task>, <constraints>...</constraints>, <examples>...,
   <output_format>....
4. XML-tag delimiters (Anthropic's preferred convention) for clear
   parseable boundaries.
5. Markdown formatting.
6. Chain-of-thought prompting (asking the model to "think step by step"
   or putting reasoning in a scratchpad before the final answer).
7. Asking the model to use a <thinking> block before final output.
8. The "explain your reasoning, then answer" pattern.
9. Self-consistency (sample multiple responses, take majority).
10. Tree-of-thought / debate.
11. Persona priming (you are a careful senior software engineer).
12. The "be concise" instruction (otherwise verbose).
13. The "if unsure, say so" anti-hallucination instruction.
14. Examples are usually higher leverage than instructions.
15. Negative instructions (don't do X) are often less effective than
    positive (do Y).
16. Output format constraints (return JSON; the model fails sometimes,
    so validate).
17. The relationship between instructions and the model's training (some
    instructions work because of RLHF; others fight it).
18. Prompts as version-controlled artifacts (prompts.py / prompts/*.md).
19. A/B testing prompts in production.
20. Prompt registries (LangFuse, Helicone, Humanloop).
21. The "rewrite my prompt to be clearer" meta-prompt.
22. Anthropic's "prompt improver" feature.

References: Anthropic prompt engineering guide; OpenAI prompt
engineering guide; "Prompt Engineering Guide" (DAIR.AI).

### L10 · Tool use / function calling · VERY-DEEP · ~120 min
Subtopics (~20):
1. The "give the model tools and let it choose" paradigm.
2. Tool definition: name, description, input_schema (JSON Schema).
3. The model's response: a tool_use block with input.
4. Your code: execute the tool, return a tool_result.
5. Multi-turn tool use loops.
6. Parallel tool calls (multiple tools in one assistant turn).
7. The relationship to "agents" (agent = LLM in a tool-use loop with
   a goal).
8. Tool description matters more than people realize — the LLM reads
   descriptions to choose.
9. Strict mode / json_object response format guarantees JSON output.
10. The "search the web" tool pattern.
11. The "read this URL" tool pattern.
12. The "execute SQL" tool pattern (with read-only scope!).
13. The "send email" tool pattern (with confirmation, NOT silently).
14. Errors in tool execution — return error text in tool_result.
15. The "tool got the wrong arguments" recovery loop.
16. Cost / latency considerations of multi-turn loops.
17. The MCP (Model Context Protocol) — Anthropic's emerging standard
    for tool servers.
18. Computer use (Claude's screenshot + click/type tool family).
19. Code execution tools (sandboxed; Replit / E2B / Modal patterns).
20. Common mistakes: tools that aren't deterministic; tools that exceed
    timeouts; tools that mutate state without idempotency keys.

### L11 · Structured outputs / JSON mode · DEEP · ~50 min
Subtopics: response_format / json_schema; Pydantic / Zod schemas paired
with the LLM; the "constrained decoding" approach (Outlines, Instructor);
validation + retry on malformed output; the "structured outputs eliminate
JSON parsing errors but not semantic errors" reality.

### L12 · Vision and multi-modal · STANDARD · ~50 min
Subtopics: passing images to chat models (base64 or URL); image quality
vs token cost; vision use cases (OCR-lite, screenshot understanding,
diagram interpretation, computer-use); video (frame sampling); audio
(transcription via Whisper / Deepgram / AssemblyAI then chat).

---

## Module 8.3 — Embeddings, vector search, and RAG

### L13 · What embeddings are · DEEP · ~60 min
Subtopics: an embedding = a vector representation of meaning; similar
text → close vectors (in cosine / euclidean / dot-product space); the
"semantic search" possibility; embedding models (OpenAI text-embedding-3-small/large,
Voyage AI, Cohere, open-source ones via Sentence-Transformers); dimensions
(usually 384-3072); the "training cost is enormous, inference is cheap"
mental model; what embeddings DON'T do (they don't "understand" — they
compress).

### L14 · Vector databases · DEEP · ~70 min
Subtopics: covered partially in Phase 4 L25 (pgvector); the alternatives:
Pinecone (managed, scalable), Qdrant (open-source, fast), Weaviate
(open-source, with built-in vectorization), Milvus, Chroma; ANN
algorithms (HNSW, IVFFlat, ScaNN); recall vs latency vs memory trade-offs;
the "pgvector is enough for most SaaS" stance; the "dedicated vector DB
when you have hundreds of millions of vectors and need sub-100ms"
decision.

### L15 · Retrieval Augmented Generation (RAG) · VERY-DEEP · ~150 min
Subtopics (~25):
1. The pattern: retrieve relevant context → augment the prompt → generate.
2. The motivations: knowledge cutoffs, hallucination reduction, private
   data, citations.
3. Document loading (PDF, HTML, markdown, code, CSVs).
4. Chunking strategies (fixed-size, sentence, semantic, recursive
   character splitter).
5. The "chunk size and overlap" parameters; their impact on retrieval
   quality.
6. Embedding each chunk and storing.
7. Query embedding and similarity search.
8. Top-k retrieval.
9. Hybrid search (vector + BM25 / full-text) — strictly better than
   either alone for most use cases.
10. Reranking with a cross-encoder (Cohere Rerank, BGE reranker).
11. The "rerank the top 100, present the top 5" pattern.
12. Filters / metadata filtering during search (tenant_id, doc_type).
13. The "always tenant-scope retrieval" rule for multi-tenant SaaS.
14. Citations — including source spans in the answer.
15. RAG vs fine-tuning (RAG is usually better for facts; fine-tuning for
    style/format).
16. Multi-hop retrieval (search, get an answer, search again with
    refined query).
17. Query rewriting (LLM rewrites user query into a better search query).
18. Hypothetical document embeddings (HyDE).
19. Parent-document retrieval (return larger context around the
    embedding).
20. Self-querying retrieval (LLM produces a structured filter).
21. The "retrieval evaluation" subdiscipline (Recall@K, MRR, nDCG).
22. End-to-end RAG evaluation (answer faithfulness, answer relevance,
    context relevance).
23. RAGAS, TruLens, LangSmith for RAG evals.
24. Common failure modes: retrieved chunks are wrong; chunks are right
    but the model doesn't use them; chunks contradict each other.
25. The "Graph RAG" emerging pattern (graph traversal + embeddings).

References: "Retrieval-Augmented Generation for Knowledge-Intensive
NLP Tasks" (Lewis et al., the original RAG paper); LangChain & LlamaIndex
docs; Anthropic's Contextual Retrieval blog post.

### L16 · Production RAG concerns · DEEP · ~60 min
Subtopics: incremental indexing as docs change; version control of
chunks (re-embed when chunking strategy changes); cost of re-embedding
on schema changes; per-document permissions enforcement at retrieval
time; the "the LLM cannot enforce ACLs — filter before embedding-search,
not after" rule; deletion (right-to-be-forgotten compliance); query
caching.

---

## Module 8.4 — AI agents

### L17 · What an AI agent is · DEEP · ~60 min
Subtopics: agent = LLM in a loop with tools + a goal; the
think-act-observe loop; the difference between a chatbot, an agent, and
an automation; ReAct prompting (reason → act → observe → repeat);
the agent's stopping criteria (success, max iterations, cost limit,
user interrupt); the agent's memory (conversation history, scratchpad,
long-term store); the agent's tools (Phase 8 L10); the agent's planning
(implicit via reasoning, or explicit via plan-then-execute).

### L18 · Agent architectures · DEEP · ~70 min
Subtopics:
- **Single-agent loop** — one LLM with many tools, iterates until done.
- **Plan-then-execute** — one LLM plans, another executes step by step.
- **Multi-agent / role-based** — separate "researcher," "writer,"
  "reviewer" agents collaborating.
- **Hierarchical** — a manager agent dispatches to sub-agents.
- **Reflection loops** — agent critiques its own output, retries.
- **Tree search / explore-multiple-paths** — for high-stakes problems.
- **Computer use / browser automation** — agent controls a real
  browser/OS.
The "start with single-agent + ReAct, only add complexity when measurably
needed" guidance; the cost / latency / reliability trade-offs of each.

### L19 · Building an agent loop · DEEP · ~80 min
Subtopics: the implementation skeleton:
1. messages = [system prompt].
2. while not done and i < max:
3.   response = llm.create(messages, tools=...)
4.   if response.stop_reason == "tool_use":
5.     for tool_use in response.content:
6.       result = execute_tool(tool_use.name, tool_use.input)
7.       messages.append({"role": "tool", "content": result})
8.     continue
9.   else: done = True
10. return response

The error handling: tool execution failures, tool returns malformed,
LLM doesn't pick the right tool, infinite loops; timeouts at every layer;
cost tracking per loop; observability (log every iteration with tool
selected + input + output).

### L20 · Reading an AI agent codebase · DEEP · ~70 min
Subtopics: what to look for: prompt versioning, tool descriptions, the
loop structure, error handling, max-iterations + cost-limit, what gets
logged, what is rate-limited, how user input is sanitized (prompt
injection!), how outputs are validated, how state persists across runs;
the standard AI-agent file shape (agent.py / agent.ts, prompts.py,
tools.py, schemas.py, llm_client.py); identifying the framework
(LangChain, LangGraph, AutoGen, CrewAI, Pydantic AI, raw SDK).

### L21 · Agent frameworks · STANDARD · ~70 min
Subtopics:
- **Raw SDKs (anthropic-python, openai)** — minimal abstraction, you
  build the loop. Best for production reliability.
- **LangChain / LangGraph** — most popular Python framework. Heavy
  abstraction. LangGraph for explicit state machines / graphs.
- **LlamaIndex** — RAG-focused.
- **Pydantic AI** — modern, typed, Python.
- **Inkeep, Mastra, Vercel AI SDK** — TS-focused.
- **AutoGen (Microsoft)** — multi-agent conversation.
- **CrewAI** — role-based agents.
- **Phidata** — opinionated agent framework.

The "frameworks are great for prototyping; production sometimes drops
to raw SDK for control" pattern.

### L22 · Tool design for agents · DEEP · ~50 min
Subtopics: tool descriptions are prompts; the "describe the tool like
you're describing it to a junior engineer" rule; input_schema strictness;
the "few high-leverage tools beat many granular ones" principle;
read-vs-write tool separation; idempotency; rate limits per tool;
the "always include a safe-by-default fallback like search_web rather
than fetch_url_unsafe" approach.

### L23 · Agent memory and state · STANDARD · ~50 min
Subtopics: short-term (conversation history); summarization for long
conversations; long-term memory (embed past interactions + retrieve);
vector-store-backed memory; the user-knowledge graph patterns
(Mem0, Letta, Zep); the "what to remember vs what to forget" decision.

---

## Module 8.5 — Evaluating LLM applications

### L24 · Why LLM evaluation is its own discipline · STANDARD · ~30 min
Subtopics: traditional tests don't fit (output is open-ended); the
"good output" definition is fuzzy; LLMs change (model updates, prompt
changes, RAG changes); the "if you can't measure quality, you can't
improve it" reality; eval suites as the LLM equivalent of test suites.

### L25 · Offline evaluation · DEEP · ~70 min
Subtopics: building an eval dataset (synthetic + curated examples);
metric types: exact match, substring match, structured match (JSON
matches schema), LLM-as-judge (use a stronger model to grade), human
review; pairwise comparison (which response is better); preference
datasets (RLHF-like); LangSmith / Langfuse / Braintrust / Confident
AI for eval tooling; CI gates ("don't merge if eval regression").

### L26 · Online evaluation · DEEP · ~50 min
Subtopics: A/B testing in production (prompt v1 vs v2); win-rate metrics;
implicit user signals (regenerate clicks, copy-rate, time-on-result);
explicit feedback (thumbs up/down, ratings); the "you must instrument
this BEFORE the experiment, not during" rule.

### L27 · Safety evals · STANDARD · ~50 min
Subtopics: red-teaming for prompt injection; jailbreak attempts;
toxic-output testing; PII leakage tests; the "your agent can be tricked
to call dangerous tools" risk; OWASP LLM Top 10 (2024 / 2025).

References: OWASP Top 10 for LLM Applications; Anthropic safety research;
Promptfoo, Garak as red-teaming tools.

### L28 · Trace-based debugging · STANDARD · ~50 min
Subtopics: LangSmith / Langfuse / Helicone / Phoenix Arize / Comet Opik —
recording every LLM call as a trace; viewing inputs, outputs, tool calls,
latency, cost; replay for debugging; the "tracing is observability
for AI agents" insight.

---

## Module 8.6 — Production AI concerns

### L29 · Cost optimization · DEEP · ~70 min
Subtopics: model cascade (try Haiku first, fall back to Sonnet, escalate
to Opus only if confidence is low); prompt caching (Anthropic Prompt
Caching, OpenAI implicit caching) — massive savings for long system
prompts; batching (Anthropic Batch API, OpenAI Batch API — 50% off for
24h SLA); semantic caching (cache by query similarity, not exact match);
shorter outputs (max_tokens, "be concise" instruction); summarization
for long histories; output validation + retry only when needed (not by
default); the cost-per-task metric; rate limits / quotas at the user/
tenant level; spend caps per user.

### L30 · Latency optimization · DEEP · ~60 min
Subtopics: streaming for perceived latency; smaller models when adequate;
parallel tool calls; the "first byte latency" vs "full response latency"
distinction; precomputation (don't compute on user click if you can
compute on document update); caching (covered L29); edge-deployed
smaller models (Cloudflare Workers AI, Vercel Edge AI); on-device for
the simplest cases.

### L31 · Reliability — retries, fallbacks, circuit breakers · STANDARD · ~50 min
Subtopics: LLM API errors (429, 500-class, timeouts); exponential
backoff retry; cross-provider fallbacks (try Anthropic, fall back to
OpenAI on outage); the "graceful degradation when AI is down" patterns
(serve cached response; degrade to non-AI mode); idempotency for retried
generations; the relationship to Phase 5 L40 (timeouts and circuit
breakers).

### L32 · Prompt injection and adversarial inputs · DEEP · ~70 min
Subtopics: the threat — user input contains instructions that override
your system prompt; direct vs indirect injection (instructions in
RAG'd documents, in web pages, in PDFs); the "user input is data, not
instructions" model; mitigations: structured tools (don't let the model
emit arbitrary actions; constrain via tool definitions); strict input
validation; output sanitization (especially before HTML rendering — XSS
via LLM!); the "treat agent outputs as untrusted user input throughout
the rest of your system" rule; the OWASP LLM Top 10 maps here.

### L33 · Data exfiltration risks · STANDARD · ~40 min
Subtopics: LLM training data concerns (don't send user PII to a model
that might train on it — use the data-privacy modes of OpenAI/Anthropic);
contract terms; on-premise / private deployments (Anthropic via AWS
Bedrock, OpenAI via Azure, self-hosted via vLLM); zero-data-retention
agreements; the "redact PII before logging LLM traces" discipline.

### L34 · Reading and reviewing AI code · DEEP · ~60 min
The orchestrator's specific skill. Subtopics: what tells you this code
was AI-generated (overly confident comments; made-up library methods;
"helpful" extra functionality; missing edge cases); what to check
specifically: imports actually exist; function signatures match docs;
SQL has parameterization; secrets are loaded properly; error handling
is real vs cosmetic; tests test behavior, not implementation; the
"verify the AI's confident claim before approving" muscle.

---

## Module 8.7 — Advanced architecture patterns

### L35 · Monolith → modular monolith → microservices migration · STANDARD · ~50 min
The decision tree revisited from Phase 5; the "Strangler Fig" migration
pattern (route incrementally to the new service); event-driven decoupling
as an intermediate step.

### L36 · Sagas, outbox, idempotent consumers · DEEP · ~60 min
Subtopics: the "distributed transaction is a myth" reality; saga
patterns (choreography via events; orchestration via central
coordinator); compensation transactions; the outbox pattern (write DB
+ event in same transaction; ship event from outbox); CDC (Change
Data Capture, e.g., Debezium); idempotent message processing
(dedup by event id).

### L37 · Real-time architectures · STANDARD · ~50 min
WebSockets at scale (sticky sessions, Redis pub/sub for fanout); SSE
for one-way; Liveblocks / Pusher / Ably / Soketi as managed; the
"collaboration" patterns (CRDTs — Yjs, Automerge); Phoenix Channels and
the Elixir+BEAM advantage for real-time.

### L38 · Workflow engines · STANDARD · ~50 min
Subtopics: Temporal, Restate, Inngest as the modern durable-execution
engines; the "code that survives restarts, retries forever, picks up
where it left off" model; AWS Step Functions; Airflow / Dagster /
Prefect for data pipelines; when each fits.

### L39 · Reverse proxies, edge layers, API gateways · STANDARD · ~50 min
Subtopics: Nginx / Caddy / Traefik / HAProxy; TLS termination; HTTP/2
support; gzip / brotli compression; static-file serving; the role at
the edge (Cloudflare, Vercel Edge, AWS CloudFront with Lambda@Edge).

### L40 · The full-stack SaaS reference architecture · DEEP · ~70 min
Putting it all together: a complete reference diagram and walkthrough
of a modern SaaS at 1K, 10K, 100K, 1M users — what changes, what doesn't.

---

## Phase 8 cross-thread coverage

- **Testing:** LLM evals as a dedicated discipline (M8.5).
- **Debugging:** trace-based debugging (L28); cost tracing.
- **Performance:** L29-L30 dedicated; caching at every layer.
- **Security:** prompt injection (L32); data exfiltration (L33); OWASP
  LLM Top 10 throughout.

---

## What Phase 8 doesn't cover (deferred)

- Training your own models — out of scope for orchestrator-level.
- Deep ML theory (transformers, attention math) — Karpathy videos
  fill that gap if interested.
