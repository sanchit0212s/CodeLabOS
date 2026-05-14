# Phase 6 — Frontend

**Essence:** the UI is the only part of a SaaS most users ever see. Bad
backend code is invisible to users until it's catastrophic; bad frontend
is felt every second. By Phase 6's end, the student reads any React /
Next.js codebase, identifies the standard frontend anti-patterns
(unnecessary renders, stale closures, prop drilling, useEffect abuse,
unstable keys, CSS specificity wars), and can write components without
help.

**Gate:** read a non-trivial Next.js App-Router page that mixes server
and client components, a form, a data fetch, and an error boundary;
predict its rendering behavior; spot any of: render-on-every-keystroke
bugs, "the component re-renders because of an unstable object prop,"
"useEffect runs twice in strict mode and the AI agent didn't notice,"
"the data is fetched on the client when it should be server-rendered."

**Restructuring note:** original scaffold had 33 lessons across 4 modules.
Expanded here to ~60 lessons across 8 modules. Frontend has the most
moving parts of any phase; the React ecosystem alone needs several modules.

**Primary references**
- MDN Web Docs (HTML, CSS, JS, Web APIs) — primary reference for
  everything.
- web.dev / learn — Google's modern web tracks (HTML, CSS, Forms,
  Accessibility, Performance, Privacy, Images, Responsive).
- *CSS in Depth*, 2nd ed. (Keith Grant).
- *Every Layout* (Heydon Pickering & Andy Bell).
- *Refactoring UI* (Adam Wathan & Steve Schoger).
- *Inclusive Components* (Heydon Pickering) — accessibility.
- *Designing for the Web* (Mark Boulton) — typography and layout.
- React official docs — react.dev. Best-written framework docs in the
  industry.
- *Tao of React* (Alex Kondov) — patterns.
- *Patterns.dev* (Lydia Hallie & Addy Osmani) — design patterns for web.
- Josh W. Comeau's blog — practical React deep dives.
- Kent C. Dodds — Testing Library philosophy, the "epic" courses.
- Dan Abramov essays (overreacted.io) — React mental models.
- Next.js documentation — official.
- Lee Robinson's blog (Vercel VP DevX) — modern stack thinking.
- *Don't Make Me Think* (Steve Krug) — UX foundations.
- WCAG 2.2 official spec for accessibility.

**Cross-phase threads touched here**
- Testing — Vitest, Testing Library, Playwright.
- Debugging — React DevTools, browser DevTools, accessibility audits.
- Performance — Core Web Vitals (LCP, FID/INP, CLS), bundle analysis,
  render performance.
- Security — XSS prevention, CSP, CORS recap, secure cookies, OAuth flows.
- AI-integration — streaming AI responses in UI, optimistic updates,
  rich-text editing patterns for chat.

---

## Module 6.1 — HTML

