# Phase 2 — Python

**Essence:** Python is your first real language and the dominant language
of the AI era. By the end of Phase 2, the student reads any Python file
fluently, writes idiomatic Python without copy-paste, and knows the
ecosystem well enough to evaluate library choices an agent makes.

**Gate:** read any Python file an agent produces and (a) predict what it
prints, (b) spot at least the five most common Python anti-patterns,
(c) refactor a small function into idiomatic form, (d) write a 100-line
script from scratch (CLI + HTTP call + JSON output) without help.

**Prerequisites:** Phases 0 and 1.

**Restructuring note:** the original 264-lesson scaffold had 27 lessons
across 3 modules. **That is too few.** Python is large; the language alone
deserves 15+ lessons, the data structures another 10+, OOP another 8+,
real-world ecosystem another 10+. This document expands Phase 2 to 8
modules and ~55 lessons. The platform code currently has lessons 38-64;
when this phase is rewritten, lessons will be renumbered. For now the
lessons here use logical names (P2-M1-Lx) rather than global numbers.

**Primary references**
- *Fluent Python*, 2nd ed. (Luciano Ramalho) — the deepest single Python
  book. Required reading.
- *Python Cookbook*, 3rd ed. (Beazley & Jones) — pattern catalog.
- *Effective Python*, 2nd ed. (Brett Slatkin) — 90 specific items, like
  *Effective Java*. Each is a small lesson.
- *Python in a Nutshell*, 4th ed. (Martelli et al.) — reference grade.
- *Robust Python* (Patrick Viafore) — types, contracts, design.
- *Python Distilled* (Beazley) — terse but excellent.
- *Architecture Patterns with Python* (Percival & Gregory) — DDD + Python.
- Real Python (realpython.com) — best free Python content on the internet.
  Per-topic deep articles.
- Python official docs — exemplary. The "What's New in Python 3.X" pages
  are an underrated way to track the language evolution.
- PEP catalog — the "language specs" of Python. PEP 8 (style), PEP 20
  (Zen), PEP 257 (docstrings), PEP 484 / 526 / 544 (typing), PEP 8 / 257
  (formatting), PEP 0 (index).
- talkpython.fm and pythonbytes.fm podcasts — for ecosystem awareness.
- David Beazley's PyCon talks — especially "Modules and Packages: Live and
  Let Die" and "Generators: The Final Frontier."

**Cross-phase threads touched here**
- **Testing:** real coverage starts in Module 2.8 (pytest deep dive).
  Earlier modules write code that will be tested in that module.
- **Debugging:** pdb / breakpoint() introduced in M2.4 (errors and
  exceptions). Logging in M2.6.
- **Performance:** introduced in M2.2 (data-structure complexity),
  M2.4 (comprehensions vs loops), M2.5 (subprocess vs in-process).
- **Security:** pickle warnings (M2.5), shell-injection in subprocess
  (M2.6), eval/exec dangers (mentioned wherever they tempt).
- **AI-integration:** Module 2.7 introduces NumPy/Pandas. M2.6 (HTTP)
  is where the OpenAI / Anthropic / Replicate SDKs all live.

---

## Module 2.1 — Language fundamentals

Goal: variables, types, control flow, functions, errors. After this module,
the student can write a small Python script confidently.

### L38 · Why Python · STANDARD · ~45 min
Subtopics: history; the five domains (AI/ML, scripts, data, web backends,
DevOps); where Python loses (browser, mobile, perf-critical); Python 2 vs 3
(use 3, always); current version (3.13 at writing) and what each minor adds;
CPython vs PyPy vs Pyodide vs MicroPython; PyPy as the JIT alternative;
Pyodide (browser); MicroPython on microcontrollers; the Zen of Python (PEP 20);
the structure of a `.py` file; the interpreter `python` command; the REPL;
`python -c`; `python -m` for module execution; the shebang line;
`if __name__ == "__main__":` guard.

Branches: language version managers — pyenv, asdf, uv. When each fits.
Distributions — anaconda/miniconda for data science (heavyweight but pre-bundled);
plain CPython for everything else.

Anti-patterns: Python 2 code from old tutorials; mixing 2 and 3 syntax;
installing system-wide instead of a venv.

References: docs.python.org/3/tutorial; "The History of Python" blog (Guido);
*Fluent Python* preface.

### L39 · Variables, identifiers, the dynamic type system · DEEP · ~80 min
Subtopics: assignment as name-to-value binding (not box-and-value); names
have no type, values do; identifier rules; PEP 8 naming (snake_case for
vars/funcs, PascalCase for classes, UPPER_CASE for constants, _leading
for internal, __dunder__ for protocols); reserved words; the four primitive
types (int, float, str, bool) and None; type() vs isinstance(); type
conversion (constructors): int(), float(), str(), bool(); the conversion
failure modes (ValueError vs TypeError); identity vs equality (is vs ==);
the small-int cache (-5..256 are interned, so `is` may "work" misleadingly);
sys.intern() for string interning; mutability catalog (immutable: int,
float, str, tuple, bool, frozenset; mutable: list, dict, set, custom
objects); reference semantics — the `a = []; b = a; b.append(1)` story;
shallow vs deep copy (copy module).

Subtopics expanded by importance:
- **Truthiness** (full section): __bool__, __len__ fallback, the falsy
  catalog (False, None, 0, 0.0, 0j, "", [], (), {}, set(), range(0), and
  any user object whose __bool__ returns False).
- **None handling**: is None vs == None; None as the conventional sentinel;
  Optional[T] type hints; the "not None" check pattern.
- **bool as int**: True == 1, False == 0, True + True == 2 — and the trap
  where isinstance(True, int) is True.

References: *Fluent Python* ch. 1-2; PEP 8; Real Python "Variables in Python."

### L40 · Numeric types deep · DEEP · ~70 min
Subtopics: **int** as arbitrary-precision (no overflow); bases: 0x for hex,
0b for binary, 0o for octal; numeric separators (1_000_000); **float** as
IEEE 754 double; the catastrophic 0.1 + 0.2 lesson; special values: inf,
-inf, nan (and nan != nan); math.isclose, math.isnan, math.isinf; sys.float_info;
**Decimal** (decimal module) for exact decimal arithmetic — when (money,
currency, tax, anything you'd see in a CFO's spreadsheet); Decimal precision
and contexts (getcontext, localcontext); **Fraction** (fractions module) for
exact rational arithmetic; **complex** numbers as built-ins; bit operations
on ints (&, |, ^, ~, <<, >>); ord() and chr() as int↔char bridges.

Branches: float vs Decimal vs Fraction decision tree; numpy.float32 / float64
when numpy enters; arbitrary precision int vs C-style fixed-width if you
ever interop with binary protocols (struct module).

Anti-patterns: float for money; comparing floats with ==; not handling nan
in computations from external data.

References: docs.python.org/3/library/decimal.html; "What every computer
scientist should know about floating-point arithmetic" (Goldberg).

### L41 · Strings, deep · VERY-DEEP · ~150 min (split into two sessions)
Subtopics (~45) — this is one of the most-used types in any program:
1. Strings are immutable, sequences of Unicode codepoints.
2. Quoting: single, double, triple-quoted (multi-line); raw strings (r""),
   byte strings (b""), formatted strings (f"").
