# Phase 3 — JavaScript & TypeScript

**Essence:** JavaScript is the web's native language and (via Node) the
single most-used backend runtime for new SaaS in 2026. TypeScript is the
sane way to write JS at scale. By Phase 3's end, the student reads any
modern JS/TS file and explains every line: closures, async flow, type
errors, the module system, the runtime.

**Gate:** read and explain a non-trivial Next.js route handler that does
auth, calls a database, calls an LLM, streams a response, and handles
errors. Read a complex TypeScript error message and propose the correct
fix.

**Restructuring note:** original scaffold had 29 lessons across 4 modules.
Expanded here to ~50 lessons across 6 modules. JS has too many quirks and
TS has too much type-system depth to fit in 29 lessons.

**Primary references**
- *Eloquent JavaScript* (Marijn Haverbeke) — best free intro.
- *You Don't Know JS Yet* series (Kyle Simpson) — the "this/closures/types
  /grammar" deep dives.
- *JavaScript: The Definitive Guide* (Flanagan) — reference grade.
- *Effective TypeScript*, 2nd ed. (Dan Vanderkam) — 90 specific items.
- *Programming TypeScript* (Boris Cherny).
- *Learning TypeScript* (Josh Goldberg).
- MDN Web Docs / JavaScript — canonical.
- TypeScript Handbook — official.
- Node.js docs — official.
- *Node.js Design Patterns*, 3rd ed. (Casciaro & Mammino).
- *Practical Modern JavaScript* (Nicolás Bevacqua).
- The TC39 proposal tracker — for understanding "what's coming."
- jakearchibald.com (event loop animations); v8.dev (engine internals);
  rauchg.com (Vercel/Next thinking).

**Cross-phase threads:**
- Testing — Vitest/Jest covered in this phase's testing section, deeper in Phase 9.
- Debugging — Chrome DevTools (frontend), `node --inspect`, source maps.
- Performance — JS-specific (event loop blocking, bundle size).
- Security — XSS prevention, prototype pollution, eval avoidance.

---

## Module 3.1 — JavaScript core