### L1 · The DOM and document structure · DEEP · ~60 min
Subtopics: what HTML is (a serialization of a tree); the DOM as the
live tree the browser maintains; doctype; html/head/body; head contents
(meta charset, viewport, title, link to CSS, script, meta og:* for
sharing); semantic body structure (header, main, footer, nav, section,
article, aside); document outline; void elements (img, br, hr, input —
no closing tag); self-closing-syntax (JSX uses it; HTML doesn't strictly).

### L2 · The semantic tag catalog · DEEP · ~80 min
Subtopics — the tags worth knowing fully:
- Headings h1-h6 (one h1 per page is the convention)
- p, div, span (and the "div soup" anti-pattern)
- a (href, target, rel — security with rel=noopener noreferrer)
- img (src, alt — alt is required; srcset/sizes for responsive; loading="lazy")
- picture / source — art direction and format negotiation
- video / audio (with controls, autoplay caveats)
- ul / ol / li, dl / dt / dd
- table / thead / tbody / tr / th / td (use for tabular data only)
- form / input / textarea / select / option / button / label / fieldset /
  legend
- input types (text, email, password, number, tel, url, search, date,
  time, datetime-local, month, week, range, color, file, checkbox, radio,
  submit, hidden)
- input attributes (required, pattern, minlength, maxlength, min, max,
  step, autocomplete, inputmode, enterkeyhint)
- button vs input type="submit"
- label association (for=id vs wrapping)
- nav, header, main, footer, aside, section, article (and when each)
- figure / figcaption
- details / summary (native accordion)
- dialog (native modal — `<dialog open>`, `dialog.showModal()`)
- progress / meter
- time (with datetime attribute)
- mark, kbd, code, pre, samp
- template / slot (web components)
- script (type="module", defer, async)
- iframe (sandbox attribute, security)

### L3 · Forms in depth · DEEP · ~90 min
Subtopics: the form element; action, method (GET, POST), enctype
(application/x-www-form-urlencoded, multipart/form-data, text/plain);
form submission semantics (full page reload by default); preventDefault
in JS to keep page; FormData API; serializing forms; client-side
validation attributes (required, pattern, minlength, etc.); the
:invalid / :valid CSS pseudo-classes; novalidate to opt out; uncontrolled
inputs (just read from DOM); controlled inputs (React's bidirectional
binding); the typing-while-React-is-rendering issue; accessibility (labels,
fieldsets, aria-describedby for hints, aria-invalid + role="alert" for
errors); native file upload UI; multi-step forms; saving progress (auto-save
to localStorage); the universal "submit by Enter key in single-input
forms" gotcha; protecting against double-submit.

### L4 · Semantic HTML and accessibility basics · DEEP · ~70 min
Subtopics: WCAG 2.2 levels (A, AA, AAA — most companies aim for AA);
WAI-ARIA roles, states, properties (the "ARIA is a last resort — use
native HTML semantics first" rule); the "div + onClick" anti-pattern
(use button); focusability (tabindex=0 to make focusable; tabindex=-1
to make programmatically focusable but not in tab order; never use
positive tabindex); skip links; aria-label vs aria-labelledby; aria-live
regions for dynamic content; landmark roles; screen reader testing
(VoiceOver, NVDA); color contrast (4.5:1 for normal text); the keyboard-
only audit (tab through every page).

### L5 · The Document Object Model in practice · DEEP · ~70 min
Subtopics: window vs document; element selection (querySelector vs
querySelectorAll vs getElementById vs getElementsByClassName/TagName);
NodeList (some live, some static); element creation
(createElement / cloneNode); insertion (appendChild, insertBefore,
prepend, append, before, after); removal (remove, removeChild);
attributes (getAttribute / setAttribute / removeAttribute / dataset);
classList (add, remove, toggle, contains); innerText vs textContent vs
innerHTML; the innerHTML XSS warning; event listeners (addEventListener
with options: capture, once, passive, signal); event delegation; the
event object and bubbling/capturing; preventDefault and stopPropagation;
custom events (new CustomEvent); MutationObserver / IntersectionObserver
/ ResizeObserver; the Range and Selection APIs (for rich-text editors).

### L6 · Web platform APIs to know · STANDARD · ~60 min
The relevant browser APIs catalog: localStorage / sessionStorage;
IndexedDB (when localStorage isn't enough); cookies (document.cookie —
prefer http-only cookies from server, but document.cookie is sometimes
used); fetch / Request / Response / Headers; URLSearchParams (build query
strings); URL; FormData; Blob / File; FileReader; navigator.clipboard
(copy/paste); navigator.share (Web Share API on mobile); History API
(pushState / replaceState / popstate); window.matchMedia (CSS media
queries in JS); Notification API (browser desktop notifications);
Service Workers (offline support); the Web Speech API; WebRTC
(real-time peer-to-peer media); Geolocation, Vibration, Battery
(less common); the Page Visibility API (visibilitychange event);
BroadcastChannel for cross-tab messaging; the Resize/Intersection/
Mutation observer trio.

---

## Module 6.2 — CSS

### L7 · The CSS model · DEEP · ~70 min
Subtopics: selectors, properties, values, declarations, rules; the
cascade and specificity; specificity calculation (inline=1000, ID=100,
class/attribute/pseudo-class=10, type=1, !important escape hatch);
the "specificity wars" anti-pattern (use specificity sparingly);
inheritance (which properties inherit by default, which don't); the
:root and CSS custom properties (--var: value) and var(--var);
@media queries; @supports (feature queries); @layer (cascade layers,
the modern specificity tool); the !important keyword (almost never
needed in greenfield code).

### L8 · Selectors deep · DEEP · ~70 min
Subtopics: simple selectors (type, class, id, attribute); pseudo-classes
(:hover, :focus, :focus-visible, :focus-within, :active, :disabled,
:checked, :first-child, :last-child, :nth-child, :nth-of-type, :not(),
:is(), :where(), :has() — newer "parent selector"); pseudo-elements
(::before, ::after, ::marker, ::selection, ::placeholder, ::first-line,
::first-letter, ::file-selector-button); combinators (descendant, child >,
adjacent +, general sibling ~); attribute selectors with operators
([attr=value], [attr~=word], [attr|=lang], [attr^=prefix], [attr$=suffix],
[attr*=substring]); the modern :is/:where/:has parent/sibling combinations.

### L9 · The box model and display modes · DEEP · ~70 min
Subtopics: content / padding / border / margin; box-sizing: content-box
(default, surprising) vs border-box (sane — set with `*, *::before,
*::after { box-sizing: border-box }`); margin collapse rules (vertical
adjacent margins collapse to the larger); display values: block, inline,
inline-block, flex, grid, contents, none; visibility: hidden vs
display:none vs hidden attribute vs aria-hidden — when each fits;
overflow (visible, hidden, scroll, auto, clip); position (static,
relative, absolute, fixed, sticky); the stacking context rules; z-index
(only works on positioned or flex/grid children with order; only
positive z-index is "above"; z-index inside a stacking context can't
escape).

### L10 · Flexbox in depth · DEEP · ~80 min
Subtopics: flex container vs flex item; flex-direction; flex-wrap;
flex-flow; justify-content (main axis); align-items (cross axis);
align-content (multi-line); align-self; gap; flex (shorthand: flex-grow
flex-shrink flex-basis); the default of flex: 0 1 auto; min-width:0
trick for "shrink past content size"; common patterns: navbar, sticky
footer, card grid; mental model: flex is one-dimensional.

### L11 · Grid in depth · DEEP · ~90 min
Subtopics: grid-template-columns / rows; fr (fraction) unit; minmax(),
repeat(), auto-fit, auto-fill; named grid areas (grid-template-areas);
grid-column / grid-row span; gap; justify-content / align-content for
the whole grid; justify-items / align-items for cells; place-content /
place-items shorthand; the modern responsive-without-media-queries
pattern (`grid-template-columns: repeat(auto-fit, minmax(min(100%,
300px), 1fr))`); subgrid (modern); when grid beats flexbox
(two-dimensional vs one-dimensional).

### L12 · Responsive design · DEEP · ~70 min
Subtopics: mobile-first vs desktop-first (mobile-first won); viewport
meta tag; @media queries (min-width vs max-width, both); the popular
breakpoints (sm, md, lg, xl, 2xl in Tailwind convention); container
queries (the newer alternative — based on container size, not viewport);
fluid typography (clamp(min, vw-based, max)); the "rem for sizing,
em for spacing related to font size" convention; logical properties
(margin-inline-start, padding-block-end — for i18n / right-to-left).

### L13 · Typography on the web · STANDARD · ~50 min
Subtopics: font stacks; web fonts (Google Fonts vs self-hosted vs
@font-face); font-display swap; font-feature-settings (ligatures);
font weights; line-height (no unit, 1.5 typical); letter-spacing;
text-wrap: balance / pretty (modern); the readable line-length (~65ch);
fluid typography revisited.

### L14 · Colors and modern color spaces · STANDARD · ~40 min
Subtopics: hex / rgb / rgba / hsl / hsla; modern formats (oklch, oklab,
lab, lch — better for design systems); color-mix(); accent-color (for
form controls); color contrast for accessibility; dark mode
(prefers-color-scheme); CSS-defined themes via variables.

### L15 · Transitions and animations · STANDARD · ~60 min
Subtopics: transition property; transition shorthand; cubic-bezier curves;
@keyframes; animation properties; animation-fill-mode; reduce-motion
preference (prefers-reduced-motion); FLIP technique briefly;
view-transitions API (modern); WAAPI (Web Animations API) for JS-driven;
when to use Framer Motion (declarative React animations) vs raw CSS.

### L16 · CSS architecture: from raw CSS to Tailwind · DEEP · ~80 min
Subtopics: the history (BEM, OOCSS, SMACSS); CSS-in-JS rise and fall
(styled-components, emotion); CSS Modules; Sass/Less (mostly displaced);
**Tailwind CSS** — the current dominant approach (utility-first, no
naming, design-system constraints); arbitrary values; the
"design tokens via @theme" v4 style; component classes via @apply
(when needed); HeadlessUI / Radix / Ark for accessible primitives;
shadcn/ui as the "copy-paste components" model; the trade-off discussion
(verbose markup vs no context switch); when raw CSS still beats Tailwind
(stable design systems with limited utility needs); the future (cascade
layers, container queries, @scope — make raw CSS more capable).

### L17 · Common CSS patterns and "ah I never thought of that" tricks · STANDARD · ~50 min
The hidden-but-accessible class (sr-only); centering with
place-items:center; aspect-ratio property; sticky headers; the
overflow:hidden + position:absolute background pattern; pure-CSS
tooltips; pure-CSS toggles with checkboxes (limited but cool).

---

## Module 6.3 — JavaScript on the page (vanilla DOM work)

### L18 · When you don't need a framework · STANDARD · ~40 min
Subtopics: static sites, landing pages, marketing pages with minimal
interaction don't need React; the cost of a framework (bundle size,
hydration cost, complexity); when vanilla JS or Alpine.js or htmx are
better choices; the "progressive enhancement" mindset.

### L19 · Web Components and the platform alternative · STANDARD · ~50 min
Subtopics: customElements.define; the lifecycle callbacks
(connectedCallback, disconnectedCallback, attributeChangedCallback);
Shadow DOM; slots; template element; the case for and against
(framework-agnostic, but tooling is rougher); Lit as the friendly
abstraction; FAST as Microsoft's flavor.

---

## Module 6.4 — React

### L20 · What React is and its mental model · DEEP · ~60 min
Subtopics: declarative, component-based UI library; "UI as a function of
state"; the virtual DOM (mostly an implementation detail now);
reconciliation; JSX is sugar for React.createElement; components as
functions returning JSX; the strictly-pure-rendering-function rule
(no side effects during render); the unidirectional data flow (props
down, events up); the relationship to React Native (same model,
different renderer).

### L21 · Components, props, and JSX · DEEP · ~70 min
Subtopics: function components (the standard); class components
(legacy, sometimes still seen); JSX syntax (expressions in braces, no
ifs but ternaries/&&, fragments <></> / <React.Fragment>, attributes
in camelCase, className not class, htmlFor not for, style as object,
dangerouslySetInnerHTML for raw HTML — XSS warning); props as the
input; the "props down" convention; children prop and composition
(`<Parent><Child/></Parent>`); render props (legacy pattern); higher-
order components (legacy); TypeScript-typed props.

### L22 · State and useState · DEEP · ~70 min
Subtopics: state vs props (state is "owned by this component"); useState
hook syntax; updates as the "new value" not a mutation; the functional
update form (`setState(prev => prev + 1)`) for sequential updates and
async safety; lazy initial state (function form `useState(() =>
expensiveInit())`); the "state batching" behavior (React 18 batches
across promises, not just events); when to lift state up; when to keep
state local; the "don't store derived state, compute it" rule.

### L23 · Conditional rendering and lists · STANDARD · ~50 min
Subtopics: ternary, &&, returning null; the &&-with-0-renders-0
gotcha (use ternary or Boolean()); rendering arrays with .map; the
**key prop** — what it's for, the unstable-key bug (using index as key
when list reorders), the "use stable IDs" rule; React.Fragment for
multiple top-level returns.

### L24 · Event handling · STANDARD · ~50 min
Subtopics: onClick, onChange, onSubmit, onKeyDown, onMouseEnter, etc.;
the synthetic event wrapper; e.preventDefault / e.stopPropagation;
form events; controlled inputs (value + onChange); the "create a new
function inside JSX" performance non-issue for most apps (but matters
in big lists); event handler typing in TS (MouseEvent<HTMLButtonElement>).

