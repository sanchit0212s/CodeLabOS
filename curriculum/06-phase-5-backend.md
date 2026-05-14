# Phase 5 — Backend & APIs

**Essence:** the server-side of a SaaS — where the business logic lives,
where data integrity is enforced, where money moves. By Phase 5's end
the student can read any HTTP API, audit it for the standard
correctness/security/performance issues, choose a stack appropriately,
and design an API that future developers (including AI agents) won't
hate.

**Gate:** given a feature spec, design the endpoints (URLs + verbs +
request/response shapes + auth model + rate limits + error contracts).
Audit an existing endpoint and produce a code-review-quality assessment.
Identify the standard backend anti-patterns (input not validated; auth
checks on client only; N+1; missing idempotency; secrets in logs; missing
timeouts).

**Restructuring note:** original scaffold had 30 lessons in 5 modules.
Expanded here to ~55 lessons across 8 modules. The auth module especially
needs much more depth than the original (JWT, sessions, OAuth flows,
SSO, passkeys, MFA).

**Primary references**
- *Web Application Architecture: Principles, Protocols, and Practices*
  (Shklar & Rosen).
- *RESTful Web APIs* (Richardson & Amundsen).
- *Designing Web APIs* (Jin, Sahni, Shevat).
- *API Design Patterns* (JJ Geewax) — Google's API design wisdom.
- *Building Microservices*, 2nd ed. (Sam Newman).
- *Designing Data-Intensive Applications* (Kleppmann) — chapters 5
  (replication), 6 (partitioning), 8 (consistency), 11 (stream processing).
- Stripe API Reference and engineering blog — best public API ever
  published.
- *OAuth 2.0 in Action* (Justin Richer & Antonio Sanso).
- *OAuth 2.0 Simplified* (Aaron Parecki) — free online.
- RFCs: 6749 (OAuth 2.0), 7519 (JWT), 8252 (Native apps), 9700 (OAuth 2.0
  security BCP).
- *Identity and Data Security for Web Development* (Sullivan).
- FastAPI documentation — the docs themselves are a curriculum.
- Express, Fastify, Hono, NestJS official docs.
- Django and DRF documentation.
- OWASP API Security Top 10 (2023) — required.
- *Microservices Patterns* (Chris Richardson) — saga, outbox, CQRS.
- The "12-Factor App" methodology (12factor.net).
- The Strapi/Supabase/Hasura sources for "API on top of DB" patterns.

**Cross-phase threads touched here**
- Testing — API endpoint tests, integration tests with a DB, contract
  tests.
- Debugging — request tracing, structured logging, error reproduction.
- Performance — query optimization at the API level; caching layers.
- Security — input validation, auth, authz, rate limiting, secrets,
  CORS, headers, encryption.
- AI-integration — AI endpoints (streaming, function-calling, retries).

---

## Module 5.1 — Backend fundamentals

### L1 · What the backend actually does · STANDARD · ~50 min
Subtopics: serve HTTP requests; talk to the database; talk to other
services (third-party APIs, internal microservices); run background jobs;
authenticate and authorize; validate input; produce output (JSON, HTML
in SSR, files); enforce business rules; emit events; observe itself
(logs, metrics, traces). The "backend = adapter between users and your
data, with rules" mental model. Where each responsibility lives in code
(routes vs services vs repos vs models in a clean layered architecture).

### L2 · The request lifecycle in detail · DEEP · ~70 min
Subtopics: TCP accept → TLS terminate (often at load balancer/CDN) →
HTTP parsing → routing → middleware chain (CORS, auth, body parsing,
logging, rate limit) → handler → handler calls services → services
call repositories/DAOs → DB query → DB response → handler builds
response → middleware response chain (headers, compression) → response
written → connection kept alive or closed. The exception path. The
timeout path. The cancellation path (client disconnect).

