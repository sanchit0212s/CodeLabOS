# Phase 4 — Databases

**Essence:** the database is the most consequential single component in any
SaaS. Application code can be rewritten in a weekend; bad database design
or a corrupted database is a multi-month problem. By the end of Phase 4
the student reads schemas at the level of "this is wrong because…",
writes non-trivial SQL fluently, understands transactions and isolation
levels, knows when to reach for which type of database, and can audit
an ORM-using codebase for the standard performance and correctness
problems.

**Gate:** given a small SaaS feature spec (e.g., "users have organizations,
organizations have projects, projects have tickets"), draft the
PostgreSQL schema including indexes, constraints, and a migration. Given
a Prisma or SQLAlchemy file, identify all the indexes missing, all the
N+1 risks, all the missing FK constraints. Read EXPLAIN ANALYZE output
and explain what the query planner did.

**Restructuring note:** original scaffold had 22 lessons across 4 modules.
**This is wildly under-budgeted for a SaaS curriculum.** Databases are the
single highest-leverage area. Expanded here to ~45 lessons across 7 modules.

**Primary references**
- *Designing Data-Intensive Applications* (Kleppmann) — ch. 1-3, 5-7 are
  required reading for anyone serious about SaaS. Best single book in
  this curriculum.
- *Database Internals* (Petrov) — what's happening under the hood.
- *Use the Index, Luke!* (Markus Winand) — free online, the indexes-for-
  developers tour de force.
- *PostgreSQL: Up and Running*, 3rd ed. (Obe & Hsu).
- *The Art of PostgreSQL* (Dimitri Fontaine) — taste-making book.
- *SQL Antipatterns* (Bill Karwin) — "stop writing this please" catalog.
- *SQL Performance Explained* (Markus Winand) — depth on optimizer.
- *Seven Databases in Seven Weeks*, 2nd ed. (Perkins, Redmond, Wilson) —
  breadth across paradigms.
- *Designing Distributed Systems* (Burns) — for thinking about
  multi-instance data.
- PostgreSQL official documentation — it's exemplary; the "tutorial,"
  "concepts," and "performance" sections are model writing.
- CMU 15-445 — Andy Pavlo's database systems course is on YouTube and
  the gold standard for "how a database works."
- Stripe's engineering blog (idempotency, schemas, migrations).
- The Postgres mailing list archives for advanced topics.

**Cross-phase threads touched here**
- Testing — integration tests against a real DB (transactions per test,
  testcontainers); fixtures.
- Debugging — EXPLAIN, query logs, slow query logs, lock contention.
- Performance — the LARGEST source of production performance issues.
  Indexes, query plans, denormalization, caching.
- Security — SQL injection (prevented by parameterized queries); least-
  privilege DB users; row-level security; encrypted-at-rest; PII handling.
- AI-integration — vector databases for embeddings; pgvector deep coverage.

---

## Module 4.1 — Database fundamentals

### L1 · What a database is (mental model) · STANDARD · ~50 min
Subtopics: a database vs a file (durability, concurrent access, structured
queries, integrity guarantees); ACID properties (Atomicity, Consistency,
Isolation, Durability); BASE (Basically Available, Soft state, Eventually
consistent) as the NoSQL counterpoint; OLTP (transactional, e.g., your
SaaS app's primary DB) vs OLAP (analytical, warehouses like BigQuery /
Snowflake / Redshift / DuckDB); HTAP attempts; what a "DBMS" actually
provides (storage, query engine, transaction manager, lock manager,
replication, backup, security).

### L2 · Relational vs document vs key-value vs graph vs time-series vs vector · DEEP · ~80 min
Subtopics — paradigm tour:
- **Relational** (Postgres, MySQL, SQLite, SQL Server, Oracle) — tables,
  rows, columns, joins, schemas, transactions, ACID. The SaaS default.
- **Document** (MongoDB, CouchDB, DocumentDB) — JSON documents, flexible
  schema, embedded subdocuments. Good for: deeply nested data, fast
  iteration on schema. Less good for: cross-collection joins.
- **Key-value** (Redis, Memcached, DynamoDB) — fastest pure lookups by key,
  often in-memory. Used for: caches, session stores, queues, leaderboards,
  rate limit counters.
- **Wide-column** (Cassandra, ScyllaDB, BigTable, HBase) — sparse, scalable,
  write-optimized. Used for: time-series, IoT, massive write throughput.
- **Graph** (Neo4j, ArangoDB, Amazon Neptune) — nodes and edges; queries
  traverse. Used for: recommendation, fraud rings, knowledge graphs.
  Most SaaS doesn't need a graph DB; Postgres + recursive CTEs often
  suffices.
- **Time-series** (TimescaleDB on Postgres, InfluxDB, QuestDB, ClickHouse).
  Specialized indexes + retention policies for timestamped data.
  Used for: metrics, IoT, financial ticks.
- **Search** (Elasticsearch, OpenSearch, Meilisearch, Typesense). Inverted
  indexes; full-text + faceting + ranking.
- **Vector** (pgvector, Pinecone, Qdrant, Weaviate, Milvus, Chroma).
  Similarity search over high-dimensional embeddings. CORE to RAG.
- **Embedded** (SQLite, DuckDB) — in-process; SQLite for OLTP, DuckDB for
  OLAP. Both used as "default for local."
- **Hybrid / multi-model** (FaunaDB, Cosmos DB, SurrealDB) — multi-paradigm.
  Pitch is broad; tradeoffs are real.

The default recommendation: **start with PostgreSQL.** It handles 95% of
SaaS workloads, has the strongest ecosystem, includes JSON (jsonb),
full-text, vector (pgvector), time-series (Timescale), GEO (PostGIS).
Add a specialty system only when measurements force it.

References: Kleppmann ch. 2-3.

### L3 · Schemas, tables, rows, columns, constraints · DEEP · ~70 min
Subtopics: the table as a relation; rows as tuples; columns with names
and types; primary key vs candidate key vs natural vs surrogate; foreign
keys and referential integrity; NOT NULL; UNIQUE; CHECK constraints;
DEFAULT; the difference between schema (the structure) and the data;
PostgreSQL's "schema" namespace concept (different from "schema = structure");
table comments (DOCUMENT YOUR TABLES); identity columns vs sequences vs
UUIDs as PK — when each fits.

### L4 · Data types deep · DEEP · ~80 min
Subtopics — Postgres-specific but transferable:
- **Numeric**: smallint, integer, bigint, decimal/numeric (exact for money!),
  real, double precision. The float vs decimal decision matters here too.
- **Character**: char(n) (avoid), varchar(n), text. In Postgres, varchar and
  text are equivalent in storage; just use text.
- **Date/time**: date, time, timestamp, timestamp with time zone (ALWAYS
  use timestamptz for new tables — stores UTC, displays in session TZ),
  interval. Common bug: timestamp (without tz) for "when this happened."
- **Boolean**: bool.
- **Binary**: bytea.
- **UUID**: uuid type; v4 (random) vs v7 (time-sortable, new ✓). UUIDv7 is
  the modern best practice for distributed-friendly sortable IDs.
- **JSON / JSONB**: jsonb is the binary form, indexable, performant.
  When to use jsonb (truly variable shape) vs a proper table (anything
  you query by frequently).
- **Arrays**: text[], int[]. Use carefully — normalizing is usually right.
- **Enum types**: Postgres native or check constraint + text.
- **Range types**: int4range, tstzrange (great for "available between X and Y").
- **Network**: inet, cidr, macaddr.
- **Geo**: PostGIS extension; point, geometry, geography.
- **Vector**: pgvector's `vector(N)` type.

The "always use UTC timestamptz" rule. The "money in decimal, not float" rule.

### L5 · Normalization vs denormalization · DEEP · ~70 min
Subtopics: 1NF, 2NF, 3NF, BCNF — what each means in plain language; "don't
repeat data" as the heart; functional dependencies; the trade-off vs
read performance (more joins); denormalization for read paths (caching
denormalized aggregates in another column or table); the difference
between "normalize for storage, denormalize for queries"; materialized
views; star schema vs snowflake schema (in data warehouses).

### L6 · ER modeling and schema design · DEEP · ~90 min
Subtopics: entities, attributes, relationships (one-to-one, one-to-many,
many-to-many); junction tables for M:N; identifying vs non-identifying
relationships; soft delete vs hard delete; auditing tables (created_at,
updated_at, created_by, updated_by, deleted_at); event-sourcing alternatives
(briefly); the SaaS-canonical model (User, Organization, Membership,
Resource, Subscription, Invoice); multi-tenancy patterns (single-tenant,
schema-per-tenant, row-level tenant_id, separate DBs); the "always include
tenant_id on every tenant-scoped table" rule; preventing cross-tenant data
leaks via row-level security or middleware.

---

## Module 4.2 — SQL deep

### L7 · SELECT basics · STANDARD · ~60 min
Subtopics: SELECT … FROM …; columns, *, aliasing AS; DISTINCT; LIMIT and
OFFSET; ORDER BY (multi-column, ASC/DESC, NULLS FIRST/LAST); WHERE clause
syntax; boolean predicates with AND/OR/NOT; IN / NOT IN / EXISTS; BETWEEN
(inclusive); IS NULL / IS NOT NULL (cannot use = with NULL); LIKE / ILIKE
(case-insensitive, Postgres); regex with ~ / ~* (Postgres); pattern
escaping.

### L8 · INSERT, UPDATE, DELETE · STANDARD · ~50 min
Subtopics: INSERT INTO … VALUES …; INSERT … SELECT …; INSERT … ON CONFLICT
(upsert) — Postgres syntax; RETURNING clause for getting back the inserted
row; UPDATE … SET … WHERE; the missing-WHERE disaster; DELETE FROM …
WHERE; soft-delete patterns (set deleted_at instead of removing);
DELETE … RETURNING; mass-mutating statements wrapped in transactions.

### L9 · JOINs · DEEP · ~90 min
Subtopics: the cartesian product mental model; INNER JOIN; LEFT JOIN
(LEFT OUTER); RIGHT JOIN (rare; rewrite as LEFT); FULL OUTER JOIN; CROSS
JOIN; SELF JOIN (joining a table to itself); USING vs ON; NATURAL JOIN
(avoid); join order semantics; "where" filters vs "on" filters in OUTER
joins (the LEFT JOIN + WHERE non-NULL trap); join algorithms (nested
loop, hash, merge — what each costs); the "missing FK index" performance
trap that turns hash join into nested loop; LATERAL joins for
"correlated" subqueries; the canonical Postgres "lateral subquery"
pattern.

References: Use the Index, Luke! ch. 4 (joins).

### L10 · GROUP BY and aggregations · DEEP · ~70 min
Subtopics: GROUP BY semantics; aggregates (COUNT, SUM, AVG, MIN, MAX,
STRING_AGG, ARRAY_AGG, JSON_AGG, JSON_OBJECT_AGG); HAVING vs WHERE (HAVING
runs after grouping); the "every selected column must be in GROUP BY or
be aggregated" rule; SQL standard's strict mode vs MySQL's loose;
GROUPING SETS, ROLLUP, CUBE (for multi-dimensional aggregation);
DISTINCT in aggregates; FILTER clause (Postgres) for conditional aggregation;
the histogram + percentile pattern using PERCENTILE_CONT.

### L11 · Subqueries and CTEs · DEEP · ~80 min
Subtopics: scalar subqueries; correlated subqueries; IN-subquery vs EXISTS-
subquery (and when each is faster); the LEFT JOIN + IS NULL anti-pattern
(use NOT EXISTS); CTEs (WITH … AS) for readable decomposition; recursive
CTEs (WITH RECURSIVE) for hierarchical data; CTEs as optimization
fences (Postgres pre-12 always materialized; from 12+ inlined unless
RECURSIVE or MATERIALIZED keyword); the "common table expressions
for readability" practice.

### L12 · Window functions · DEEP · ~80 min
Subtopics: the window function concept — aggregate over a "frame" without
collapsing rows; OVER clause; PARTITION BY; ORDER BY (within window);
ROWS BETWEEN N PRECEDING AND CURRENT ROW; the ranking family: ROW_NUMBER,
RANK, DENSE_RANK, NTILE; LAG, LEAD for previous/next row access;
FIRST_VALUE, LAST_VALUE, NTH_VALUE; cumulative aggregations (running
totals with SUM() OVER); reset on partition; named windows; common
patterns: pagination with row_number, "top N per group" with DENSE_RANK,
running totals, percentile bucketing.

### L13 · Transactions and isolation levels · VERY-DEEP · ~120 min
Subtopics (~25):
1. Transaction = unit of work, all-or-nothing.
2. BEGIN / COMMIT / ROLLBACK.
3. ACID properties revisited in detail.
4. The four isolation levels: Read Uncommitted, Read Committed (Postgres
   default), Repeatable Read, Serializable.
5. What anomalies each prevents: dirty read, non-repeatable read, phantom
   read, write skew, lost update.
6. Postgres's snapshot-based MVCC (rather than pessimistic locking).
7. SERIALIZABLE in Postgres uses Serializable Snapshot Isolation (SSI) —
   conflict detection, possible "could not serialize" errors → retry logic.
8. SELECT … FOR UPDATE / FOR NO KEY UPDATE / FOR SHARE.
9. Advisory locks for application-level coordination.
10. Long transactions and their cost (table bloat, vacuum can't reclaim).
11. The "open transaction holding row lock" disaster pattern.
12. Deadlocks — what they are, how Postgres detects, the retry pattern.
13. Optimistic concurrency control (version column / updated_at check) vs
    pessimistic (SELECT FOR UPDATE).
14. Idempotency keys for safely retrying writes (the Stripe pattern).
15. Transactions and connection pooling subtlety.
16. Two-phase commit (XA) — distributed transactions; almost always avoid
    in SaaS; prefer sagas/outbox.
17. The outbox pattern for "DB write + event publish atomically."
18. The "saga" pattern for cross-service consistency.
19. Statement-level vs transaction-level rollback on error.
20. Savepoints (subtransactions in Postgres).
21. The "read your writes" trap with read replicas.
22. Read-after-write consistency strategies (read from primary; sticky
    routing; wait-for-lsn).
23. Postgres's logical replication preview.
24. The "transaction-per-test" pattern in integration tests.
25. Implicit autocommit in many client libraries — when single statements
    are their own transaction.

References: Kleppmann ch. 7 (transactions) — required; PostgreSQL docs
ch. 13 (Concurrency Control) — required.

### L14 · NULL semantics · STANDARD · ~40 min
Subtopics: NULL means "unknown," not "empty"; three-valued logic
(TRUE/FALSE/NULL); the surprises: NULL = NULL → NULL; NOT NULL → NULL;
COALESCE for "first non-null"; NULLIF; aggregate functions skip NULL
(but COUNT(*) counts NULLs, COUNT(col) does not); UNIQUE constraints
allow multiple NULLs by default; the "Optional vs missing" mental
distinction.

### L15 · Set operations · STANDARD · ~30 min
UNION (deduplicates) vs UNION ALL (faster, includes duplicates); INTERSECT,
EXCEPT; same-shape requirement; use cases.

### L16 · DDL deep — CREATE, ALTER, DROP · DEEP · ~70 min
Subtopics: CREATE TABLE with all constraint forms; ALTER TABLE … ADD
COLUMN (often non-blocking in Postgres); the "ALTER TABLE on huge table
takes a long lock" reality; SET DEFAULT before adding NOT NULL (modern
Postgres handles this better, but old patterns persist); zero-downtime
schema change patterns (add nullable column → backfill → make NOT NULL →
add constraint NOT VALID then VALIDATE); CREATE INDEX CONCURRENTLY (no
blocking); CREATE TABLE LIKE / AS; CREATE TYPE (enums, composite,
domain); DROP CASCADE warnings.

References: Postgres docs on "ALTER TABLE … add column"; gocardless engineering
blog on zero-downtime migrations.

---

## Module 4.3 — Indexes, query planning, performance

### L17 · What an index is · DEEP · ~80 min
Subtopics: the "phone book" analogy and its limits; B-tree (the default);
how range queries use it; how equality queries use it; index seek vs
index scan vs sequential scan; how COVERING indexes (INCLUDE clause) work;
multi-column indexes — leftmost-prefix rule; the cost of indexes (writes
get slower, storage doubles); when NOT to index (small tables, write-heavy
columns, low-cardinality columns); the "index every FK" rule of thumb;
partial indexes (WHERE clause on index); functional/expression indexes;
unique indexes; primary key = unique index implicitly.

Index types beyond B-tree (Postgres):
- **B-tree** — default; equality, range, ordering.
- **Hash** — equality only; rarely needed (B-tree handles equality well).
- **GIN** — generalized inverted; for arrays, jsonb, full-text.
- **GiST** — generalized search tree; for geometric, range types,
  full-text.
- **SP-GiST** — space-partitioned GiST; specialized.
- **BRIN** — block range index; HUGE tables where values correlate with
  storage order (e.g., timestamps in time-series).
- **HNSW** (via pgvector) — approximate nearest-neighbor for vectors.
- **IVFFlat** (via pgvector) — alternative ANN index.

References: Use the Index, Luke! — read at least ch. 1-3.

### L18 · EXPLAIN, EXPLAIN ANALYZE, BUFFERS · DEEP · ~90 min
Subtopics: reading EXPLAIN output; the tree structure; nodes (Seq Scan,
Index Scan, Index Only Scan, Bitmap Heap Scan, Bitmap Index Scan, Nested
Loop, Hash Join, Merge Join, Sort, Aggregate, GroupAggregate, HashAggregate,
Materialize, CTE Scan, Subquery Scan); the cost units (arbitrary; relative);
EXPLAIN ANALYZE actually runs the query and shows real time; BUFFERS
shows page reads (cache hits vs disk reads); rows estimated vs rows actual
(big mismatch → statistics are out of date or planner is confused);
ANALYZE to refresh statistics; the "I added an index but EXPLAIN doesn't
use it" debugging flow; pg_stat_statements for finding slow queries in
production.

References: "Reading EXPLAIN ANALYZE" articles on cybertec-postgresql blog;
PostgreSQL docs on "Using EXPLAIN."

### L19 · The N+1 problem · DEEP · ~50 min
The single most common SaaS performance bug. Subtopics: the pattern;
spotting it in code (loop with a query inside); spotting it in logs
(many similar queries with one varying parameter); fixes: JOIN; IN-clause
batching; eager loading (ORM-specific: Prisma's include, SQLAlchemy's
selectinload/joinedload, ActiveRecord's includes); DataLoader pattern for
GraphQL/agent workloads; preventing recurrence: linting (eslint-plugin-n-plus-1
in Prisma, sqlcommenter, query log inspection in CI).

### L20 · Query optimization in practice · DEEP · ~70 min
Subtopics: the algorithm: measure, identify slowest query (pg_stat_statements),
EXPLAIN ANALYZE, identify problem (missing index, bad join order, type
mismatch causing no-index, function-on-column hiding index); add the
right thing; remeasure; repeat. Common fixes: add an index; rewrite OR
to UNION ALL; avoid functions on indexed columns (e.g., lower(email) — use
expression index instead); avoid implicit type casts in WHERE clauses;
ANALYZE the table; consider materialized view for expensive read patterns.

### L21 · Concurrency and locking · DEEP · ~70 min
Subtopics: row-level locks, table-level locks; the lock conflict matrix
(ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE,
SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE — what each blocks);
the dangerous DDLs that need ACCESS EXCLUSIVE; pg_locks view; long-running
transactions and their impact; the "advisory lock" pattern for app-level
mutex; idempotent retries with SERIALIZABLE.

---

## Module 4.4 — PostgreSQL specifically

PostgreSQL is the SaaS default. The Postgres-specific features below are
genuine differentiators worth knowing in detail.

### L22 · Postgres beyond ANSI SQL · DEEP · ~80 min
Subtopics: RETURNING; ON CONFLICT (upsert); LATERAL joins; FILTER on
aggregates; arrays as first-class; jsonb querying (->, ->>, @>, jsonb_path_query);
DISTINCT ON (Postgres-only); generated columns (STORED); table inheritance
(legacy — partition is the modern replacement); declarative partitioning
(RANGE, LIST, HASH); rules vs triggers (use triggers).

### L23 · JSONB deep · DEEP · ~70 min
Subtopics: jsonb vs json; querying with operators; indexing jsonb (GIN
with jsonb_ops vs jsonb_path_ops); the "use jsonb for truly variable
shape, columns for everything else" rule; the "JSON column with always-
queried inner key" anti-pattern (extract to a column); pretty-printing
(jsonb_pretty); paths (jsonb_path_query in SQL/JSON path language).

### L24 · Full-text search in Postgres · STANDARD · ~50 min
Subtopics: tsvector, tsquery; to_tsvector with dictionary configuration;
stemming and stopwords; GIN index on tsvector; ranking (ts_rank);
trigram extension (pg_trgm) for fuzzy match; when Postgres FTS is enough
vs when to add Elasticsearch/Meilisearch/Typesense.

### L25 · pgvector and embedding search · DEEP · ~70 min
Subtopics: the vector(N) type; cosine similarity (1 - <-> is wrong, use
<=> for cosine); L2 distance (<->); inner product (<#>); HNSW vs IVFFlat
index choice; tuning ef_search / probes for recall vs speed; combining
with text predicates (filter by tenant_id, then vector search); the
1536/3072-dim OpenAI embeddings; storage cost (1536 floats * 4 bytes =
6KB per row); when to add a dedicated vector DB (Pinecone, Qdrant) vs
stay on pgvector.

### L26 · Postgres extensions worth knowing · LIGHT · ~30 min
A catalog: pg_stat_statements (essential for ops); pg_trgm (fuzzy search);
pgvector (AI); PostGIS (geo); TimescaleDB (time-series); pg_partman
(partitioning automation); uuid-ossp / pgcrypto (UUID generation, gen_random_uuid()
since 13 needs no extension); citext (case-insensitive text); hstore
(simple key-value — usually superseded by jsonb).

### L27 · Postgres tuning and ops · STANDARD · ~60 min
Subtopics: shared_buffers, work_mem, maintenance_work_mem, effective_cache_size,
random_page_cost (lower on SSD); autovacuum tuning (the bloat problem);
checkpoint_timeout; max_connections (and why connection pooling matters —
PgBouncer); transaction_timeout; statement_timeout (set per query/role);
log_min_duration_statement for slow query log; the pgtune.leopard.in.ua
starting point.

---

## Module 4.5 — Connection pooling, replication, scaling

### L28 · Connection pooling · DEEP · ~60 min
Subtopics: why Postgres connections are heavy (process per connection);
the "too many connections" failure (max_connections); pgbouncer modes
(session, transaction, statement); transaction mode breaks prepared
statements and SET LOCAL — gotchas; Supabase/Neon/Vercel use pgbouncer
or RDS Proxy or pgcat by default; connection pooling in the ORM layer
(Prisma's pool, SQLAlchemy's pool); the "lambda/serverless + Postgres"
problem (every cold start opens connections); serverless-friendly Postgres
(Neon, Supabase, Hyperdrive, Aurora DSQL).

### L29 · Replication · STANDARD · ~50 min
Subtopics: streaming replication (primary → replicas, async/sync); read
replicas for read scaling; logical replication for cross-version /
filtered scenarios; replication lag and "read your writes" gotchas;
failover and HA setups (Patroni, RDS Multi-AZ, Aurora); WAL (write-ahead
log) overview; PITR (point-in-time recovery); WAL-G / pgBackRest.

### L30 · Sharding and partitioning · STANDARD · ~50 min
Subtopics: vertical (split columns) vs horizontal (split rows); partitioning
in Postgres (RANGE / LIST / HASH); when partitioning pays off (very large
tables with natural partition key); the application complexity of sharding
across instances (Citus, Vitess); Postgres's logical decoding for
incremental migration to sharded setup; the "Postgres scales further
than you think" principle — partition before you shard.

### L31 · Backups, recovery, durability · STANDARD · ~50 min
Subtopics: logical (pg_dump / pg_restore) vs physical (file copy of data dir)
backups; PITR — combining base backup with WAL archive; the "test your
restores" mantra; RPO (recovery point objective) and RTO (recovery time
objective); managed Postgres backup tiers (snapshots, point-in-time);
encrypted backups; offsite / cross-region replication for DR.

---

## Module 4.6 — ORMs

### L32 · What an ORM is and the trade-off · DEEP · ~50 min
Subtopics: object-relational mismatch as the problem; ORMs map rows to
objects; pros (less boilerplate, type-safety, migrations, query builders,
relations); cons (you stop seeing the SQL, performance footguns multiply,
N+1 hides in code); the "ORM for CRUD, raw SQL for reporting" stance; the
"learn SQL first, ORM second" rule; query builders as the middle ground
(Knex, sqlx, jOOQ).

### L33 · Prisma · DEEP · ~80 min
Subtopics: schema.prisma DSL — models, fields, relations, scalar types,
attributes (@id, @unique, @default, @relation, @map, @@index, @@unique,
@@map); generated client; queries: findUnique, findMany, findFirst,
create, update, delete, upsert; relation queries (include vs select);
nested writes; pagination; filtering; ordering; transactions
(`prisma.$transaction`); the limitations (no advanced SQL features —
fall back to $queryRaw); migrations (prisma migrate dev / deploy);
schema drift; the typegen; client extensions for hooks; connection pool
config; Prisma's pgbouncer mode setting; the "is Prisma a query
builder or an ORM" debate; Prisma vs Drizzle for SQL-native devs.

### L34 · Drizzle · STANDARD · ~50 min
Subtopics: SQL-first schema definition in TS; query builder closer to
SQL than Prisma; pgcore vs mysql vs sqlite; relations; migrations with
drizzle-kit; when Drizzle wins (you want the SQL to be visible; you need
features Prisma doesn't have).

### L35 · SQLAlchemy (Python) · DEEP · ~70 min
Subtopics: Core (query builder) vs ORM layers; declarative models; the
unit of work pattern; the session; lazy-loading vs eager-loading
(selectinload, joinedload, subqueryload, raiseload); cascade rules;
back_populates; Alembic for migrations; SQLAlchemy 2.0's typed style;
async support (asyncpg + AsyncSession).

### L36 · Other ORMs (LIGHT, awareness only) · LIGHT · ~30 min
TypeORM (TS, decorator-based, falling out of favor); MikroORM (TS,
data-mapper, Unit-of-Work pattern); Sequelize (legacy JS); ActiveRecord
(Rails); Django ORM (covered briefly in Phase 5); Ecto (Elixir);
Diesel (Rust).

### L37 · Reading any ORM schema critically · DEEP · ~50 min
Subtopics: what to look for: missing indexes (especially on FKs and
filtered columns); missing UNIQUE constraints; missing FK ON DELETE
behavior (CASCADE, SET NULL, RESTRICT); missing NOT NULL where data is
always present; missing default values that cause runtime confusion;
overuse of nullable; soft delete vs hard delete inconsistency; missing
timestamps (createdAt, updatedAt); naming inconsistency.

---

## Module 4.7 — Migrations and schema evolution

### L38 · What a migration is · STANDARD · ~40 min
Subtopics: migrations as code-controlled schema changes; the migrations
folder convention; numbered or timestamped files; up vs down; the
migration history table (`_prisma_migrations`, `schema_migrations`,
`alembic_version`); applying in environments; the "never edit a
committed migration" rule; the "delete a bad migration, write a new one
to fix" pattern; rolling migrations across environments (dev → preview
→ staging → prod).

### L39 · Zero-downtime migrations · DEEP · ~80 min
Subtopics: the rules: never break the running app; deploy in steps; never
delete a column the app reads; never rename a column the app reads
(deploy alias first, then switch reads, then drop); add a new nullable
column → backfill → add NOT NULL constraint NOT VALID → VALIDATE; index
creation CONCURRENTLY (Postgres); avoid long-lock-holding DDL on big
tables; the "additive deploy first, destructive deploy after" two-step;
data migrations (modifying rows) vs schema migrations (modifying
structure); when to background-job a large data migration vs do it in
the migration; the rollout-vs-rollback asymmetry — many migrations are
not safely reversible, so deploy reversibly above the migration layer
(feature flags).

References: Stripe engineering blog on online migrations; PlanetScale
"deploy requests" documentation; gocardless engineering blog on
zero-downtime.

### L40 · Seed data and fixtures · STANDARD · ~30 min
Seed scripts for "starter data" (e.g., default org); fixtures for tests
(factory_boy, prisma-factory, the "fake users for tests" pattern); the
"never seed prod" rule.

---

## Module 4.8 — Redis and caching

### L41 · Redis basics · DEEP · ~70 min
Subtopics: in-memory data structure server; strings, lists, hashes, sets,
sorted sets, streams, bitmaps, hyperloglog, geospatial; the standard
ops (GET, SET, DEL, EXISTS, EXPIRE, INCR/DECR, LPUSH/RPUSH/LPOP/RPOP,
SADD/SMEMBERS, ZADD/ZRANGE, XADD/XREAD, HSET/HGET); TTLs; persistence
modes (RDB snapshots, AOF append-only file); Redis Cluster (sharding);
Redis Sentinel (HA); managed Redis (Upstash, Memorystore, ElastiCache,
Aiven, Redis Cloud); the "use Redis or just Postgres?" decision —
Postgres is fast enough for many caching needs.

### L42 · Caching strategies · DEEP · ~80 min
Subtopics: cache-aside (lazy load) — most common; read-through; write-through;
write-behind (rare); the cache key design problem; cache invalidation
(the famous hard problem); TTL-based vs event-based eviction; thundering
herd; cache stampede prevention (single-flight, jitter); negative caching;
the "what to cache" decision tree (deterministic, expensive, slow-changing);
the multi-layer cache (browser → CDN → app cache → DB); HTTP caching
recap (ETag, Cache-Control) as a form of caching.

### L43 · Redis as a queue / rate limiter / lock · STANDARD · ~50 min
Patterns: simple queue with LPUSH/BRPOP; reliable queue with the
"work-in-progress list" pattern; rate limiting (token bucket with INCR
+ EXPIRE, or sliding window with sorted sets); distributed locks
(SET NX EX, Redlock controversy — usually just use Postgres advisory
locks instead); streams (XADD) as a Kafka-lite.

---

## Module 4.9 — MongoDB (when relevant)

### L44 · MongoDB at a working level · STANDARD · ~70 min
Subtopics: document model; collections; BSON; CRUD operations
(insertOne, find, updateOne, deleteOne); aggregation pipeline; indexes
on documents; embedded docs vs references; the "your data is essentially
JSON" mental model; pros (schema flexibility, horizontal scaling out of
the box); cons (no joins, eventual consistency by default, transactions
are limited compared to SQL); when to actually pick MongoDB (rare for
new SaaS — usually Postgres + jsonb suffices).

---

## Phase 4 cross-thread coverage

- **Testing:** integration tests against a real DB instance via testcontainers
  or local Docker. Transactions per test for isolation. Fixtures.
- **Debugging:** EXPLAIN ANALYZE; pg_stat_statements; slow query log;
  lock observation (pg_locks); deadlock detection from logs.
- **Performance:** the biggest topic in this phase. Indexes (M4.3),
  query planning (L18), N+1 (L19), caching (M4.8).
- **Security:** parameterized queries to prevent SQL injection;
  least-privilege DB users (separate read/write); row-level security;
  encryption at rest (managed providers); encrypted columns for PII
  (pgcrypto, application-level); GDPR delete; audit logging.
- **AI-integration:** pgvector (L25), RAG patterns, embedding pipelines
  (Phase 8 expands).

---

## What Phase 4 doesn't cover (deferred)

- The application layer (HTTP servers calling the DB) — Phase 5.
- Designing the API around the DB — Phase 5.
- Multi-region replication strategy beyond the basics — Phase 7/9.