### L25 · useEffect — the most misused hook · VERY-DEEP · ~120 min
Subtopics (~22):
1. What effects are: synchronizing with external systems.
2. The mental model from react.dev — "you might not need an effect."
3. The dependency array — what it really controls.
4. The "no dependency array" runs every render.
5. The "empty array" runs once (then never).
6. Stale closures and the dependency-array escape route.
7. useEffect runs AFTER render commits — see the new DOM.
8. The cleanup function — when it runs (before next effect, before unmount).
9. **Strict Mode double-invocation** in dev — what it's catching.
10. Effects for: subscribing to external data, manual DOM ops, syncing
    to localStorage, third-party widget integration.
11. Effects that **don't belong**: derived state (use a variable); event
    handlers (use onClick); fetching data on mount (use a data-fetching
    library or RSC, not raw effect).
12. The exhaustive-deps ESLint rule — usually trust it.
13. The "I need to skip the dep" patterns — useRef, useReducer dispatch,
    refs.
14. Race conditions in effects (the "two fetches resolve out of order"
    bug) and how to cancel.
15. AbortController + signal for fetch cancellation.
16. useEffect for animations — usually wrong (use CSS or animation
    libraries).
17. useLayoutEffect — runs synchronously after DOM mutation, before
    paint — for measuring layout.