### L3 · Frameworks vs roll-your-own · STANDARD · ~30 min
Subtopics: what a framework provides (routing, middleware, body parsing,
error handling, lifecycle hooks, dependency injection, conventions);
the "library vs framework" inversion (library = you call it; framework
= it calls you); the trade-off (productivity vs control); the modern
SaaS default — pick a framework that handles 90% of HTTP correctly
(timeouts, body limits, headers, error format, request IDs) so you
spend your time on the business logic.

### L4 · Middleware patterns · DEEP · ~60 min
Subtopics: the middleware concept (function that intercepts request/
response); ordering matters; common middleware: request logging,
request ID, body parsing, CORS, security headers (Helmet/Astro Security
Headers), rate limiting, authentication, compression, error handler;
the "auth before business logic, error handler last" pattern; per-route
middleware; conditional middleware; middleware in Express vs Koa
(async/await native) vs FastAPI (Depends) vs Hono (similar to Express).

### L5 · Routing patterns · STANDARD · ~40 min
Subtopics: path-based routing; HTTP-verb-based dispatch; path parameters
(`:id`, `[id]`, `{id}`); query parameters; URL design conventions;
nested routes vs flat; route groups for shared middleware; file-based
routing (Next.js, Remix, SvelteKit, FastAPI's APIRouter); the "RESTful
resource" naming convention.

---

## Module 5.2 — Designing APIs

### L6 · API design philosophies — REST, RPC, GraphQL, gRPC, tRPC · DEEP · ~90 min
Subtopics:

**REST (Representational State Transfer)** — resources at URLs, HTTP
verbs as actions. The default for public APIs and most SaaS internal
APIs. Pros: discoverable, cacheable, HTTP-native, language-agnostic. Cons:
over-fetching, under-fetching, multiple round-trips for related data,
versioning friction.

**JSON-RPC / plain RPC** — call procedures by name. Pros: simple, fits
how programmers think. Cons: less discoverable, no HTTP-cache semantics.

**GraphQL** — clients query exactly what they need. Pros: solves
over/under-fetching, single endpoint, type-safe schemas. Cons: caching
is harder (POST + complex queries), N+1 risk (need DataLoader), schema
governance overhead, learning curve for the team. Better for big public
APIs (GitHub) than for small SaaS.

**gRPC** — binary RPC over HTTP/2 via protobuf. Pros: fast, type-safe,
streaming. Cons: binary makes debugging harder, not browser-friendly
without gRPC-Web shim, schema-first workflow has a learning curve. Best
for internal service-to-service.

**tRPC** — TypeScript end-to-end type-safety RPC. Client and server
share a type. Pros: no schema duplication, killer DX for full-stack TS.
Cons: TS-only (no cross-language), couples client and server (which is
sometimes wanted).

**OpenAPI/Swagger** — REST API specification format. Generates client
SDKs, docs, validation. Most SaaS APIs should ship an OpenAPI spec.

The decision tree: public API → REST + OpenAPI. Internal microservices →
gRPC or REST. Internal full-stack TS app → tRPC. Heavy mobile/web client
with read-heavy workflows → GraphQL. AI agents calling your API → REST
+ OpenAPI (most LLMs read it natively).

### L7 · Resources, URLs, verbs, and the REST contract · DEEP · ~70 min
Subtopics: nouns not verbs in URLs (`/orders/123/items` not
`/getOrderItems?id=123`); hierarchical nesting (don't over-nest); plural
or singular resource names (plural is conventional); the verb table:
GET (read, safe, idempotent), POST (create or "do an action"), PUT
(replace, idempotent), PATCH (update partial), DELETE (idempotent); how
to express actions that aren't CRUD (POST to a "sub-action" endpoint,
e.g., POST /orders/123/refund); avoiding "RPC over REST" naming hybrids.

### L8 · Versioning · STANDARD · ~40 min
Subtopics: URL prefix (/v1/...), header-based (Accept: application/
vnd.acme.v1+json), date-based (Stripe's "API version" by date); when to
bump; backward-compat strategies (additive changes don't need a bump;
removing fields, changing types, renaming → new version); the
"never break shipped clients" rule; deprecation policies (header,
docs, communication, sunset).

### L9 · Pagination, filtering, sorting · DEEP · ~60 min
Subtopics: offset pagination (`?offset=20&limit=20`) — easy to grok, but
slow on large tables and breaks on inserts; cursor (keyset) pagination
(`?after=abc`) — fast, stable, modern default; the cursor contract (opaque
or transparent); has_more / next_cursor in response; pagination in SQL
(LIMIT/OFFSET vs WHERE id > cursor); sorting (multi-key, NULL handling);
filtering syntax (?status=active vs ?filter=status:active vs query DSL);
search (q= parameter); the "stripe pagination" model as gold standard.

### L10 · Error contracts · DEEP · ~50 min
Subtopics: a JSON error body convention (RFC 7807 Problem Details, or
custom); fields: error code (machine-readable), message (human-readable),
details, request_id; HTTP status code as primary signal; consistent
error shape across all endpoints; the "don't leak stack traces or internal
details in errors" rule; localization considerations; the Stripe model
of nesting errors with type/code/param/message; throwing typed errors
internally → middleware translates to HTTP response.

### L11 · Idempotency · DEEP · ~60 min
Subtopics: what idempotency means; safe vs unsafe verbs; the
"client-supplied idempotency key" pattern (Stripe-style); how to
implement (store key + result for a TTL); idempotency for write
endpoints (POST to create — without it, double-clicks create duplicates);
the relationship to retry policies and "at-least-once delivery" semantics;
idempotency in webhooks (your endpoint may receive duplicates).

### L12 · Request validation · DEEP · ~60 min
Subtopics: "never trust the client"; validate every field on every
request; schema-first validation (zod, pydantic, valibot, joi);
the parse-don't-validate principle (parse into typed value, errors
explicit); error reporting (field path + message); validation order
(structural before semantic); coercion (string "5" → int 5? — opinionated:
strict by default); validation for nested objects, arrays, optional
fields, enums; max length / min length / regex; "validate at the
boundary, trust inside" mental model.

### L13 · Response shaping and the over/under-fetching problem · STANDARD · ~40 min
Subtopics: the "single endpoint returns 80% of needed data" balance;
sparse fieldsets (?fields=name,email); embedded subresources (?include=
items); naming for booleans (is_active not active to make intent clear);
date format (always ISO 8601 UTC); avoid undocumented nullability surprises.

### L14 · API design from the schema vs from the use case · DEEP · ~50 min
The "expose your DB schema as REST" anti-pattern (CRUD-only APIs that
push business logic to clients); the use-case-first design (each
endpoint exists because a real client need exists); the "API as a
product" mindset; backwards-design from a sample client integration.

---

## Module 5.3 — Express, Fastify, Hono (Node frameworks)

### L15 · Express (the classic) · DEEP · ~80 min
Subtopics: app, Router, app.use; middleware signature `(req, res, next)`;
error-handling middleware (4-arg signature `(err, req, res, next)`);
common middleware (body-parser, cookie-parser, morgan, helmet, cors);
async/await issues (errors in async handlers don't auto-propagate
without express-async-errors or wrap-async); the "Express is in
maintenance mode, what next?" reality; when to stick with Express (huge
ecosystem, devs know it); when to migrate (greenfield, want modern
async, want types).