3. Escape sequences (\n, \t, \r, \xHH, \uHHHH, \N{NAME}, \', \\).
4. Raw strings (r"…") — when (regex, Windows paths).
5. **f-strings deep** — interpolation, format-spec mini-language, =-debug
   syntax (Python 3.8+: f"{x=}"), conversion flags (!r, !s, !a), nested
   format specs, padding, alignment, precision.
6. str.format() — the older method, still seen.
7. % formatting — the oldest, mostly avoided but appears in C-derived code.
8. format spec mini-language: `{value:0>10.2f}` and what each piece means.
9. String methods catalog: upper, lower, swapcase, title, casefold (the
   correct case-insensitive comparison); strip / rstrip / lstrip; replace;
   split / rsplit / splitlines (newline-aware); partition / rpartition;
   join; startswith / endswith (with tuple of options); find / rfind /
   index / rindex; count; center / ljust / rjust; zfill; expandtabs;
   translate / maketrans; encode / decode; format; format_map; isdigit /
   isnumeric / isdecimal (and their differences!), isalpha, isalnum, isspace,
   isupper, islower, isidentifier, isprintable.
10. Indexing and negative indexing.
11. Slicing: [start:stop:step]; the reverse trick s[::-1].
12. The `in` operator (substring test) and `not in`.
13. Concatenation cost — strings are immutable, so a += b in a loop is
    O(n²); use ''.join() for O(n).
14. f-strings are the fastest formatter in modern Python.
15. Repr vs str: __repr__ vs __str__; when each is called; format(x, '!r')
    forces repr.
16. **bytes vs str** — a separate, critical topic.
17. Encoding: UTF-8 (default), UTF-16, latin-1, ascii. The "decode and
    encode" mental model.
18. Common encoding errors: UnicodeDecodeError on bytes that aren't valid
    UTF-8; using `errors=` ('strict', 'ignore', 'replace') for resilience.
19. Unicode normalization (unicodedata.normalize): NFC, NFD, NFKC, NFKD —
    when text comparisons fail across copy-paste sources.
20. Case-insensitive comparison: str.casefold(), not lower() (Turkish ı/İ
    edge cases).
21. Locale-aware sorting (rare in modern code, but mention).
22. String comparison is lexicographic by codepoint.
23. Memory representation in CPython (PEP 393 — 1/2/4 byte storage based on
    max codepoint). Knowing this exists is enough.
24. Triple-quoted strings as docstrings (PEP 257).
25. textwrap module — wrap/dedent/indent.
26. string module — string.ascii_letters, string.digits, string.punctuation,
    string.Template.
27. f-string limitations: no backslash inside the expression part (until 3.12);
    no `#` (comments) inside.

Practice: build a small CSV-line parser by hand using only str methods,
then compare to the csv module. Pattern: write the same string operation
three ways (loop, comprehension, builtin), benchmark.

Anti-patterns: building strings with `+=` in a loop; using `lower()` for
i18n-safe comparison (use casefold); comparing strings with `is` ("a" is "a"
might be True due to interning but DOES NOT make `is` a substitute for `==`).

References: *Fluent Python* ch. 4 (text vs bytes); Joel Spolsky's "The
Absolute Minimum Every Software Developer Absolutely, Positively Must Know
About Unicode And Character Sets"; PEP 393 (string internals); PEP 498
(f-strings).

### L42 · Bytes vs str — the encoding boundary · DEEP · ~60 min
Subtopics: bytes as immutable sequence of 0-255 ints; bytearray as the
mutable cousin; b"…" literal syntax; bytes from int sequences;
str.encode() → bytes; bytes.decode() → str; UTF-8 as the de-facto standard;
when bytes show up (file I/O in binary mode, network sockets, hashlib,
crypto, protobuf, msgpack); the "always decode at the boundary, work in
str inside" rule; common mistakes: mixing bytes and str, treating bytes
slices as characters (multi-byte UTF-8 → broken).

Anti-patterns: opening a binary file in text mode and getting
UnicodeDecodeError; manually building bytes from strings without
specifying encoding; "magic" encoding detection (use `chardet` only as
last resort).

References: PEP 3137; *Fluent Python* ch. 4.

### L43 · Operators and expressions · DEEP · ~75 min
Subtopics (covered in shipped lesson 40, expand here): the five families
(arithmetic, comparison, boolean, assignment, membership/identity);
operator precedence (full table — keep paren-rule in mind); chained
comparisons (1 < x < 10 → multiple comparisons, single x eval); the
walrus operator (:=) and its few sane uses; the matrix multiplication
operator (@) — exists for numpy; conditional expression
(`a if cond else b`); the ternary's readability rules; short-circuit
evaluation of and/or — and the value-returning behavior; bitwise operators
on ints; augmented assignment (+=, -=, …) and the mutability surprise
(`a += [x]` on a list mutates; `a = a + [x]` rebinds).

### L44 · if/else, ternary, match/case · DEEP · ~70 min
Subtopics: if/elif/else; the conditional expression (`x if y else z`);
truthiness drives the condition; **match/case** (PEP 634, Python 3.10+) —
structural pattern matching. NOT a switch statement, but a destructuring
matcher. Patterns: literal, capture, wildcard `_`, sequence
`[1, *rest]`, mapping `{"k": v}`, class `Point(x=0, y=y)`,
or-pattern `1 | 2 | 3`, guard `case x if x > 0`; when to use match vs
if/elif (rule of thumb: many type-shaped branches → match;
few simple-value branches → if/elif); the "exhaustiveness" issue —
match doesn't enforce it, prefer Enums; case Foo() with no fields vs
case Foo(x=_); the gotcha: dotted names are matched (class), bare names
are captured (variable).

Branches: match/case in 3.10+ vs dictionary dispatch in 3.9 and earlier.

Anti-patterns: nested ternaries (refactor to if/else); match used as a
plain switch (use a dict).

References: PEP 634 / 635 / 636 (pattern matching); Real Python's
match/case tutorial.

### L45 · Loops, iterators, and the iteration protocol · DEEP · ~90 min
Subtopics (~28):
1. `for x in iterable:` is THE Python loop.
2. iterables vs iterators: __iter__ returns an iterator; __next__ returns
   the next value or raises StopIteration.
3. range objects (lazy, not lists).
4. enumerate(iterable, start=0).
5. zip(iterable_a, iterable_b, …, strict=False); strict=True (3.10+) raises
   on length mismatch — much better than silent truncation.
6. reversed(seq).
7. sorted() returns a new list; list.sort() in place; key= function;
   reverse=True; stable sort.
8. itertools highlights: count, cycle, repeat, chain, islice, takewhile,
   dropwhile, groupby (requires sorted input), product, permutations,
   combinations, accumulate, pairwise (3.10+).
9. while loops — when to prefer over for.
10. else clause on for/while — runs if the loop exited normally (no break);
    a Python-unique feature, useful for search patterns ("did we find X?").
11. break, continue.
12. Iterator unpacking (a, b, *rest = iterable).
13. Iterating a dict iterates keys; .items() for (k, v); .values() for values.
14. Iterating a string yields characters (single-char strings).
15. The "don't mutate while iterating" rule, with examples of the failure
    mode (RuntimeError: dictionary changed size during iteration).
16. Iterating + filtering: filter() vs comprehension (the latter is more
    Pythonic).
17. Iterating + mapping: map() vs comprehension (again, comprehension).
18. Lazy vs eager iteration — when materialization matters (memory).
19. Infinite iterators (itertools.count) — useful with islice.
20. Custom iteration: write __iter__ and __next__ for a class.
21. Generators (yield) preview — full coverage in M2.4.
22. The async iteration protocol (async for) — preview.
23. Iterating files: `for line in open(...)` (idiomatic, lazy).
24. Iterating large CSVs / JSON Lines with iterators (memory-conscious).
25. The walrus pattern in iteration: `while chunk := f.read(8192):`.
26. Iter unpacking gotchas: `a, b = iterable` requires exactly 2.
27. yield from for delegating generators.
28. Common patterns: parallel-iter with zip; running sum with accumulate;
    sliding window with pairwise + islice.

Anti-patterns: range(len(x)) when enumerate(x) works; mutating during
iteration; nested loops where a comprehension or itertools.product reads
better.

References: *Fluent Python* ch. 17 (iterators, generators, classic
coroutines) — required reading; PEP 234 (iterator protocol); itertools
docs (the recipes section at the bottom is gold).

### L46 · Comprehensions — the Pythonic loop · DEEP · ~70 min
Subtopics: list comprehensions; set comprehensions; dict comprehensions;
generator expressions; the syntax: `[expr for x in it if cond]`; nested
comprehensions vs nested loops — readability cliff (rule of thumb: if you
can't read it aloud as English, it's too nested); when comprehension beats
loop (most cases) and when not (side effects, complex logic); generator
expressions for memory-conscious work; the difference: gen-exp inside
function call doesn't need outer parens (sum(x*x for x in nums));
chained conditions; multiple `for` clauses — Cartesian product order;
walrus inside comprehension (3.8+); the performance reason (CPython
optimizes comprehensions over equivalent for-loops).

Anti-patterns: comprehension with side effects (use loop); deeply nested
comprehensions (refactor); comprehensions used for their side-effects
only and the result thrown away (use a for loop).

References: PEP 202 (list comps); PEP 274 (dict comps); *Fluent Python* ch. 17.

### L47 · Functions deep · VERY-DEEP · ~120 min
Subtopics (~30):
1. def syntax; the function object.
2. Parameters vs arguments distinction.
3. Positional, keyword, default-valued parameters.
4. `*args` and `**kwargs` — capture remaining positional / keyword.
5. **Positional-only** parameters (the / separator, 3.8+).
6. **Keyword-only** parameters (after a * or *args, 3.0+).
7. **The mutable default argument trap** (one of Python's top-3 famous gotchas).
8. Annotations / type hints on parameters and return.
9. Docstrings (PEP 257) and conventions (Google, NumPy, reST styles).
10. The function's __doc__, __name__, __qualname__, __module__, __annotations__.
11. First-class functions: assign to vars, pass as args, return from funcs.
12. Closures: nested function captures enclosing names.
13. `nonlocal` keyword to rebind enclosing names.
14. `global` keyword (avoid in general).
15. lambda expressions — when justified (one-liners passed as arguments);
    when not (anything with logic).
16. Higher-order functions: map, filter, sorted with key=, functools.reduce.
17. functools.partial — fixing some args.
18. functools.cache / lru_cache — memoization.
19. functools.singledispatch — type-based dispatch.
20. functools.wraps — preserve metadata when writing decorators.
21. Decorators preview (deep in M2.4): `@decorator` is sugar for
    `f = decorator(f)`.
22. Type hints in depth: typing.Callable, typing.Any, Optional,
    Union, Literal, TypeVar, Generic, Protocol, NewType, TypedDict; the
    `from __future__ import annotations` and PEP 563 lazy evaluation.
23. typing.overload for declaring multiple signatures.
24. PEP 484 / 526 / 544 / 612 / 646 / 695 — type system evolution.
25. Calling conventions: positional, keyword, mixed; PEP 3102 keyword-only.
26. Return-tuple-and-unpack pattern.
27. Recursion (and its limits: sys.getrecursionlimit, ~1000 default; tail
    calls not optimized).
28. Generators with yield as alternative to recursive accumulation.
29. Generator return value (PEP 380) — captured in StopIteration.value.
30. Async functions preview (async def — full in Phase 5).

Anti-patterns: mutable default; functions with 8 positional params (use
keyword-only or a dataclass); modifying inputs unintentionally; reaching
for global; lambdas for anything that can't fit comfortably on a line.

References: *Fluent Python* ch. 7-8-9; PEP 0 search "callable"; "Mastering
typing" (Real Python series).

### L48 · Errors and exceptions · DEEP · ~75 min
Subtopics: exception class hierarchy (BaseException → Exception → …);
the catalog: TypeError, ValueError, KeyError, IndexError, AttributeError,
ZeroDivisionError, FileNotFoundError, PermissionError, ConnectionError,
TimeoutError, KeyboardInterrupt, SystemExit, StopIteration, RecursionError;
raise; re-raise (`raise` alone in an except block preserves the trace);
raise from (chaining); custom exceptions (subclass Exception);
try/except/else/finally semantics; multiple except clauses; tuple of types
in except `(A, B)`; the `as e` capture; except-without-type (bare except —
avoid); ExceptionGroup (3.11+) for concurrent exceptions; reading a
traceback bottom-up; suppressing exceptions with contextlib.suppress;
when to catch vs let propagate; the "fail fast" principle vs "graceful
degradation" — context-dependent; logging vs raising; the assert statement
(removed at -O optimization, so DON'T use for runtime checks); the
`__cause__` and `__context__` attributes.

Patterns:
- Look-before-you-leap (LBYL) vs ask-forgiveness-not-permission (EAFP) —
  Python idiom favors EAFP for performance and race-condition reasons.
- Retry with backoff (tenacity library or hand-rolled).
- Cleanup with finally vs context managers (with statement preferred).

Anti-patterns: bare except; `except Exception: pass`; catching and
ignoring; catching too broadly when a specific exception would do;
print-then-raise (lose info); using exceptions for normal control flow (slow).

References: docs.python.org/3/tutorial/errors; *Fluent Python* ch. 20;
"Errors should never pass silently" (PEP 20).

### L49 · Modules, packages, and imports · DEEP · ~80 min
Subtopics: a module is a .py file; importing creates a module object;
import vs from import; aliasing (import X as Y); the `__init__.py` —
turning a directory into a package; namespace packages (no __init__.py,
3.3+); absolute vs relative imports (`from . import x`); the import
search order (built-ins → frozen modules → sys.path); sys.path and how
it's built (script dir, PYTHONPATH, site-packages); PYTHONPATH env var;
the install-as-package vs run-as-script distinction; circular imports —
why they happen and three ways to fix; lazy imports (import inside a
function); conditional imports (try/except ImportError for optional deps);
__all__ to declare public API; reload (importlib.reload) — usually a sign
of trouble; the import system internals (importers, loaders) — just-know;
PYTHONDONTWRITEBYTECODE; PYTHONHASHSEED; the difference between running
a file directly vs `python -m package.module` (the latter sets up the
package context correctly); the `if __name__ == "__main__"` idiom and what
it enables; `__main__.py` for "python -m mypackage" entry point.

Anti-patterns: circular imports (refactor; don't workaround with
imports-inside-functions unless necessary); wildcard imports (`from x import *`)
in application code; mutating sys.path at runtime.

References: docs.python.org/3/tutorial/modules; "Modules and Packages: Live
and Let Die" (Beazley PyCon talk); PEP 328 (relative imports), PEP 420
(namespace packages).

### L50 · File I/O — text and binary, with statement intro · STANDARD · ~50 min
Subtopics: open() function; modes ('r', 'w', 'a', 'rb', 'wb', 'r+'); text
mode vs binary mode (encoding param matters!); the with statement (proper
resource management); read() vs read(n) vs readline() vs readlines() vs
iterating; write() vs writelines(); seek/tell for random access; pathlib's
read_text / read_bytes / write_text / write_bytes (cleaner for one-shot
ops); reading line-by-line is lazy by default (memory friendly); newline
handling (universal newlines, \r\n / \n); encoding pitfalls (default is
platform-dependent — always specify encoding='utf-8' explicitly); tempfile
module for safe temp files; shutil for copy/move/rmtree.

Anti-patterns: open without `with`; not specifying encoding; reading huge
files into memory.

References: docs.python.org/3/tutorial/inputoutput; pathlib docs.

---

## Module 2.2 — Data structures

Goal: master Python's built-in collections and the collections-module
extensions. Choose the right structure for each problem.

### L51 · Lists — the workhorse · DEEP · ~80 min
Subtopics: list literal syntax; list constructor; mutable, ordered, allows
duplicates, allows mixed types; indexing (positive and negative); slicing
([start:stop:step] including all-omitted forms); slice assignment
(`l[1:3] = [...]`); list methods: append, extend, insert, remove, pop, clear,
index, count, sort, reverse, copy; `del l[1]` vs `l.remove(x)` vs `l.pop(1)`;
the unpacking: `a, *rest = l`; concatenation with + (creates new) vs extend
(in place); repetition with `*` (and the shared-reference trap with
`[[]] * 3`); membership test cost (O(n)); list as a stack (append/pop) vs
queue (use deque instead — appendleft/pop on list is O(n)); slicing copies
shallowly; list comprehensions revisited; performance: insertion at end is
amortized O(1), insertion at front is O(n) (use deque); sorting cost
(O(n log n)); custom sort with key=; in-place sort vs sorted(); stability of
sort; numerical sort gotcha (mixed types).

Anti-patterns: insert(0, x) in a loop (use deque); l = l + [x] in a loop
when l.append(x) would do.

References: *Fluent Python* ch. 2; CPython's listobject.c (for the
curious — beautifully commented).

### L52 · Tuples and named tuples · STANDARD · ~50 min
Subtopics: tuple literal (commas, not parens — `(1,)` vs `(1)`); immutable,
ordered, allows duplicates; tuple unpacking (a, b = (1, 2)); * for rest;
swapping (a, b = b, a); tuple as record (heterogeneous data) vs tuple as
sequence (homogeneous); collections.namedtuple — adds named field access;
typing.NamedTuple (the class-syntax version); when to prefer dataclass over
namedtuple (almost always — dataclass is more flexible); tuples as dict keys
(hashable); the unpacking in for-loops (for k, v in items).

References: *Fluent Python* ch. 2 (tuples as records); collections.namedtuple
docs.

### L53 · Dicts — Python's most important data structure · DEEP · ~100 min
Subtopics: dict literal, dict() constructor, dict.fromkeys(); ordered since
3.7 (insertion order, guaranteed); operations: get with default,
setdefault, update, pop, popitem, clear, copy; in operator for keys; iter
yields keys; .keys(), .values(), .items() return views (live);
comprehension; dict merge with | (3.9+); dict update with |= (3.9+);
the | merge order semantics; **kwargs unpacking into dict; tuple keys for
composite keys; defaultdict (collections) for "default on missing";
Counter (collections) for frequency counts; OrderedDict (less needed
since 3.7 — still has move_to_end which dict lacks); ChainMap for layered
defaults; the dict comprehension; the {} ambiguity (set vs dict — empty {}
is dict, empty set() is empty set); TypedDict (typing module) for
type-hinted dicts; dict performance: O(1) average for get/set/del/in;
implementation note: hash table with open addressing; the iteration-during-
mutation rule; dict.fromkeys() with mutable default — same trap as list
default argument; sorted dict via sorted(d.items()); pretty printing
(pprint); JSON dumps with indent.

Patterns:
- "Build a counter": Counter(iterable).
- "Group by": defaultdict(list).
- "Reverse a mapping": {v: k for k, v in d.items()} (with collision
  awareness).
- "Merge with override": d1 | d2 (right wins).

Anti-patterns: KeyError instead of .get(default); mutating dict while
iterating; using a list-of-pairs when a dict would do; OrderedDict in 3.7+
(use dict).

References: *Fluent Python* ch. 3; "Modern dictionaries by Raymond Hettinger"
(PyCon talk); CPython dictobject.c.

### L54 · Sets and frozensets · STANDARD · ~50 min
Subtopics: set literal {1, 2, 3} (and empty set() — empty {} is dict);
mutable; unordered; unique elements; hashable elements only; operations:
add, discard, remove, pop, clear, update, intersection_update,
difference_update; set algebra: union | , intersection &, difference -,
symmetric_difference ^, issubset, issuperset; set comprehension;
deduplication idiom: list(set(items)); frozenset as the immutable cousin
(hashable, can be dict key); use cases: membership tests (O(1)),
deduplication, set algebra; ordering is NOT guaranteed; converting between
list/set/tuple; the iteration-during-mutation rule applies.

Anti-patterns: relying on set order; comparing sets with == for ordered
equality (== compares contents regardless of order, which is intended).

References: *Fluent Python* ch. 3.

### L55 · The iteration protocol and generators · DEEP · ~80 min
Subtopics: revisited from L45; **generators** in depth (yield, yield from);
the generator as a coroutine that yields and pauses; the generator return
type and StopIteration.value; generators as iterators (no need to write
__iter__); generator expressions (lazy); generators vs lists — memory
trade-off; sending values into generators (gen.send); throwing exceptions
(gen.throw); closing (gen.close); the "pipeline of generators" pattern;
yield from for delegation; subgenerators; the asynchronous generator (async
for / async yield) — preview; common patterns: lazy file processing, infinite
sequences, pipelined transformations.

Anti-patterns: building a list when you only iterate once (use generator);
"side-effecting" generators (yield should be functional).

References: PEP 255 (generators), PEP 380 (yield from), PEP 525 (async
generators); *Fluent Python* ch. 17.

### L56 · collections module deep · STANDARD · ~50 min
Subtopics: deque (double-ended queue; O(1) append/pop on both ends; maxlen
for ring buffer); Counter (most_common, arithmetic with other counters);
defaultdict (factory-driven default values); OrderedDict (move_to_end,
popitem(last=False)); ChainMap (layered lookups for config); UserDict /
UserList / UserString (subclassable wrappers for the curious).

References: collections module docs.

### L57 · itertools deep · STANDARD · ~60 min
Subtopics (the "highlight reel" — students should know these exist):
count, cycle, repeat; chain, chain.from_iterable; compress; dropwhile,
takewhile, filterfalse; groupby (requires sorted input — common gotcha);
islice; pairwise (3.10+); starmap; tee; zip_longest; product;
permutations; combinations; combinations_with_replacement; accumulate
(with func= for fold).

References: docs.python.org/3/library/itertools (the "recipes" at the end
are gold).

### L58 · functools deep · STANDARD · ~50 min
Subtopics: cache (3.9+) and lru_cache (older); cached_property; partial
and partialmethod; reduce (and when to prefer a loop or sum/max/min);
singledispatch / singledispatchmethod; wraps (essential when writing
decorators); cmp_to_key (legacy compatibility).

References: docs.python.org/3/library/functools.

---

## Module 2.3 — Object-oriented Python

Goal: write Python classes that fit the language. After this module
the student reads class-heavy code (Django ORM, SQLAlchemy, pydantic)
and understands what's happening.

### L59 · Classes and instances · DEEP · ~75 min
Subtopics: class definition syntax; the class as a factory; __init__ as
initializer (NOT constructor — __new__ is); self conventions; instance
attributes vs class attributes; class attribute mutation gotcha (shared
mutable state); method definition; access via instance.method() vs
Class.method(instance) — equivalent; type() and isinstance(); issubclass;
attribute lookup order (instance dict → class dict → MRO); setting/getting
attributes dynamically (getattr, setattr, hasattr, delattr); private-by-
convention (_leading underscore); name mangling (__double_leading);
__slots__ for memory efficiency in many-instance scenarios.

### L60 · Dunder methods (data model) · DEEP · ~90 min
Subtopics: the data model (Python's most distinctive feature); the catalog
of dunders worth knowing:
- __init__, __new__, __del__ (rare)
- __str__, __repr__ (and the rule: __repr__ is for developers, __str__ for
  users; fall back to __repr__ if no __str__)
- __eq__, __ne__, __hash__ (and the contract: a == b implies hash(a) == hash(b))
- __lt__, __le__, __gt__, __ge__ (and @functools.total_ordering)
- __bool__, __len__ (and the fallback rule)
- __iter__, __next__, __reversed__
- __contains__ (for `in` operator)
- __getitem__, __setitem__, __delitem__, __missing__ (for subscript ops)
- __call__ (makes instance callable)
- __enter__, __exit__ (context manager protocol)
- __aenter__, __aexit__ (async context manager)
- __getattr__, __getattribute__ (be careful — recursion lurks), __setattr__
- __add__, __sub__, __mul__, __matmul__, __truediv__, __floordiv__, __mod__,
  __pow__ (and reflected __radd__, etc.); __iadd__ etc. for in-place
- __format__ for f-string custom formatting
- __index__ for int-like conversion
- __copy__, __deepcopy__ for copy module support

The "make it act like a dict" / "make it act like a list" / "make it act
like a number" / "make it act like a function" patterns.

References: docs.python.org/3/reference/datamodel — read it; *Fluent Python*
ch. 1, 11-13; "Implementing the data model" articles.

### L61 · Inheritance, MRO, mixins · DEEP · ~70 min
Subtopics: subclass syntax; super() and how it resolves; multiple
inheritance; the C3 linearization (MRO) — what it is, why it exists, how
to read `Class.__mro__`; the diamond problem and how MRO solves it;
super() in cooperative multiple inheritance; mixins as small focused
subclasses providing behavior; the difference between "is-a" (inheritance)
and "has-a" (composition); when to prefer composition; abstract base
classes (abc.ABC, abc.abstractmethod); the "favor composition over
inheritance" principle; deep inheritance hierarchies — usually a smell.

References: *Fluent Python* ch. 14; "Python's super considered super!"
(Raymond Hettinger).

### L62 · Properties, methods, classmethods, staticmethods · STANDARD · ~50 min
Subtopics: @property — computed attributes; setter, deleter, getter
syntax; the property descriptor; @classmethod — bound to class, used for
alternate constructors (e.g., `Person.from_dict(...)`); @staticmethod —
just a function-in-a-namespace; method resolution: when is each called;
property vs method — choose based on whether the cost is constant-time
and access feels attribute-like.

### L63 · Dataclasses · DEEP · ~80 min
Subtopics: @dataclass — auto-generates __init__, __repr__, __eq__;
field(default_factory=list) for mutable defaults; frozen=True for
immutability; eq=False / order=True / unsafe_hash modifiers; slots=True
(3.10+) for slotted classes; the InitVar pattern; __post_init__; the
relationship to attrs (the original) and pydantic (validation + serialization);
dataclasses.asdict, dataclasses.astuple, dataclasses.replace; when
dataclass beats NamedTuple (mutation, defaults), and when NamedTuple is
better (truly immutable, tuple semantics); the typing.NamedTuple class
syntax is similar; pydantic v2 as the "validation on top of dataclass"
choice for I/O boundaries (API request/response, env config); marshmallow
as the older alternative; the explicit choice: dataclass for internal
records, pydantic at boundaries.

References: PEP 557; dataclasses docs; pydantic v2 docs; *Fluent Python*
ch. 5.

### L64 · Protocols and structural typing · DEEP · ~60 min
Subtopics: typing.Protocol — duck typing made explicit; isinstance() with
runtime_checkable; what a Protocol class looks like; the difference from
ABCs (ABC is nominal: you have to subclass; Protocol is structural:
just having the right methods); use cases — defining "file-like" or
"iterable of T" without forcing inheritance; the explicit vs implicit
typing schools.

References: PEP 544; *Robust Python* ch. on protocols.

### L65 · Enums · STANDARD · ~30 min
Subtopics: enum.Enum, IntEnum, StrEnum (3.11+), IntFlag, Flag; auto();
enum members are singletons; iteration order; comparison; aliasing;
when to use Enum over a string constant (forced exhaustiveness,
type-checker support); enum.unique decorator; combining flags with
bitwise ops.

References: enum module docs.

---

## Module 2.4 — Pythonic patterns and idioms

Goal: code that "looks Python" instead of "Python that looks like Java."

### L66 · Context managers (with statement) · DEEP · ~70 min
Subtopics: the with statement; the protocol (__enter__, __exit__);
common builtin context managers (open(), threading.Lock, decimal.localcontext);
contextlib module — contextmanager decorator (turn a generator into a
context manager), closing, suppress, redirect_stdout, ExitStack (manage
many resources), nullcontext; async context managers (async with);
the "acquire-release" pattern beyond files (DB transactions, locks,
timing, profiling).

References: PEP 343; *Fluent Python* ch. 18.

### L67 · Decorators · DEEP · ~90 min
Subtopics: the `@decorator` syntax as `f = decorator(f)`; functions are
first-class; common decorators (@property, @classmethod, @staticmethod,
@dataclass, @cached_property, @lru_cache); writing your own; preserving
metadata with functools.wraps; decorators with arguments (a function that
returns a decorator); class decorators (modifying a class); class-based
decorators (a class with __call__); stacked decorators (order matters,
bottom-up); descriptors as the deeper layer (preview); common applications:
logging, timing, caching, retry, authorization checks.

References: PEP 318; *Fluent Python* ch. 9.

### L68 · Closures and lexical scope · STANDARD · ~50 min
Subtopics: LEGB rule (Local, Enclosing, Global, Built-in); enclosing
scope captured by reference, not value (classic "loop variable in
closure" trap); nonlocal vs global; closures as state-bearing functions;
when to prefer a class over a closure (and vice versa).

References: *Fluent Python* ch. 9.

### L69 · Type hints — the type system properly · VERY-DEEP · ~150 min
Subtopics (~32):
1. PEP 484 introduced gradual typing.
2. Annotations syntax for variables, parameters, returns.
3. Built-ins as generics from 3.9+ (list[int], dict[str, int]).
4. typing module: Optional, Union (and the | syntax from 3.10+),
   Literal, Final, Annotated, ClassVar, TypeAlias.
5. None vs type(None); Optional[T] == Union[T, None] == T | None.
6. Callable[[Args...], Ret].
7. TypeVar and Generic — generic functions and classes.
8. Bound TypeVars (TypeVar("T", bound=Number)).
9. Constrained TypeVars (TypeVar("T", int, float)).
10. Protocols (structural typing) — covered in L64.
11. NewType for nominal-like types ("UserId" that's really an int but
    distinct).
12. TypedDict for dicts with known shape.
13. NamedTuple class syntax.
14. The dataclass + type hints partnership.
15. Self type (3.11+).
16. PEP 695 (3.12+) type-statement syntax: `type Vector = list[float]`.
17. ParamSpec, Concatenate (3.10+) for decorators that preserve sigs.
18. Variadic generics (3.11+ TypeVarTuple, Unpack).
19. overload — declaring multiple call signatures for one function.
20. Lazy annotations: `from __future__ import annotations` (everything as
    strings, evaluated lazily); the runtime cost; consequences for
    introspecting types at runtime.
21. mypy as the reference type checker; pyright (faster, used by Pylance);
    pyre; pytype.
22. Strict mode flags worth turning on (mypy --strict, then loosen).
23. The "any leaks" problem (Any silently undoes typing).
24. Reading mypy errors and gradually adding types.
25. Stubs (.pyi files) for typing third-party libraries that don't ship
    types.
26. typeshed and the community-maintained stub library.
27. Generic dataclasses (3.9+).
28. The relationship between type hints and runtime — hints are not
    enforced by Python (except annotations are accessible via
    __annotations__); runtime libs that DO enforce (pydantic, beartype).
29. When to add types (boundaries: I/O, public APIs) vs when to skip
    (small private functions; throwaway scripts).
30. cast() to inform the checker; reveal_type() to debug.
31. Performance: type hints have ~no runtime cost when string-form or with
    `from __future__ import annotations`; ~no cost on imports either with
    PEP 649 lazy eval (3.13+).
32. type() vs isinstance() — runtime behavior unaffected by hints.

Branches: typing styles — strict (everywhere) vs strategic (only at
boundaries) vs none. The trade-off between type-safety and dev speed.

References: PEP 484, 526, 544, 563, 591, 612, 695; the mypy documentation;
*Robust Python* (Viafore) — the type-system-in-anger book; *Effective Python*
items on typing.

### L70 · Generators and lazy evaluation (revisited) · STANDARD · ~50 min
Coverage extends L55 with: pipelines, the "everything is an iterator"
pattern, generator vs coroutine distinction, examples (lazy file
processing, infinite sequences, sliding windows).

### L71 · Asynchronous Python (preview) · STANDARD · ~60 min
Subtopics: the event loop concept; async def vs def; await keyword; asyncio
basics: asyncio.run, asyncio.gather, asyncio.wait, asyncio.sleep; coroutines
vs tasks; the "structured concurrency" idea (asyncio.TaskGroup, 3.11+);
when async helps (I/O-bound concurrency); when it doesn't (CPU-bound — use
multiprocessing or numpy/numba/native); async generators; async context
managers; common pitfalls (forgetting await; blocking calls inside coroutine
freeze the loop); httpx vs requests (sync vs async HTTP client). Full
coverage in Phase 5 (backend frameworks).

References: asyncio docs; *Python Concurrency with asyncio* (Fowler).

---

## Module 2.5 — The standard library that matters

Goal: a tour of the stdlib modules every Python user encounters within their
first year.

### L72 · os, sys, pathlib · STANDARD · ~60 min
Subtopics: os.path basics (mostly use pathlib in 2026); pathlib.Path
extensively — Path.cwd, Path.home, /, glob, rglob, read_text, write_text,
exists, is_file, is_dir, mkdir(parents=True), unlink, rename, stat, with_suffix,
with_name, relative_to, resolve, parent, name, stem, suffix, parts; sys.argv,
sys.path, sys.exit, sys.stdin/stdout/stderr; os.environ for env vars; the
"prefer pathlib over os.path" doctrine.

### L73 · datetime, zoneinfo · DEEP · ~70 min
Subtopics: naive vs aware datetimes; the timezone disaster of naive datetimes;
zoneinfo (3.9+) for IANA tz database access (replaces pytz); datetime.now()
vs datetime.now(timezone.utc) — always specify; UTC discipline for storage,
local time only for display; timedelta arithmetic; isoformat / fromisoformat;
strptime / strftime format codes; date vs datetime vs time; the
"datetime.utcnow() is deprecated in 3.12+" — use datetime.now(timezone.utc);
DST gotchas; Unix timestamps (timestamp(), fromtimestamp(tz=…)); rrule
(third-party dateutil) for recurring events; performance — datetime is
immutable.

References: docs.python.org/3/library/datetime; PEP 615 (zoneinfo); Real
Python's datetime guide.

### L74 · re — regular expressions · DEEP · ~120 min
Subtopics (~28):
1. What regex is and when to use (and when not — use parsers for nested
   things like HTML, JSON).
2. The basic metacharacters: . ^ $ * + ? { } [ ] \ | ( )
3. Character classes: \d \w \s and their negations.
4. Quantifiers: greedy by default; non-greedy with ?
5. Anchors: ^ start, $ end, \b word boundary.
6. Groups: capturing (), non-capturing (?:), named (?P<name>...).
7. Backreferences: \1 (in replacement and in pattern).
8. Alternation: |
9. Lookahead (?=...), negative lookahead (?!...), lookbehind (?<=...),
   negative lookbehind (?<!...).
10. The re module API: search, match, fullmatch, findall, finditer, sub,
    subn, split, compile.
11. Match object: group, groups, groupdict, start, end, span.
12. Compile flags: re.IGNORECASE, re.MULTILINE, re.DOTALL, re.VERBOSE,
    re.UNICODE.
13. Raw strings (r"") for patterns — essential.
14. re.VERBOSE for documenting complex patterns.
15. Replacement strings with backrefs and \g<name>.
16. Compiled patterns vs module-level functions (cached).
17. Catastrophic backtracking — the "regex DoS" pattern (nested quantifiers,
   alternation in a quantified group). When suspicious, use the `regex`
   third-party module with timeout, or rewrite as a parser.
18. Anchored vs unanchored patterns; the search-vs-match difference.
19. Common patterns: emails (and the "you'll never match all valid emails"
   reality — use a library), URLs, ISO dates, IP addresses, slugs.
20. Regex vs parsing: when a parser (PEG, EBNF, or hand-written) is right.
21. The "you can't parse HTML with regex" memetic warning — and when you
   actually can (well-defined subset).
22. Useful tools: regex101.com, Pythex; debuggers within the language.
23. The `regex` third-party module — POSIX, atomic groups, fuzzy matching.
24. Common gotchas: \w includes underscore; \d is unicode-aware by default;
   . doesn't match newline unless re.DOTALL.
25. Multiline matching with re.MULTILINE.
26. Splitting on regex with re.split.
27. Substitution with a function: re.sub(pattern, callable).
28. Performance: precompile if used in a hot loop; consider str methods
   first (str.find, str.startswith).

Anti-patterns: regex for everything; massive unreadable patterns without
re.VERBOSE; trying to parse JSON/HTML with regex.

References: docs.python.org/3/library/re; *Mastering Regular Expressions*
(Friedl); Real Python's regex series; regex101.com.

### L75 · json (and dataclass / pydantic) for serialization · DEEP · ~60 min
Subtopics: json.dumps and json.loads; ensure_ascii=False for proper UTF-8;
indent= for pretty output; default= for custom encoders; cls=
JSONEncoder; sort_keys; allow_nan and strict mode; the bidirectional
conversion gotchas: int → JSON number (str representation), datetime → no
direct support (custom encoder needed); decimal → str or float (decide
explicitly); reading JSON Lines (.jsonl); the orjson and ujson libraries
for speed; serializing dataclasses (asdict + json.dumps); the pydantic
v2 path — Model.model_dump_json, Model.model_validate_json, with full
validation; the "convert at the boundary" principle.

Anti-patterns: round-tripping floats through JSON for money (use Decimal +
str); not handling datetime; passing untrusted JSON to eval/exec
(NEVER).

References: json docs; pydantic docs; orjson README.

### L76 · csv, configparser, sqlite3 · STANDARD · ~50 min
Brief tour of three useful but specialty modules. csv: DictReader/DictWriter,
quoting, dialects, the "csv from Excel might be Windows-1252, not UTF-8"
trap; configparser for INI-style configs; sqlite3 for embedded DBs (and
the "always use parameter binding, never string-build SQL" rule).

### L77 · logging proper · DEEP · ~75 min
Subtopics: why logging beats print (levels, structured, routable);
hierarchy: loggers, handlers, formatters; the root logger and why
configuring it is touchy; getLogger(__name__) idiom; basicConfig pitfalls;
log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL); formatters and the
format string options; structured logging (structlog, python-json-logger,
loguru — opinionated); contextvars / loggers per request; correlation
IDs; logging exceptions with logger.exception (auto-includes traceback);
when to log at each level; production logging: JSON output to stdout,
parsed by the platform (Datadog, CloudWatch, Loki); log sampling for noisy
events; sensitive data redaction; the "DEBUG in dev, INFO in prod, ERROR
gets paged" rule of thumb.

Anti-patterns: print() in production code; logging secrets; over-logging
(every function entry); under-logging (silent failures); structured logs
that aren't actually structured (string concat instead of fields).

References: docs.python.org/3/howto/logging; structlog docs; *The Twelve-
Factor App* §XI; "Logging in Python: A practical primer."

### L78 · subprocess, signals, multiprocessing intro · STANDARD · ~60 min
Subtopics: subprocess.run vs subprocess.Popen; capturing output (capture_output=True);
text mode vs bytes; timeout; check=True for raise-on-failure; the SHELL
INJECTION rule (never pass user input as a shell command string; use list
args); shell=True considerations; environment passing; chaining processes
(use Python orchestration, not shell pipes); signals (signal module) for
graceful shutdown handlers; multiprocessing as the "real concurrency for
CPU-bound" answer (deep in Phase 5); concurrent.futures.ThreadPoolExecutor
and ProcessPoolExecutor.

### L79 · pickle (and why often not) · LIGHT · ~25 min
Subtopics: what pickle is; the security warning (NEVER load pickle from
untrusted source; arbitrary code execution by design); when pickle is OK
(internal cache, same-process snapshots); alternatives: JSON for
human-readable, msgpack for compact, protobuf for schemas, joblib for
sklearn artifacts.

### L80 · Other stdlib hits · LIGHT · ~40 min (catalog)
A catalog the student should be aware of: hashlib (sha256, sha512);
secrets (cryptographically secure randomness for tokens); uuid;
urllib.parse (URL building/parsing); base64; gzip / zipfile / tarfile;
io (StringIO, BytesIO for in-memory file-like); statistics (mean, median,
stdev, quantiles); math (sqrt, exp, log, pi, isclose); random vs secrets
(use random for games/simulations, secrets for security tokens);
argparse (CLIs).

---

## Module 2.6 — Real-world Python ecosystem

Goal: virtual environments, package management, HTTP, CLIs, scheduled jobs.

### L81 · Virtual environments · DEEP · ~60 min
Subtopics: the "site-packages global pollution" problem; venv (built-in,
3.3+); creating: `python -m venv .venv`; activating (source .venv/bin/
activate); deactivate; the prompt prefix convention; one venv per project;
.venv in .gitignore always; venv vs virtualenv vs conda vs poetry env vs
uv venv; the "you can also use Docker for isolation" alternative;
managing Python versions: pyenv, asdf, uv install, mise.

### L82 · Package management — pip, requirements, lockfiles, modern tools · DEEP · ~90 min
Subtopics: pip install / pip uninstall / pip list / pip show / pip
freeze; requirements.txt (the lowest common denominator); pip-tools
(pip-compile) for compiled lockfiles; pip-audit for vulnerability scanning;
**poetry** as the popular all-in-one (manages deps + venv + builds + publishes);
**uv** (Astral, 2024+) as the new fast standard; **pipenv** (older, less
favored now); requirements.txt vs pyproject.toml vs poetry.lock vs uv.lock
— what each does; PEP 621 / 631 for pyproject.toml standardization;
extras_require (`pip install pkg[dev]`); editable installs (`pip install -e .`);
installing from git; private PyPI / Artifactory / CodeArtifact; the
trade-offs: poetry's slow installs vs uv's blazing speed; cross-platform
lockfile considerations.

Anti-patterns: not pinning versions; mixing pip and poetry; manually
editing lockfiles.

References: pip docs; poetry docs; uv README and docs; PEP 517/518/621.

### L83 · Reading .env, settings, secrets · STANDARD · ~50 min
Subtopics: python-dotenv (the de-facto standard); load_dotenv() at app
start; the precedence (process env > .env > defaults); pydantic-settings
v2 — the modern way to typed-load env config with validation; the
"strict env vars, no defaults for security" pattern; multi-env layering
(.env, .env.local); cloud secret managers (AWS Secrets Manager, GCP
Secret Manager, HashiCorp Vault, Doppler) — accessed via SDKs; rotating
secrets without redeploy; the 12-factor #3 principle.

Anti-patterns: hardcoded secrets; secrets in source-controlled config files;
shipping .env in Docker images.

### L84 · HTTP — requests, httpx, sessions, timeouts, retries · DEEP · ~90 min
Subtopics (~22): requests library API — the most-used Python lib;
requests.get/post/put/patch/delete; params= for query string;
json= for JSON body; data= for form; headers=; cookies=; auth=
(BasicAuth, custom); response.status_code, response.json(),
response.text, response.headers, response.raise_for_status(); sessions
(connection pooling, default headers); timeouts (connect, read) — ALWAYS
specify, default is None (forever); retries with urllib3 Retry adapter;
proxies; verify=False (and DON'T in production); streaming responses
(stream=True, iter_content); file uploads (files=); request hooks;
**httpx as the modern alternative** — same API plus async, HTTP/2,
better defaults (timeouts on by default); when each fits: requests for
simple sync, httpx for async or HTTP/2; **aiohttp** for async-first
servers + clients; **urllib3** as the layer underneath; **niquests** as
a drop-in successor; production patterns: tenacity for retries with
backoff, rate limiting (slowapi / async-token-bucket), idempotency keys
for write retries.

Anti-patterns: no timeout (single hanging server takes down your app);
no retries on flaky downstreams; not closing sessions; sending secrets in
URL query strings (logged everywhere).

References: requests docs; httpx docs; aiohttp docs; tenacity README;
"Python HTTP libraries comparison" articles.

### L85 · Writing CLIs — argparse, click, typer · STANDARD · ~60 min
Subtopics: argparse (built-in, verbose); click (declarative decorators,
groups, options/arguments, types); typer (built on click, type-hint driven,
fastest to write); shells: bash/zsh completion generation; subcommands;
boolean flags; required vs optional; defaults; environment-var fallbacks;
file argument types; the "build a one-off internal tool" workflow.

References: argparse docs; click docs; typer docs.

### L86 · Scheduled jobs and background work · STANDARD · ~50 min
Subtopics: cron syntax refresher; running Python on cron; APScheduler
(in-process scheduler); RQ / Dramatiq / Celery as task queues (with
Redis/RabbitMQ); the "do it later" pattern; idempotency in workers;
retries and dead-letter queues; long-running vs scheduled jobs;
serverless schedulers (AWS EventBridge, Vercel Cron, GCP Cloud Scheduler);
Temporal / Inngest as the modern durable-execution alternatives.

### L87 · Async HTTP for AI workloads (preview) · STANDARD · ~40 min
Why async + HTTP matters for AI: every LLM call is hundreds of ms, and
production agent loops fire many in parallel. asyncio.gather pattern;
httpx.AsyncClient; rate limiting; concurrency limits (semaphore);
exponential backoff on 429 / 5xx.

---

## Module 2.7 — Python for data and AI

Goal: enough fluency in NumPy / Pandas / Jupyter to read most AI/ML code
an agent produces or that you encounter on GitHub.

### L88 · NumPy — the array model · DEEP · ~90 min
Subtopics: ndarray as the core; dtype (int32, float64, bool, object);
shape and ndim; vectorized operations (element-wise without Python loops);
broadcasting rules; indexing (basic, fancy, boolean masks); slicing creates
views, not copies (mutation lurks); reshape, transpose, ravel/flatten;
common constructors: zeros, ones, arange, linspace, eye, random; reductions
(sum, mean, std, max, min, argmax) with axis= argument; the "no Python
loop" performance principle; the "this is mostly C under the hood" reality;
gotchas: integer overflow on small int dtypes; nan propagation.

### L89 · Pandas — DataFrames · DEEP · ~90 min
Subtopics: DataFrame and Series; reading data (read_csv, read_parquet,
read_json, read_sql); inspecting (head, tail, info, describe, shape, dtypes);
selecting columns df['col'] vs df.col vs df[['a','b']]; selecting rows
.loc (label-based) and .iloc (position-based); boolean masking;
filtering with .query(); chained operations and method chaining vs
intermediates; groupby (split-apply-combine); merge / join / concat;
pivot_table; melt (wide-to-long); apply / map / applymap and when each
fits; missing data (NaN, isna, dropna, fillna); datetime handling
(pd.to_datetime, dt accessor); writing back (to_csv, to_parquet);
performance tips (use vectorized ops, avoid iterrows). Modern note: polars
is a strong alternative — column-oriented, lazy, fast, written in Rust.

### L90 · Jupyter notebooks · LIGHT · ~30 min
Subtopics: the notebook as document + interactive Python; cell types
(code, markdown); running cells; the kernel; hidden state — "I ran cell 3
then cell 2 — what does the namespace look like?" — the most common
notebook bug; %magics (%time, %timeit, %load_ext autoreload); checkpoints;
exporting to .py / .html / .pdf; notebooks in production (nbconvert,
papermill, voilà); the case for and against — notebooks for exploration,
.py for production code.

### L91 · LLM SDKs — the canonical patterns · STANDARD · ~60 min
Subtopics: the OpenAI Python SDK; the Anthropic Python SDK; the consistent
"client.X.create(...)" shape; sync vs async clients; streaming responses;
function/tool calling at the API level; cost considerations
(token counting with tiktoken); the rate-limit pattern; structured outputs
(JSON schema, response_format); the "use the SDK, don't hand-build HTTP"
guidance. Deep coverage of patterns in Phase 8.

---

## Module 2.8 — Testing, quality, packaging

### L92 · Testing with pytest · VERY-DEEP · ~120 min
Subtopics (~28):
1. pytest as de-facto Python test framework.
2. Test discovery (test_*.py files, test_* functions, Test* classes).
3. Assertions: plain `assert` with rich introspection.
4. parametrize for table-driven tests.
5. Fixtures (function, class, module, session scope).
6. autouse fixtures.
7. Built-in fixtures: tmp_path, monkeypatch, capsys, caplog.
8. conftest.py for shared fixtures.
9. Markers (custom and built-in: skip, skipif, xfail).
10. Parametrized fixtures.
11. pytest.raises for expected exceptions.
12. pytest.warns for expected warnings.
13. Async test support (pytest-asyncio).
14. Mocking with unittest.mock and pytest-mock.
15. Mocking time (freezegun, time-machine).
16. Mocking HTTP (responses, respx, httpretty, vcrpy).
17. Test database setup (fixtures + factory_boy + transactions).
18. Property-based testing with Hypothesis.
19. Test isolation principles.
20. The testing pyramid: unit → integration → e2e.
21. Coverage measurement with pytest-cov / coverage.py.
22. Branch coverage vs line coverage.
23. The "coverage as a leading indicator, not a goal" debate.
24. Test naming conventions.
25. The arrange/act/assert pattern (AAA).
26. Snapshot testing (syrupy).
27. Performance testing markers; benchmarks (pytest-benchmark).
28. The relationship between tests and types — both reduce bugs; types
    catch a different category cheaper.

### L93 · Type checking and linting in real use · DEEP · ~50 min
Subtopics: ruff as the modern linter/formatter (replaces flake8, pylint,
isort, black in one tool); ruff format vs black; ruff check; mypy
configuration (mypy.ini or pyproject.toml [tool.mypy]); pyright /
basedpyright; strict mode bringup strategy; ignoring lines with #
type: ignore[code]; type stubs for untyped deps; "any leaks" tracking
(--disallow-any-explicit); pre-commit hook integration; CI gating.

### L94 · Packaging and distribution · STANDARD · ~50 min
Subtopics: pyproject.toml as the modern package manifest; build backends
(setuptools, hatchling, flit, poetry-core); building wheels (`python -m
build`); uploading to PyPI / private PyPI; semantic versioning; entry
points (console_scripts) for CLI; the `__init__.py` and package structure;
the difference between "library" packaging and "application" deployment.

---

## Phase 2 cross-thread coverage

- **Testing:** real coverage in M2.8; tests reference all prior modules.
- **Debugging:** breakpoint() / pdb / ipdb in M2.4 (errors); print-vs-
  logging in M2.5; profiling (cProfile, py-spy) — light intro in M2.5.
- **Performance:** complexity of data structures (M2.2); comprehension vs
  loop benchmarks (M2.4); subprocess vs in-process (M2.5); async vs sync
  (M2.4/2.6).
- **Security:** pickle warning (M2.5); shell-injection (M2.5); secrets
  management (M2.6); never-eval user input (mentioned everywhere it tempts).
- **AI-integration:** M2.6 HTTP unlocks every LLM SDK; M2.7 NumPy/Pandas
  for data pipelines; M2.8 testing AI-touching code with mocks.

---

## What Phase 2 doesn't cover (deliberately deferred)

- Web frameworks (FastAPI, Django, Flask) — Phase 5.
- Async I/O deep — Phase 5 (where it shows up for servers).
- Concurrency in depth (threading, multiprocessing) — Phase 5.
- Database ORMs (SQLAlchemy, Django ORM) — Phase 4.
- AI agent architecture — Phase 8.
- Deployment of Python apps — Phase 7.