18. useEffect vs useEvent (RFC) for "non-reactive value in handler."
19. The escape hatch: a ref-based "latest-value" pattern.
20. The "I store function in state" smell — usually a ref.
21. Cleanup must be idempotent.
22. Effects in concurrent React — interruption awareness.

References: react.dev "You Might Not Need an Effect" — required.

### L26 · Refs and imperative escape hatches · STANDARD · ~50 min
Subtopics: useRef for mutable values that don't trigger re-render;
useRef for DOM access; ref forwarding (forwardRef + useImperativeHandle);
when to use a ref vs state ("does the UI change when this changes?
→ state; otherwise → ref"); ref callbacks for runtime measurements;
the "ref-as-latest-value" pattern for effects.

### L27 · The full hook catalog · DEEP · ~70 min
Subtopics: built-in hooks tour:
- useState / useReducer (covered in L22; reducer for complex state)
- useEffect / useLayoutEffect / useInsertionEffect (covered L25)
- useRef (L26)
- useContext (L28)
- useMemo / useCallback (L29 — memoization)
- useTransition / useDeferredValue (concurrent features)
- useId (stable IDs across server/client renders)
- useSyncExternalStore (for state-management libraries)
- useDebugValue (devtools labels)
- useActionState (form state from React 19+)
- useFormStatus (sibling to action state)
- useOptimistic (optimistic updates from React 19+)

### L28 · Context and prop drilling · DEEP · ~50 min
Subtopics: createContext; Provider; useContext; the re-render problem
(every consumer re-renders when provider value changes); patterns to
avoid that re-render (split contexts, memoize provider value, use a
state library); when context is right (theming, auth user, i18n locale);
when state-management libraries are better (Zustand, Jotai, Redux);
the "context is not a state management library" mantra.

### L29 · Memoization — useMemo, useCallback, React.memo · DEEP · ~70 min
Subtopics: when memoization actually helps (expensive computations,
unstable references breaking child memo, large lists); when it doesn't
(most components don't need it); the React Compiler (formerly React
Forget) — auto-memoization in React 19+; the "premature optimization"
anti-pattern; profiling first; the "stable reference is the goal" rule;
React.memo for component memoization; props equality check.

### L30 · Composition patterns · DEEP · ~60 min
Subtopics: children prop as the basic composition; slot-like patterns
(named children via props); compound components (Tabs + Tab + TabPanel
sharing state via context); render props (legacy but sometimes useful);
HOCs (almost never these days); the "container/presentational" pattern
(also dated, mostly replaced by hooks); custom hooks as the modern
abstraction.

### L31 · Custom hooks · DEEP · ~50 min
Subtopics: any function starting with `use` is a hook; encapsulating
stateful logic; rules of hooks (only at top level, only from React
functions, no conditional calls); common custom hooks (useLocalStorage,
useToggle, useDebounce, useMediaQuery, useEventListener); the "hooks
are composable behaviors" model; sharing hooks across components.

### L32 · Routing — React Router, Next.js · STANDARD · ~60 min
Subtopics: client-side routing concept; React Router v6/v7 (data router
API); links vs anchor tags; programmatic navigation; route parameters;
nested routes; route guards (loaders, actions in v6+); the Next.js
App Router as the modern integrated alternative.

### L33 · Forms in React — controlled, react-hook-form, Server Actions · DEEP · ~80 min
Subtopics: the controlled-input pattern; uncontrolled inputs with
defaultValue; the "lift state up" form pattern; pain points
(every keystroke re-renders); **react-hook-form** as the modern
default (uncontrolled, register-based, performant); zodResolver for
validation; the Conform library (React Aria + zod + form state);
React 19 Server Actions and useFormState (form state from server);
the FormData approach (vanilla form submission + Server Action);
multi-step forms; field arrays; conditional fields; submission states
(submitting, success, error).

### L34 · Data fetching — the strategies · VERY-DEEP · ~120 min
Subtopics:
1. Fetch in useEffect (legacy, race-condition-prone, manual loading
   state).
2. SWR (stale-while-revalidate) by Vercel — declarative, cache,
   revalidation triggers.
3. TanStack Query (formerly react-query) — the powerhouse: queries,
   mutations, invalidation, optimistic updates, infinite queries,
   prefetch, suspense integration.
4. RTK Query (if you're already in Redux).
5. tRPC + TanStack Query for end-to-end TypeScript.
6. **Server Components fetching** (Next.js App Router, RSC era) — fetch
   on server, no client-side waterfall, smaller bundle.
7. Loader pattern (Remix, React Router v6+).
8. Streaming with Suspense — show parts as they load.
9. Optimistic updates pattern.
10. Pagination, infinite-scroll patterns.
11. Cache invalidation strategies.
12. Real-time updates (SSE, WebSocket-based subscriptions).
13. The "single source of truth — TanStack Query cache" pattern.
14. Mutating + revalidating queries after a mutation.
15. AbortController in fetches.
16. Race condition prevention.

The "RSC-first, fetch on server, mutate via Server Actions, hydrate
client-only for interactivity" modern Next.js mental model.

### L35 · Error boundaries and Suspense · DEEP · ~50 min
Subtopics: ErrorBoundary as a class component (still the only API for
error boundaries); the "errors in render get caught, errors in handlers
do not" rule; react-error-boundary library for hooks-friendly usage;
the FallbackComponent / onError API; Suspense for "show fallback while
async work happens"; pairing Suspense with data fetchers (TanStack Query
suspense mode); resetting after error.

### L36 · Performance and the React rendering model · DEEP · ~80 min
Subtopics: React renders the tree on every state change in the subtree;
parent renders cause children to render unless memoized; what triggers
a re-render (state change, parent re-render, context value change);
reading the React Profiler in DevTools (highlight what re-rendered and
why); the "find the unnecessary render" exercise; the "stable references"
discipline (memoize objects passed as props); the React Compiler;
virtualization (TanStack Virtual, react-window) for long lists;
code splitting with React.lazy + Suspense; bundle analysis tools.

---

## Module 6.5 — State management ecosystem

### L37 · The state management decision · DEEP · ~50 min
Subtopics: when local state suffices (most components); when context is
enough (theme, locale); when you need a real state library (cross-component
state mutated from many places, like cart, complex form, multi-page wizards);
the trade-offs; the "your server cache is also state" insight (TanStack
Query handles a lot of what state libraries used to).

### L38 · Zustand · STANDARD · ~50 min
The modern default. Minimal, hooks-based, no boilerplate. Subscribe-only
selectors for performance. Persist middleware for localStorage. Devtools
middleware.

### L39 · Jotai · LIGHT · ~30 min
Atom-based. Fine-grained reactivity. Pairs well with Suspense. Pick when
the "many small pieces of state" model fits.

### L40 · Redux Toolkit · STANDARD · ~50 min
Still common. Slice pattern. createAsyncThunk for async. RTK Query for
data fetching. The "you probably don't need Redux" reality for new
projects.

### L41 · Other notable mentions · LIGHT · ~20 min
MobX (still has fans), Valtio (proxy-based), XState (state machines —
when state is genuinely state-machine-shaped), TanStack Store.

---

## Module 6.6 — Next.js (the dominant React framework)

### L42 · Next.js philosophy and the App Router · DEEP · ~70 min
Subtopics: Pages Router (legacy) vs App Router (the modern way); the
React Server Components (RSC) paradigm; the "everything is a Server
Component by default, opt into Client Components" model; file-system-
based routing; nested layouts; the special files (page.tsx, layout.tsx,
loading.tsx, error.tsx, not-found.tsx, template.tsx, route.ts);
parallel routes and intercepted routes (modal patterns); route groups
(grouping without affecting URL).

### L43 · Server Components vs Client Components · VERY-DEEP · ~120 min
Subtopics (~22):
1. The default in App Router: Server Components.
2. The "use client" directive marks a file as Client Component.
3. What Server Components can do: fetch data (await), access DB / files /
   secrets, not have interactivity (no useState, no useEffect).
4. What Client Components can do: interactivity (useState, useEffect,
   handlers, browser APIs).
5. Server Components can render Client Components but NOT vice versa
   (Client can render Server only as children prop, not import).
6. Composition pattern: keep state at the leaf, fetch at the trunk.
7. The streaming model — Server Components stream to client as they
   resolve.
8. Suspense boundaries for streaming.
9. The "you're really sending TWO trees: Server tree and Client tree"
   mental model.
10. Server Actions — `async function` marked `"use server"`, can be
    called from Client Components.
11. Data fetching at the Server Component level (fetch, ORM call) is
    just await.
12. The fetch caching layer in Next.js (revalidate, no-store, tags).
13. Cache invalidation with revalidatePath / revalidateTag.
14. Cookies and headers in Server Components (cookies(), headers()).
15. Reading params and searchParams in Server Components.
16. The dynamic = "force-dynamic" / "force-static" / "auto" options.
17. The runtime = "edge" / "nodejs" choice.
18. Middleware.ts — runs on every request before Server Components.
19. Server Actions for mutations: useActionState, useFormStatus, useOptimistic.
20. The "no client-side fetching for initial data, no spinner, no
    waterfall" payoff.
21. Common mistakes: putting "use client" too high in the tree; mixing
    server and client state inappropriately; trying to use browser APIs
    in Server Components.
22. The relationship to traditional SSR — RSC is the new model;
    getServerSideProps is gone.

### L44 · The Next.js cache layers · DEEP · ~70 min
Subtopics: the four caches (Request Memoization, Data Cache, Full Route
Cache, Router Cache); the fetch() caching default and the
cache: 'force-cache' / 'no-store' opt-out; revalidate: N for time-based;
tags for revalidatePath/revalidateTag; the build-time vs request-time
vs background-revalidation modes; "dynamic functions" that force dynamic
rendering (cookies(), headers(), searchParams).

### L45 · API routes and Route Handlers · STANDARD · ~50 min
Subtopics: route.ts files with GET, POST, etc. exports; Request and
Response native objects; reading body; cookies(), headers(); when to
use Route Handlers vs Server Actions (Actions for forms/mutations,
Routes for public APIs, webhooks, OAuth callbacks).

### L46 · Configuration — next.config.js, env, runtime · STANDARD · ~50 min
Subtopics: the next.config.js shape; output: 'standalone' for Docker;
images config (remotePatterns); rewrites, redirects, headers; the
public vs server-only env vars (NEXT_PUBLIC_*); the runtime field in
route segment config; the Vercel-specific edge.

### L47 · Middleware · STANDARD · ~40 min
Subtopics: middleware.ts runs on every matching request; the matcher
config to limit scope; rewrites, redirects, responses; the Edge runtime
limits (no Node APIs); common uses: auth gating, A/B testing, geographic
routing, country/language redirect, header injection.

### L48 · Images, fonts, and metadata · STANDARD · ~50 min
Subtopics: next/image (lazy, responsive, optimized); next/font (preloaded,
self-hosted, no FOUT); metadata API (static and generateMetadata);
Open Graph and Twitter Card tags; favicon and icons.

### L49 · Deploying Next.js · STANDARD · ~40 min
Subtopics: Vercel (the default, zero config); standalone Docker
(self-host); the Cloudflare Pages / Workers path; the build output and
what it contains; ISR (Incremental Static Regeneration) on platforms
that support it.

---

## Module 6.7 — Alternative frameworks (awareness)

### L50 · Remix / React Router v7 · STANDARD · ~50 min
Subtopics: the loader/action pattern; nested routes with parallel data;
the "use the platform" philosophy; the merging with React Router v7 in
2024; when Remix fits (data-heavy, form-heavy apps with strong web
fundamentals).

### L51 · Astro · STANDARD · ~40 min
Subtopics: islands architecture; zero JS by default; framework-agnostic
(use React, Vue, Svelte, Solid components inside); fits for content-heavy
sites (docs, marketing, blogs); the partial hydration model.

### L52 · SvelteKit, SolidStart, Qwik · LIGHT · ~40 min
The "what else exists" tour. Svelte's simpler component model. Solid's
React-like API but with fine-grained reactivity. Qwik's resumability for
zero-hydration. Worth recognizing in PRs.

### L53 · React Native and cross-platform · STANDARD · ~40 min
For SaaS that needs mobile; Expo as the modern path; the platform-API
shape; when to choose RN vs native vs web-only.

---

## Module 6.8 — Frontend production concerns

### L54 · Performance — Core Web Vitals · DEEP · ~80 min
Subtopics: LCP (Largest Contentful Paint, target <2.5s); INP
(Interaction to Next Paint, replaced FID in 2024, target <200ms); CLS
(Cumulative Layout Shift, target <0.1); the Chrome User Experience
Report (CrUX); how to measure (Lighthouse, PageSpeed Insights,
WebPageTest, real-user monitoring via web-vitals lib); common LCP
culprits (slow server response, render-blocking resources, slow images,
fonts); INP fixes (yield to main thread, debounce, useTransition); CLS
fixes (reserve space for dynamic content, set image dimensions, avoid
late-loading content above the fold).

### L55 · Bundle size and code splitting · DEEP · ~60 min
Subtopics: tree shaking (ESM, sideEffects: false); dynamic import for
on-demand modules; React.lazy + Suspense for component-level splitting;
route-level splitting in Next.js (automatic); the "every dependency
matters" awareness; bundle analyzers (webpack-bundle-analyzer,
@next/bundle-analyzer); the next/dynamic API for SSR-aware lazy
loading; the 30-100kb-of-JS-before-interactive budget.