### L16 · Fastify · DEEP · ~70 min
Subtopics: Fastify's speed (~3x Express); schema-driven validation
(JSON Schema) + auto-typed routes via @fastify/type-provider-typebox or
@fastify/type-provider-zod; lifecycle hooks (preHandler, onRequest,
onResponse, etc.); plugins and encapsulation; built-in serialization
acceleration; the ecosystem.

### L17 · Hono (the modern edge-friendly choice) · STANDARD · ~50 min
Subtopics: tiny, fast, runs on Node + Bun + Deno + Cloudflare Workers +
Vercel Edge; web-standard Request/Response; middleware system; RPC mode
for TS type-safety client→server; the "edge-runtime friendly" pitch;
when Hono is right (edge deploys, multi-runtime, TS-first).

### L18 · NestJS (when you want batteries) · STANDARD · ~50 min
Subtopics: opinionated, decorator-heavy, Angular-influenced; modules,
controllers, providers, dependency injection; guards, interceptors,
pipes, filters; built-in support for Express or Fastify under the hood;
when NestJS fits (large team, enterprise patterns, deep DI needs); when
it doesn't (small SaaS, fast iteration).

---

## Module 5.4 — FastAPI, Django, Flask (Python frameworks)

### L19 · FastAPI · VERY-DEEP · ~120 min
Subtopics (~28):
1. The FastAPI philosophy: type hints drive everything (validation, docs).
2. Path operations (`@app.get("/")`).
3. Path parameters (`/items/{item_id}`) with type hints → auto-converted.
4. Query parameters via function arguments.
5. Pydantic models for request bodies.
6. Response models for output validation/serialization.
7. Auto-generated Swagger UI at `/docs`.
8. Auto-generated ReDoc at `/redoc`.
9. The OpenAPI spec at `/openapi.json` — instantly available.
10. Dependency injection via `Depends()`.
11. The `yield` dependency pattern for setup/teardown (DB session per request).
12. Security utilities (HTTPBearer, OAuth2PasswordBearer, etc.).
13. Background tasks (`BackgroundTasks` parameter).
14. WebSocket support.
15. Streaming responses (StreamingResponse, EventSourceResponse via sse-starlette).
16. Routers and the include_router pattern.
17. Middleware (Starlette-style).
18. Lifespan event handlers.
19. Async vs sync handlers (FastAPI is async-native).
20. Sync handlers running in threadpool.
21. Settings management with pydantic-settings.
22. Database integration (SQLAlchemy 2.0 async, SQLModel, Tortoise).
23. Testing with TestClient.
24. The relationship to Starlette (FastAPI is Starlette + Pydantic).
25. Production deployment with Uvicorn / Gunicorn + UvicornWorker.
26. ASGI under the hood — what it is, why it's not WSGI.
27. The "FastAPI is the modern Python default for new SaaS APIs" position.
28. Common gotchas: forgetting `async`; blocking calls inside async; not
    using a thread-pool for sync DB drivers; pydantic v2 migration issues.