### L1 · A short history and the modern landscape · STANDARD · ~40 min
Subtopics: Brendan Eich 10 days; LiveScript → JavaScript; the standard
(ECMAScript / TC39); annual releases since ES2015; the "ES5 era" of
hacks vs the "ES2015+" modern era; "JavaScript" is the language;
"Node.js / Deno / Bun" are runtimes that EMBED an engine (V8 in Node and
Deno, JavaScriptCore in Bun); the browser as another runtime;
**V8 / SpiderMonkey / JavaScriptCore** as engines; transpilation
(Babel, swc, esbuild's transformer); the "should I write modern JS and
transpile, or write what the target supports" decision; the relationship
between JS, Node, and TypeScript.

### L2 · Variables: var / let / const · DEEP · ~50 min
Subtopics: var (function-scoped, hoisted, the "temporal" weirdness);
let (block-scoped, hoisted but with temporal dead zone); const
(block-scoped, no rebind, but value-mutable for objects/arrays);
**const is rebinding-immutable, not deep-immutable** — common
misconception; "const everywhere unless you must rebind" practice;
hoisting deep — function declarations vs expressions; the TDZ
(temporal dead zone); the shadowing rules; destructuring with
defaults; rest patterns in destructuring; the comma operator
existence (rarely useful).

Anti-patterns: var in new code; mutating const arrays/objects when you
meant to forbid mutation (use Object.freeze or readonly TS types).

### L3 · Primitive types and the equality maze · DEEP · ~60 min
Subtopics: the 7 primitives: string, number, bigint, boolean, undefined,
null, symbol; object as the umbrella reference type; typeof results
(typeof null === "object" is the famous bug we can't fix); == (with
coercion) vs === (strict) — always use ===, except `== null` for
"null or undefined" check; the truthy/falsy table: false, 0, -0, 0n,
"", null, undefined, NaN; NaN !== NaN — use Number.isNaN; the
Number.isInteger, Number.isFinite friends; the 0.1 + 0.2 problem (IEEE
754 across languages); BigInt for arbitrary precision; symbol as unique
identifier (used in well-known protocols like Symbol.iterator); template
literals; tagged templates; the binary/hex/octal/numeric-separator literals.

### L4 · Functions in JS · DEEP · ~80 min
Subtopics: function declarations vs function expressions vs arrow
functions; named vs anonymous; the `this` binding rules (function call /
method call / new / explicit bind/call/apply / arrow inherits enclosing
this); arrow functions can't be `new`'d; default parameters; rest
parameters; spread in calls; closures (lexical scope captured by reference);
IIFE pattern (and its decline post-modules); generator functions
(function*); async functions; the "function as first-class object" reality
— assign to var, pass, return, attach properties; `function.length`;
`Function.prototype.bind`; arrow vs function trade-offs (arrow for
callbacks, function for methods needing `this`, generator only as
function).

### L5 · Arrays and array methods · DEEP · ~70 min
Subtopics: array literal; Array constructor (mostly avoid); Array.from,
Array.of; length is mutable (truncates); access via index; iteration
(for / for-of / forEach); the canonical methods:
- map / filter / reduce / find / findIndex / some / every / includes
- flat / flatMap (ES2019+)
- slice (non-mutating) / splice (mutating — gotcha)
- push / pop / shift / unshift (mutating)
- sort (mutating, in-place, default-stringifies — always provide compareFn)
- toSorted / toReversed / toSpliced / with (ES2023 non-mutating cousins)
- indexOf / lastIndexOf / Array.prototype.at (for negative indexing)
- join / concat
- entries / keys / values

Sparse arrays and the `forEach` gotcha (skips holes); chaining for
readability vs imperative for performance; "is it copying?" — slice
copies shallowly. Iteration with for-of vs forEach (forEach can't
break/continue, for-of can). The "TypedArray" family (Uint8Array, etc.)
for binary work — preview.

### L6 · Objects and the prototype chain · DEEP · ~90 min
Subtopics: object literal; computed keys; shorthand methods; shorthand
props; spread (...) in object literals; the prototype chain — every
object has a __proto__ that points up; Object.create(proto);
Object.getPrototypeOf / Object.setPrototypeOf; class syntax as sugar over
prototypes; what `new Foo()` actually does (creates object, links proto,
runs Foo with `this` = new object, returns it); `instanceof`; property
descriptors (writable, enumerable, configurable); Object.defineProperty;
getters and setters; Object.freeze / Object.seal / Object.preventExtensions
(and their shallowness); enumeration: for-in (inherited included!),
Object.keys / values / entries (own enumerable), Object.getOwnPropertyNames
(includes non-enumerable); Symbol-keyed properties (don't appear in for-in
or Object.keys); the `hasOwn` (and the older hasOwnProperty) check;
shallow copy: spread, Object.assign; deep copy: structuredClone (modern),
JSON.parse(JSON.stringify(x)) (lossy hack — kills functions, dates,
undefined); Map vs Object (Map preserves insertion order with any-type
keys; Object has string/symbol keys but is more familiar); WeakMap /
WeakSet for "don't prevent GC" caches.

Prototype pollution as a security topic (briefly here, deeper in Phase 9).

### L7 · Destructuring · STANDARD · ~40 min
Subtopics: array destructuring (`const [a, b] = arr`); skip with commas;
rest with `...`; default values; object destructuring (`const {a, b} = obj`);
renaming (`const {a: x} = obj`); defaults; nested destructuring; in
function parameters; with rest pattern.

### L8 · Spread, rest, and the iteration protocol · STANDARD · ~50 min
Subtopics: spread in array literals (clones, concatenates); spread in
object literals (shallow merge with right-wins precedence); spread in
function calls; rest in function params (`(...args) => ...`); rest in
destructuring; the iteration protocol — anything with [Symbol.iterator]()
works in for-of and spread; what's iterable by default (Array, String,
Map, Set, arguments, NodeList); creating iterables; generators yielding
values; Symbol.asyncIterator and async iteration.