### L56 · Loading states, skeletons, optimistic UI · STANDARD · ~50 min
Subtopics: the skeleton screen pattern; loading.tsx in Next.js;
suspense boundaries placed thoughtfully; optimistic mutations in
TanStack Query and useOptimistic; the "perceived performance > actual"
principle.

### L57 · Browser DevTools deep · DEEP · ~70 min
Subtopics: Elements panel (DOM, CSS, computed styles, accessibility);
Console (and useful tricks like console.table, console.group, %c styling);
Sources (breakpoints, conditional breakpoints, logpoints, blackboxing);
Network (waterfall, headers, response preview, throttling); Performance
(flamegraph, main thread bottlenecks); Memory (heap snapshots, allocation
profiling); Application (cookies, local/session storage, IndexedDB,
service workers, manifest); Lighthouse / Performance Insights / Recorder
panels; Coverage; React DevTools (Components, Profiler).

### L58 · Accessibility audit · DEEP · ~60 min
Subtopics: aXe DevTools extension; Lighthouse accessibility section;
manual keyboard tests; manual screen-reader tests (VoiceOver on Mac);
the WCAG 2.2 AA checklist; color contrast checkers; reduced motion;
focus management in modals; the "you must FIRST hand-test, automated
audits catch ~30%."

### L59 · Frontend security · DEEP · ~60 min
Subtopics: XSS (Cross-Site Scripting) — the #1 frontend threat;
React's default escaping (and dangerouslySetInnerHTML as the explicit
opt-out); CSP (Content Security Policy) headers — strict-dynamic with
nonces is the modern best; the "secrets never in the bundle" rule
(NEXT_PUBLIC_ leaks); CORS recap; cookies (HttpOnly, Secure, SameSite);
storage (don't put tokens in localStorage); clickjacking and X-Frame-
Options / frame-ancestors; the "always use HTTPS" reality.

### L60 · Internationalization and theming · STANDARD · ~50 min
Subtopics: i18n libraries (next-intl, react-i18next); message extraction;
pluralization rules (ICU MessageFormat); locale routing; RTL support
(dir="rtl", logical CSS properties); date/number formatting (Intl APIs);
theming with CSS variables; dark mode (prefers-color-scheme + override);
the "design tokens" approach.

---

## Phase 6 cross-thread coverage

- **Testing:** Vitest + Testing Library + Playwright. Tests should
  reflect user behavior, not implementation.
- **Debugging:** browser DevTools deep (L57); React DevTools; redux
  DevTools when applicable; sourcemap-aware production debugging.
- **Performance:** the dominant theme in M6.8 (Core Web Vitals, bundle).
- **Security:** XSS prevention (R6.8); CSP; secure cookies; token
  storage rules.
- **AI-integration:** streaming AI responses (useChat-style hooks,
  Vercel AI SDK); optimistic UI for chat; rich-text editors
  (Tiptap, Lexical) for AI inputs; markdown rendering for AI outputs;
  abort/regenerate patterns.

---

## What Phase 6 doesn't cover (deferred)

- The backend the frontend calls — Phase 5.
- Deployment specifics — Phase 7.
- Design systems and visual design as a discipline — orthogonal; if
  needed, recommend *Refactoring UI* + Tailwind UI / shadcn.