### L20 · Django + Django REST Framework · DEEP · ~80 min
Subtopics: when Django wins (admin UI, ORM, auth, full-stack apps,
team familiarity); models / views / templates; the Django ORM (powerful
but with its own footguns); migrations; admin auto-generated; DRF for
APIs on top — serializers, viewsets, routers, permissions; the
"batteries-included" trade-off; Django Ninja as the FastAPI-style
alternative on Django's ORM.

### L21 · Flask + extensions · STANDARD · ~50 min
Subtopics: when Flask still makes sense (tiny services, legacy); the
minimal core + add-ons philosophy; flask-sqlalchemy, flask-login,
flask-marshmallow, flask-jwt-extended; when to migrate to FastAPI.

---

## Module 5.5 — Authentication and Authorization (the largest backend topic)

### L22 · authn vs authz · STANDARD · ~30 min
Subtopics: authn = who you are (login); authz = what you can do
(permissions); the most common bug — conflating them; authn happens
first, authz happens per-request.

### L23 · Sessions vs tokens · DEEP · ~70 min
Subtopics: **session-based** — server stores session, client holds a
cookie with session ID; pros (revocable on logout, small cookie, secure
defaults); cons (session store needed, scaling complexity);
**token-based** — server signs a JWT, client holds it; pros (stateless,
horizontally scalable); cons (revocation is hard, JWT pitfalls); the
"sessions for first-party web apps, tokens for APIs / mobile" rule of
thumb; the modern compromise (session in httpOnly Secure SameSite=Lax
cookie, refresh patterns).