### L9 · Control flow · STANDARD · ~40 min
Subtopics: if / else / else-if; ternary; logical && and || returning
values (not booleans — same as Python's short-circuit); nullish
coalescing ?? (returns left only if left is null or undefined, NOT for
0/''/false); optional chaining ?.;  switch (and the fallthrough trap);
for / for-in / for-of / while / do-while; break / continue with labels
(rarely useful); the explicit `for` over implicit Array methods when
early termination is needed.

### L10 · Modules — ESM and CommonJS · DEEP · ~80 min
Subtopics: ESM syntax (`import` / `export`); named vs default exports;
re-exports (`export * from`); import maps; dynamic imports
(`import('path')`); top-level await; CommonJS (`require` / `module.exports`)
— Node's original system; the dual-package hazard (ESM and CJS interop);
"type": "module" in package.json; .mjs / .cjs file extensions; **package
exports field** in package.json; conditional exports (import vs require
vs browser); the ESM-only npm packages problem; how bundlers (esbuild,
webpack, Vite) bridge; tree-shaking and how it relies on ESM static
analysis; circular imports (worse than Python — exports may be undefined
at the moment of access); browser ESM vs Node ESM differences (browser
needs full paths with extensions); native ESM in Node (.mjs or
"type":"module"); the historical mess in one paragraph.

References: Node docs on ESM; Sindre Sorhus's "Pure ESM package" essay.

### L11 · Error handling · DEEP · ~50 min
Subtopics: throw any value (convention: throw Error instances); try /
catch / finally; the catch param (es2019 allows omitting); custom Error
classes (extends Error, super(message), name); Error.cause (ES2022) for
chaining; AggregateError (multiple errors from Promise.any); rethrowing
preserves stack; async errors (full coverage in M3.2); the "catch
shouldn't swallow" rule; logging vs rethrowing.

### L12 · The runtime model · DEEP · ~70 min
Subtopics: the JS engine (V8); the call stack; the heap (objects); the
**event loop** (the most important JS concept); macrotasks
(setTimeout, setInterval, I/O callbacks); microtasks (Promise
.then/catch/finally, queueMicrotask); the rendering steps in browsers;
"blocking the event loop" — long-running synchronous work freezes UI;
how Node's event loop differs (libuv, phases: timers, pending callbacks,
idle, poll, check, close callbacks); when to use setImmediate vs
process.nextTick (process.nextTick runs BEFORE the next event loop tick,
microtask-like; setImmediate runs in the next tick's check phase);
process.nextTick recursive starvation; cooperative vs preemptive
concurrency.

References: jakearchibald.com "In The Loop"; Lin Clark's animated explanations;
Node docs "The Node.js Event Loop, Timers, and process.nextTick()".

---

## Module 3.2 — Async JavaScript

### L13 · The async problem · STANDARD · ~30 min
Why JS is single-threaded; what blocks (synchronous CPU work, sync I/O —
which Node doesn't really have); the historical progression: callbacks →
Promises → async/await; "callback hell" as the original sin.

### L14 · Callbacks · STANDARD · ~40 min
Subtopics: the callback-style API shape (`fn(arg, callback)`); Node-style
error-first callbacks `(err, result) => ...`; the inversion of control
problem; the readability collapse; callback hell example; transformation
to promise via util.promisify.

### L15 · Promises in depth · DEEP · ~90 min
Subtopics: the Promise as a value-eventually; states (pending, fulfilled,
rejected); .then/.catch/.finally; promise chaining (each then returns a
new promise; the return value of the handler becomes next then's input);
.then(onFulfilled, onRejected) signature; the implicit "promise of a
promise" flattening; Promise.resolve / Promise.reject; Promise.all
(fail-fast on any rejection); Promise.allSettled (wait for all,
get array of {status,value/reason}); Promise.race (first to settle wins);
Promise.any (first to fulfill wins; rejects only if all reject — yields
AggregateError); the unhandled rejection rule — process exits in modern
Node, console.error in browser; the promise reactions queue (microtasks);
chaining vs nesting; ordering vs concurrent execution; the pattern
"create all promises, await all together" for concurrency.

### L16 · async / await · DEEP · ~70 min
Subtopics: async fn always returns a Promise; await unwraps it (in a fn);
try / catch around await for error handling; Promise.all + await for
concurrent; for-await-of for async iterables; top-level await (ESM only);
the "you can mix .then and await but DON'T mix them confusingly" rule;
async functions in array .map → array of promises (Promise.all to await);
forEach + async pitfall (forEach doesn't await — use for-of); async
generator functions; AbortController for cancellation; the AbortSignal
plumbing through fetch.

### L17 · fetch and the browser HTTP story · DEEP · ~70 min
Subtopics: fetch API; default GET; method, headers, body options;
Request and Response objects; response.json() / .text() / .blob() /
.arrayBuffer() / .formData(); response.ok (only true for 2xx);
manual status-code branching (fetch DOES NOT reject on 4xx/5xx — common
trap); credentials option (omit, same-origin, include); CORS recap;
streaming responses (response.body as ReadableStream); AbortController
+ signal for cancellation; the modern replacement: ofetch (Unjs),
ky (wrappers); axios (legacy popular); when each fits.

### L18 · Streams · STANDARD · ~50 min
Subtopics: Readable, Writable, Duplex, Transform streams in Node;
pipe() and pipeline(); object mode; the Web Streams API
(ReadableStream/WritableStream) in modern browsers and Node 18+;
backpressure; the "stream large files instead of buffering" rule;
ReadableStream from fetch.

### L19 · Errors in async code · DEEP · ~50 min
Subtopics: the unhandled rejection problem; try/catch in async functions;
.catch on chains; Promise.allSettled for partial success; finally for
cleanup (note: finally doesn't affect the resolution value); cancellation
not = error (AbortError); the "log and rethrow" pattern; structured logging
with error.cause chains.

---

## Module 3.3 — TypeScript

### L20 · Why TypeScript · STANDARD · ~30 min
Subtopics: what static typing buys you (catch bugs at edit-time vs runtime;
self-documenting; refactoring confidence); the gradual adoption story;
TypeScript is JavaScript + types — it compiles AWAY at runtime; there
are NO types at runtime (zod/io-ts/valibot exist for runtime validation);
the cost (build step, learning curve); the modern default — most new
projects start in TS.

### L21 · Basic types · DEEP · ~70 min
Subtopics: primitive type names (string, number, boolean, bigint, symbol,
null, undefined, void, never, unknown, any); literal types ("foo", 42);
array types (T[] vs Array<T>); tuple types ([string, number]);
object types (with required/optional/readonly modifiers); function types
(parameter and return); union types (A | B); intersection types (A & B);
type assertions (`x as T`) — and when they lie; non-null assertion (`x!`);
type aliases vs interfaces — when each fits.

### L22 · Generics · DEEP · ~90 min
Subtopics: generic functions; generic types/interfaces/classes; type
parameter constraints (`<T extends Foo>`); default type parameters;
inference vs explicit; multiple type parameters and their relationships;
"why is TS complaining about this generic" — read the error carefully,
unify; conditional types (`T extends U ? X : Y`); mapped types (`{ [K
in keyof T]: ... }`); template literal types; infer keyword in conditional
types; the standard utility types (Partial, Required, Readonly, Pick,
Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters,
Awaited, etc.); when the type magic helps vs hurts (rule: if a junior
can't read it, it's too clever).

### L23 · Discriminated unions, narrowing, type guards · DEEP · ~70 min
Subtopics: discriminated unions ("kind" or "type" tag fields);
the `in` narrowing; `typeof` narrowing; `instanceof` narrowing;
user-defined type guards (`function isFoo(x): x is Foo`);
exhaustiveness with never (the `assertNever(x)` pattern); the role of
control-flow analysis; readonly arrays and tuples; `as const` and how
it preserves literals.

### L24 · Structural typing and Protocols · STANDARD · ~50 min
Subtopics: TS's structural type system (anything with the right shape is
assignable); the "duck typing made explicit" comparison; the trade-off
vs nominal typing (use branded types / NewType-like patterns for nominal);
class identity is structural too.

### L25 · TS with modules · STANDARD · ~50 min
Subtopics: module syntax overlaps with JS; type-only imports
(`import type { X } from "..."`); export type vs export interface;
declaration files (.d.ts) — for typing JS libraries; ambient declarations;
the @types/ npm packages from DefinitelyTyped; how `tsc` resolves modules;
NodeNext vs Node10 vs Bundler module resolution (tsconfig knob, mostly
choose NodeNext for Node, Bundler for Vite/Next).

### L26 · tsconfig.json · DEEP · ~70 min
Subtopics: the file's role; the most impactful options: strict
(turns on a bunch of safety), noImplicitAny, strictNullChecks (the most
valuable single flag), strictFunctionTypes, strictBindCallApply,
noUnusedLocals/Parameters (debate), exactOptionalPropertyTypes (advanced),
noImplicitReturns, noImplicitOverride, noPropertyAccessFromIndexSignature
(advanced); target (which JS to compile down to); module / moduleResolution;
paths (import aliases like @/...); lib (DOM, ESNext); jsx; esModuleInterop;
allowSyntheticDefaultImports; isolatedModules; declaration / declarationMap;
sourceMap; incremental builds; project references for monorepos;
strict bringup strategy ("start permissive, add strictness over time").

### L27 · Reading and decoding TypeScript errors · DEEP · ~50 min
Subtopics: the structure of a TS error; the "expected vs actual" pattern;
following the "type Foo is not assignable to type Bar" chain; clicking
through to the type definitions; the "Type 'undefined' is not assignable
to type 'X'" trail (strictNullChecks); generic inference failures;
"property does not exist" — usually a typo or wrong namespace; the
hierarchy of type errors (some are catastrophic, some are surface);
which errors usually mean "I really do need to fix this" vs "I need to
narrow the type."

### L28 · Runtime validation with zod/valibot/effect-schema · STANDARD · ~50 min
Subtopics: types disappear at runtime; you need a runtime validator at
every external boundary (API requests, env config, untrusted JSON);
zod as the dominant choice (schema-first, infers TS type from schema);
valibot as the lighter cousin; effect-schema for those in the Effect
ecosystem; the "parse, don't validate" principle (return typed value,
not bool); error formatting; common patterns (zod's `.safeParse`, `.refine`,
`.transform`); pairing zod with Express/Hono/Next request handlers.

---

## Module 3.4 — Node.js

### L29 · What Node is, runtime overview · STANDARD · ~40 min
Subtopics: V8 + libuv + Node's standard library; the npm registry as the
ecosystem; what Node is good at (I/O-bound concurrent work, real-time,
APIs, scripts); what it's not (CPU-heavy work, embedded, mobile); the
LTS schedule (even-numbered majors are LTS); the modern alternatives:
Deno (TS-native, secure-by-default, web-standard APIs), Bun (fast, all-in-one,
JSC engine); when each fits; the npm registry; the `npx` tool.

### L30 · npm, pnpm, yarn — package management · DEEP · ~75 min
Subtopics: npm as default (Node's bundled manager); pnpm (faster, disk-
efficient via content-addressed store, strict by default); yarn classic
vs yarn berry; bun's package manager (in Bun); installing; uninstalling;
running scripts; package.json fields (name, version, description, type
("module" / "commonjs"), main, module, exports, scripts, dependencies,
devDependencies, peerDependencies, optionalDependencies, bundledDependencies,
overrides/resolutions, engines, packageManager, sideEffects);
node_modules layout; pnpm's symlink-based layout; lockfiles (package-lock.json,
pnpm-lock.yaml, yarn.lock); install behavior (npm ci for clean reproducible);
peer dependencies and the strict pnpm enforcement; workspaces; the
"prefer pnpm for monorepos" practice; npm scripts and pre/post hooks;
running with `npx package` (one-shot); the @scope/package convention.

### L31 · package.json deep · DEEP · ~50 min
Subtopics: every field explained; the exports field for modern packages;
conditional exports; subpath exports; the "engines" field as advisory;
the version range syntax (^, ~, exact, *, x, latest, pre-release tags);
how scripts work; passing args to scripts; using env vars in scripts;
the runtime selection (packageManager field, .nvmrc / .tool-versions).

### L32 · Reading and writing files in Node · STANDARD · ~40 min
Subtopics: fs (sync, callback, promise variants — prefer fs/promises);
fs.readFile / writeFile / appendFile; streams for large files; the
path module; URL pathname; pathlib-like helpers via node:path; cwd();
__dirname / __filename in CommonJS vs `import.meta.url` in ESM (the
ESM dance: `fileURLToPath(import.meta.url)`).

### L33 · HTTP server in Node — the raw API · STANDARD · ~50 min
Subtopics: http.createServer; req and res objects; req.url, req.method,
req.headers; reading body (it's a stream); res.statusCode, res.setHeader,
res.write, res.end; the manual routing problem (which is why frameworks
exist); HTTPS server; node:https; HTTP/2; HTTP/3 (not yet native).

### L34 · The Node event loop (deep dive) · DEEP · ~60 min
Subtopics: revisited from L12; the phases (timers → pending callbacks →
idle/prepare → poll → check → close); process.nextTick vs setImmediate
ordering; microtask queue between every phase; libuv thread pool (default 4
threads, used for fs and crypto); fully sync code BLOCKS the loop;
"don't block the event loop" — examples of CPU-heavy operations and
their mitigation (offload to worker_threads, use clustering); the
"single-threaded but concurrent" model.

### L35 · Worker threads, child processes, cluster · STANDARD · ~50 min
Subtopics: worker_threads for CPU-bound work in same process (separate
event loops, shared ArrayBuffers); child_process (spawn / exec / fork)
for separate processes; cluster module for spawning workers across cores
(historical — now often replaced by container-orchestrator scaling);
the "share nothing" model recommendation; when each fits.

### L36 · Modern Node alternatives — Deno and Bun · STANDARD · ~40 min
Subtopics: Deno's secure-by-default model (permissions: --allow-net,
--allow-read, etc.); web-standard APIs (fetch, Web Streams, FormData);
TypeScript built-in; deno.json / deno.lock; URL-based imports vs
npm-compat (Deno supports both now); Bun's all-in-one philosophy (runtime,
package manager, test runner, bundler); JSC engine vs V8; FFI;
performance positioning; when to actually use them (greenfield; performance-
critical; team familiarity).

---

## Module 3.5 — Testing JavaScript

### L37 · Vitest (and Jest) · DEEP · ~75 min
Subtopics: Vitest as the modern default (Vite-native, ESM-first, fast);
Jest as the historical default; test discovery; describe/it/test; before/
after hooks; expect with matchers (.toBe, .toEqual, .toMatchObject, .toThrow,
.toContain, .toHaveBeenCalledWith); spies and mocks (vi.fn, vi.spyOn,
vi.mock); snapshot tests (with caveats); coverage; CI integration.

### L38 · Component / integration / e2e · STANDARD · ~40 min
Tests pyramid for frontend: unit (logic) → component (Vitest + Testing
Library) → integration (multiple modules) → e2e (Playwright or Cypress).
Playwright as the modern e2e standard (multi-browser, robust, fast).
The "test behavior, not implementation" Testing Library philosophy.

### L39 · Property-based testing with fast-check · LIGHT · ~30 min
Just-know-it-exists. When pure-function code benefits.

---

## Module 3.6 — Production JS / TS patterns

### L40 · Error handling patterns at scale · STANDARD · ~50 min
Result types (neverthrow library, or hand-rolled `{ ok: true, value } |
{ ok: false, error }`); the "throw vs return error" debate; pairing TS's
exhaustiveness with discriminated-union Results; Effect-TS as the
all-in-one (advanced; mention).

### L41 · The pragma / config / env file layer · STANDARD · ~40 min
.env loading with dotenv-flow / dotenvx; runtime validation with zod;
the typed-env-object pattern (export typed config); per-environment
overrides.

### L42 · CLIs in Node · LIGHT · ~30 min
Tools: commander, yargs, oclif, citty. Color output (kleur, chalk).
Prompts (prompts, @clack/prompts, inquirer). Listr for task UIs.

### L43 · Build tools and bundlers · STANDARD · ~60 min
Subtopics: esbuild (fast, simple, focused); swc (fast, more features);
Vite (dev server + production build, Rollup under hood); Rollup (libraries);
webpack (legacy enterprise); tsup (ESM lib bundler on esbuild); turbopack
(Next.js's dev bundler in 2026); rolldown (Vite's future Rust-based
bundler); the "library vs application" decision tree.

### L44 · monorepo tooling · STANDARD · ~50 min
pnpm workspaces (file-level); Turborepo (caching + selective builds);
Nx (full-featured, conventions); Moon, Lage (newer); workspace patterns;
shared eslint/tsconfig/prettier; selective deploy from monorepos.

### L45 · TypeScript performance and ergonomics in big repos · DEEP · ~50 min
Subtopics: project references for incremental builds; the slow-types
problem; type-only imports; the "type cycles cause slowness" gotcha;
when to use `unknown` over `any`; the dangers of overly clever types
(compile times); `tsc --watch` vs `tsc --noEmit` in CI vs bundler's
own type-checking.

---

## Phase 3 cross-thread coverage

- **Testing:** M3.5 dedicated; threads through M3.6.
- **Debugging:** Chrome DevTools tour (next phase, Frontend, covers in
  depth); Node `--inspect` flag mentioned in M3.4.
- **Performance:** event loop blocking (L12, L34); bundle size in M3.6;
  TS compile time in L45.
- **Security:** prototype pollution preview (L6); XSS preview (Phase 6
  proper); eval avoidance (L11); secrets via env (L41).
- **AI-integration:** SDKs are all available as npm packages; the
  `openai` / `@anthropic-ai/sdk` packages mirror their Python siblings
  closely.

---

## What Phase 3 doesn't cover (deferred)

- React, Next.js, frontend frameworks — Phase 6.
- Backend frameworks (Express/Fastify/Hono) — Phase 5.
- Deployment of Node apps — Phase 7.