### L24 · JWT in depth · DEEP · ~90 min
Subtopics: structure (header.payload.signature); algorithms (HS256 vs
RS256/ES256 — symmetric vs asymmetric); the "alg=none" historical
vulnerability; the "JWT confusion" attack (alg header trusted); claims
(iss, sub, aud, exp, iat, nbf, jti); custom claims; JWKS endpoints;
verifying with a public key; clock skew (leeway); the "JWTs can't be
revoked easily" problem — short expiry + refresh tokens, blacklist,
session-version claim; the "stuff everything into JWT" anti-pattern
(huge cookies/headers); JWT vs PASETO (the modern alternative); when
JWT is genuinely the right tool (cross-domain, federated, stateless
microservices).

References: RFC 7519; jwt.io; auth0.com/blog "Critique of JWT."

### L25 · OAuth 2.0 flows · VERY-DEEP · ~150 min (two sessions)
Subtopics (~25):
1. OAuth 2.0 is about DELEGATED authorization, not authn (OpenID Connect
   adds authn on top).
2. The four parties: resource owner (user), client (your app), authorization
   server, resource server.
3. The historical flows: Authorization Code, Implicit, Resource Owner
   Password Credentials, Client Credentials.
4. **Authorization Code with PKCE (S256)** — the modern flow for web
   and mobile.
5. Implicit grant — deprecated since OAuth 2.1.
6. Password grant — deprecated.
7. Client Credentials — for service-to-service.
8. Device Authorization Grant (RFC 8628) — for TVs and devices without
   browsers.
9. The PKCE challenge (code_verifier, code_challenge, S256) and why it
   matters even for confidential clients.
10. Refresh tokens; refresh-token rotation (recommended); the difference
    between "rotating" and "long-lived."
11. Scopes — granular permission requests.
12. State parameter for CSRF protection.
13. Nonce parameter (for OIDC).
14. Token introspection (RFC 7662) for opaque tokens.
15. Token revocation (RFC 7009).
16. OpenID Connect (OIDC) on top of OAuth 2.0 — adds id_token (JWT with
    user info), userinfo endpoint, well-known discovery.
17. "Sign in with Google / Apple / GitHub" implementations — usually
    OIDC.
18. SAML vs OIDC for SSO (SAML is the enterprise legacy; OIDC is modern).
19. PKCE + authorization code is now the recommendation for both
    SPAs AND traditional web apps.
20. Storing the access token (NEVER in localStorage for browser apps;
    HttpOnly cookies or in-memory).
21. The "back-channel" callback (server-side handles tokens).
22. Securing the redirect URI (exact match registration).
23. OAuth 2.1 (the consolidation spec) — what's new.
24. The "DPoP" (Demonstration of Proof-of-Possession) extension for
    sender-constrained tokens.
25. Real implementations: NextAuth/Auth.js, Lucia, BetterAuth, Clerk,
    Auth0, Supabase Auth, Firebase Auth, AWS Cognito.

References: *OAuth 2.0 in Action*; oauth.net/2/; RFC 6749, 7636, 8252,
9700; "OAuth 2.0 Simplified" by Aaron Parecki.

### L26 · Password hashing and storage · DEEP · ~50 min
Subtopics: never store plaintext; never use MD5 / SHA-* alone (too fast);
bcrypt (the safe default), Argon2id (the modern best), scrypt (Apple's
choice); cost/work factor — tune it; salting (libraries handle this);
constant-time comparison; password policies (length matters more than
complexity); the "password rotation" myth (don't force unless breach);
pwned-passwords integration (haveibeenpwned API).

### L27 · API keys, OAuth client credentials, machine-to-machine · STANDARD · ~50 min
Subtopics: API keys as bearer tokens; key generation (cryptographically
random); key prefixes (sk_live_..., pk_live_... like Stripe — discoverable
in code scans); secret hashing in storage (hash the key, store the hash);
rotation policies; scoping keys (per-resource permissions); the
client_credentials OAuth flow for first-party services.

### L28 · MFA, TOTP, WebAuthn, passkeys · DEEP · ~70 min
Subtopics: MFA factor classes (something you know, have, are); SMS as
the weakest (SIM swap); TOTP (RFC 6238) — Google Authenticator / Authy
/ 1Password; HOTP (counter-based, less common); recovery codes; push
notifications (Duo / Okta Verify); WebAuthn (the spec); passkeys (UX of
WebAuthn); platform authenticators (Touch ID, Windows Hello) vs roaming
(YubiKey); the "passkeys are passwordless" pitch; conditional UI;
the registration vs authentication ceremonies; libraries
(SimpleWebAuthn, webauthn-rs).

### L29 · SSO and enterprise auth · STANDARD · ~50 min
Subtopics: SSO patterns (SAML, OIDC); IdP and SP roles; "SCIM" for
user provisioning; the "enterprise customer wants SSO with Okta" support
checklist; multi-tenant SSO routing (per-org IdP configuration);
just-in-time provisioning; group → role mapping.

### L30 · Authorization models · DEEP · ~80 min
Subtopics: **RBAC** (Role-Based Access Control) — roles → permissions,
users → roles. Simple, classic.
**ABAC** (Attribute-Based Access Control) — policy evaluates user
attributes + resource attributes + context.
**ReBAC** (Relationship-Based Access Control) — Google Zanzibar's model;
permissions derive from relationships in a graph. Used by Notion's
permission system, OpenFGA, Permify, Authzed/SpiceDB.
**PBAC** (Policy-Based Access Control) — Open Policy Agent (OPA), Rego.

Multi-tenancy: every authz check includes "is this user a member of
this tenant?". Row-level security in Postgres can enforce at DB level.

The "permission check in middleware vs in service" decision (middleware
is easier to forget; service is harder to bypass).

### L31 · CORS and CSRF in depth · DEEP · ~70 min
Subtopics:
**CORS** — same-origin policy, preflight OPTIONS, Access-Control-Allow-*
headers, credentials mode interactions, the `Access-Control-Allow-Origin:
*` + credentials gotcha (browser rejects), wildcard origins in dev vs
strict in prod, common errors and how to read them.
**CSRF** — the threat (browser sends cookies automatically with same-site
requests from attacker's site); mitigations: SameSite=Lax cookies (default
since Chrome 80), CSRF tokens (synchronizer or double-submit), Origin
header check; APIs that use Authorization header instead of cookies
aren't vulnerable (no auto-credentials).

### L32 · Rate limiting · DEEP · ~60 min
Subtopics: token bucket vs leaky bucket vs fixed window vs sliding window;
keys (per-IP, per-API-key, per-user, per-tenant); abuse vs fair-use;
429 Too Many Requests + Retry-After header; per-route limits; burst vs
sustained; Redis-backed implementations (express-rate-limit + Redis,
slowapi for FastAPI); CDN-level (Cloudflare, AWS WAF); the "leaky
bucket smooths bursts" intuition.

---

## Module 5.6 — Long-running and async work

### L33 · Streaming responses (chunked, SSE, websockets) · DEEP · ~70 min
Subtopics: **Chunked transfer encoding** — write parts as they're ready;
**Server-Sent Events (SSE)** — text/event-stream, one-way server-push,
auto-reconnect; **WebSockets** — bidirectional, persistent. When each
fits. SSE is great for LLM streaming, dashboards, notifications — and
it's simpler than WebSockets. WebSockets for collaborative editing,
games, chat.

### L34 · Background jobs and queues · DEEP · ~80 min
Subtopics: "don't do slow work in the request"; the queue pattern; queue
choices: Redis (RQ, BullMQ, Sidekiq) for app-level; SQS / Pub/Sub for
managed; Kafka for event streaming; Temporal for durable execution;
Inngest for "serverless background jobs"; idempotent workers; retry +
backoff; dead-letter queues; observability (job latency, queue depth);
job priority; cron-like scheduled jobs (with deduplication for "exactly
one run").

### L35 · Webhooks · DEEP · ~60 min
Subtopics: webhooks = HTTP-pushed events from one service to another;
the security: HMAC signing (Stripe model — verify signature with shared
secret); replay-attack protection (timestamp + tolerance); idempotent
receivers; retry-with-backoff senders; webhook payload best practices
(small, link to a "fetch the full thing" endpoint); webhook delivery
guarantees (at-least-once); the difference between webhooks and
polling and SSE/websockets.

### L36 · File uploads · STANDARD · ~60 min
Subtopics: multipart/form-data; chunked uploads; direct-to-S3 uploads
via presigned URLs (skip your server entirely for large files); virus
scanning; image processing pipelines; the "validate file type by content,
not just extension" rule; content-disposition; max-size limits; storage
patterns (S3 + CloudFront).

---

## Module 5.7 — Production concerns

### L37 · Logging at the API level · DEEP · ~50 min
Subtopics: per-request log; the request_id pattern (correlation); the
structured-JSON-to-stdout convention; what to log per request (method,
path, status, latency, user_id, tenant_id, request_id); never log PII or
secrets; log levels (DEBUG dev only, INFO normal, WARN unusual, ERROR
actionable, FATAL exit); the "log the request id in EVERY downstream
call" pattern.

### L38 · Metrics at the API level · STANDARD · ~40 min
Subtopics: RED method (Rate, Errors, Duration); USE method (Utilization,
Saturation, Errors); the "p50, p95, p99 latency" trio; per-endpoint metrics;
Prometheus client libraries; OpenTelemetry as the modern standard.

### L39 · Tracing and OpenTelemetry · DEEP · ~70 min
Subtopics: distributed tracing — following a request across services;
spans, parents, attributes; OpenTelemetry as the vendor-neutral standard;
auto-instrumentation; manual span creation for business logic; baggage;
context propagation (W3C tracecontext header); exporters (Jaeger, Tempo,
Honeycomb, Datadog, New Relic); sampling strategies (head, tail, deterministic);
when traces beat logs (multi-service debugging).

### L40 · Timeouts and circuit breakers · DEEP · ~60 min
Subtopics: every outbound call has a timeout — full stop; the "5 second
default everywhere" baseline; the cascading timeout (your timeout to
service A must be larger than A's timeout to B); circuit breakers
(closed → open → half-open); libraries (opossum for Node, pybreaker for
Python); bulkheads (limit concurrent calls per dependency); the
"degrade gracefully" pattern (show cached data when downstream is down).

### L41 · Idempotency keys end-to-end · STANDARD · ~50 min
Subtopics: design covered in L11; production patterns: storing in Redis
with TTL; the "first request wins; subsequent requests with same key
return cached response" semantics; observability around idempotency
(metric: % of requests that were dedup'd); webhooks as their own
idempotency challenge (event_id stored, dedup on receive).

### L42 · API security headers and content security · DEEP · ~50 min
Subtopics: X-Content-Type-Options: nosniff; X-Frame-Options / CSP
frame-ancestors; Strict-Transport-Security (HSTS); Content-Security-Policy;
Referrer-Policy; Permissions-Policy; CORS headers (covered); the
Helmet/Astro middleware as a sane starting point.

---

## Module 5.8 — Architecture patterns

### L43 · Monolith vs microservices vs modular monolith · DEEP · ~70 min
Subtopics: the "start as monolith" pragmatic default; modular monolith
as the middle path (single deployable, modular code); when to split
(team-size constraints, scaling profiles diverging, deploy independence
needed); the cost of microservices (network failures, distributed
debugging, infrastructure complexity); Conway's Law; the "microservices
are an organizational tool, not a tech improvement" reality.

References: *Building Microservices* (Newman); *Monolith to Microservices*.

### L44 · Domain-Driven Design at the orchestrator level · DEEP · ~60 min
Subtopics: ubiquitous language; bounded contexts; aggregates (a
consistency boundary); commands vs queries; entities vs value objects;
when DDD pays off (complex domain with rich logic) vs when it's overkill
(CRUD admin tools); the "anemic domain model" anti-pattern and when it's
fine vs not; the rich-domain alternative.

References: Evans *DDD*; Vernon *Implementing DDD*; Millett & Tune
*Patterns, Principles, and Practices of DDD*.

### L45 · CQRS, event sourcing, and the outbox pattern · STANDARD · ~60 min
Subtopics: CQRS = separate read and write models; useful when read paths
differ wildly from write paths (e.g., expensive denormalized views);
event sourcing = the truth is the event log, current state is a
projection; pros (perfect audit, time-travel) and cons (massive shift,
hard to grok queries); the outbox pattern as the lightweight bridge —
write the DB and an event row in one transaction, ship the event from
the outbox separately; the saga pattern for multi-service consistency
(choreography vs orchestration).

### L46 · Message buses and event-driven architecture · STANDARD · ~60 min
Subtopics: pub/sub vs queues; Kafka vs RabbitMQ vs SQS vs SNS vs
EventBridge vs Pub/Sub; topics, partitions, consumer groups; at-most-once
vs at-least-once vs exactly-once delivery (exactly-once is a hard
illusion); idempotent consumers; the modern serverless event story
(Inngest, Trigger.dev).

### L47 · API gateways and BFF (Backend-for-Frontend) · STANDARD · ~50 min
Subtopics: API gateways as the "edge of your API" (auth termination,
rate limiting, request routing, transformation); managed (AWS API
Gateway, Cloudflare Workers, Apigee, Kong); when self-hosted nginx /
HAProxy is enough; the BFF pattern (a small server tailored to each
client — web BFF, mobile BFF — to reduce client complexity).

### L48 · Schema-driven development · STANDARD · ~50 min
Subtopics: OpenAPI-first vs code-first; GraphQL schema-first; protobuf
schema-first (gRPC); generating SDKs and types from a single source of
truth; types flowing across the language boundary (orval, openapi-typescript,
oazapfts, kubb); the "API contract is a product" mindset.

---

## Module 5.9 — Testing APIs

### L49 · Unit vs integration vs contract vs e2e for APIs · DEEP · ~50 min
The pyramid recap; per-layer test responsibilities; the cost vs confidence
trade-off; the "most ROI from integration tests against a real DB" view.

### L50 · pytest + httpx test client for FastAPI · STANDARD · ~50 min
Subtopics: testing FastAPI endpoints with the TestClient; pytest fixtures
for DB session per test (transaction-rollback isolation); factory_boy or
pytest-factoryboy for fixtures; mocking external services
(respx for httpx; vcrpy for replay); testing background tasks; testing
authentication-protected endpoints.

### L51 · Vitest + supertest for Node · STANDARD · ~40 min
The same pattern for Express/Fastify; nock for HTTP mocking; database
transactions per test.

### L52 · Contract testing · STANDARD · ~40 min
Subtopics: Pact for consumer-driven contracts; OpenAPI schema validation
in tests (Schemathesis); the "your test suite verifies the contract; the
contract is the source of truth for clients."

---

## Phase 5 cross-thread coverage

- **Testing:** dedicated Module 5.9; threads throughout.
- **Debugging:** request IDs, structured logs, traces — Modules 5.7, 5.8.
- **Performance:** rate limiting, circuit breakers, query patterns, caching.
- **Security:** ENORMOUS focus — Modules 5.5 (auth), 5.7 (headers, secrets),
  validation throughout.
- **AI-integration:** streaming (L33), background jobs (L34), webhooks
  (L35) — all heavily used in AI products.

---

## What Phase 5 doesn't cover (deferred)

- Frontend integration of APIs — Phase 6.
- Deployment / infrastructure — Phase 7.
- AI-specific patterns (function calling, agent loops) — Phase 8.
- Observability deep — Phase 9.
- Security audit — Phase 9.
