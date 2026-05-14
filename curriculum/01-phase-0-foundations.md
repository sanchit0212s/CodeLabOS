# Phase 0 — How Computers & Code Actually Work

**Essence:** mental models for every layer beneath your application. By the
end of Phase 0, words like "process," "kernel," "TCP," "DNS," "HTTPS," "PATH,"
"socket," and "shell" are not jargon. They are clear, specific concepts you
can sketch.

**Gate (what you can do at the end):** open any project folder and name the
role of 15+ files without help; read a stack trace and locate the layer
the error came from (your code, your library, OS, network); read a curl
command, an HTTP request, a Dockerfile, a shell pipeline, and not feel lost.

**Prerequisites:** none. Phase 0 is built for someone who has never written
a line of code professionally.

**Primary references**
- Petzold, *Code: The Hidden Language of Computer Hardware and Software* —
  the gold-standard tour from "what a transistor does" to "how a program runs."
- Patterson & Hennessy, *Computer Organization and Design* (sections 1-3) —
  the canonical CPU/memory/I/O text.
- Tanenbaum, *Modern Operating Systems* (chapters 1-4) — for the OS lessons.
- Stevens & Rago, *Advanced Programming in the UNIX Environment* — for
  shell/process/filesystem depth.
- Kurose & Ross, *Computer Networking: A Top-Down Approach* — chapters 1-3
  for the "how the internet works" module.
- Linux manual pages (`man bash`, `man chmod`, `man find`, etc.) — primary
  source for every shell utility.
- web.dev/learn/performance — for the request-lifecycle visualization.
- "High Performance Browser Networking" by Ilya Grigorik — open online,
  best reference for how the browser actually fetches resources.
- Julia Evans' zines (wizardzines.com) — the visual gold standard for the
  network/Linux topics. Especially "How HTTPS Works" and "Bite Size Linux."
- *The Linux Programming Interface* (Kerrisk) — overkill for orchestrator
  level, but the chapters on processes, files, and pipes are unmatched.

**Cross-phase threads touched here**
- **Debugging** — reading the terminal output, finding files, tailing logs.
- **Security** — file permissions, secrets management foundation, the
  client-vs-server trust boundary.
- **Performance** — the latency hierarchy (CPU cache → RAM → SSD → network)
  is introduced; all later performance lessons reference it.

---

## Module 0.1 — The Machine

Goal: a mental model of what's actually executing your code. After this
module the student can answer: "where do variables live?", "what does the
CPU do with my Python file?", "what happens when I run out of memory?",
"why is disk slow?"

References: Petzold (Code), Patterson & Hennessy ch. 1-2, Bryant & O'Hallaron
*Computer Systems: A Programmer's Perspective* (CMU 15-213 textbook) ch. 1.

### L1 · What a computer actually does · DEEP · ~75 min

Essence: a computer moves numbers between three places (CPU, RAM, storage)
extremely fast. Everything else is built on top.

Subtopics (~22):
1. The three places (CPU, RAM, storage) — what each is physically
2. The CPU as instructions + registers — what "execute an instruction" means
3. Registers vs L1/L2/L3 cache vs RAM — the memory hierarchy
4. Latency numbers in human time (the classic "if cache is 1 second…" table)
5. Why hitting RAM is fast and hitting disk is slow — *the* foundational performance fact
6. SSD vs HDD vs network storage — orders-of-magnitude differences
7. What "32-bit" vs "64-bit" actually means and why you stopped caring
8. RAM is volatile, storage is persistent — and what "unsaved work" really means
9. The arithmetic logic unit (ALU) at a hand-wavy level
10. Clock speed and why it's no longer the only thing
11. Cores and concurrency — what "multi-core" actually buys you
12. GPUs as a fundamentally different compute architecture (preview for AI work)
13. Virtual memory — the OS gives every process its own private RAM view
14. The stack and the heap — two regions every program has
15. Cache lines and "spatial locality" (intuitive only)
16. What a "memory address" is
17. Binary, hex, decimal — how the same number can be written three ways
18. Bytes, KB/MB/GB/TB — what those orders mean and IEC vs SI confusion
19. Endianness in 60 seconds (mention only)
20. Why pure Python is slow — interpretation overhead per operation
21. Why NumPy is fast even though it's "Python" — calls into compiled C
22. The "data has to be where it's needed" rule — why we cache, why we have CDNs

Branches:
- Mental models of memory: stack-and-heap (most languages) vs arena-based
  (Rust, Go) vs no-explicit-memory (Python/JS — gc).
- Storage choices: local SSD vs network-attached storage vs object storage
  (S3) vs CDN — each with latency/durability/cost trade-offs.

Anti-patterns specific to this lesson:
- "Just throw more RAM at it" without understanding what the program is doing.
- Loading enormous files entirely into memory when streaming would work.
- Reading a tiny file from disk inside a hot loop (should cache).

Practice sketch:
- Read a top output of a running app. Identify CPU%, MEM%, what process is doing.
- Given three implementations (loop, list-comprehension, NumPy vector op),
  predict which is fastest and why.
- Estimate: "if a database lookup takes 5ms and we do it 200 times per
  page load, what's the floor on page latency?"

References:
- Bryant & O'Hallaron, *Computer Systems: APP*, ch. 1, 6.
- Jeff Dean's "Numbers Everyone Should Know" slide — visualized in
  many forms; use the latency-comparison version.
- Patterson & Hennessy, *COD*, §1.4 ("Below your program").
- Stripe blog "Latency numbers" — the modern remix.

Prerequisites: none.
Forward links: L5 (processes & memory), L98 (database indexes), L244
(latency vs throughput), L246 (caching strategies).

Going further:
- Cache-conscious algorithms and "mechanical sympathy" — Martin Thompson's talks.
- NUMA architectures on multi-socket servers.
- GPU memory models (HBM, VRAM) — needed before deep AI work.
- *What Every Programmer Should Know About Memory* (Drepper, 2007) — long, classic.

---

### L2 · The operating system · DEEP · ~90 min

Essence: the OS is the traffic controller between programs and hardware.
Knowing its five jobs lets you diagnose almost anything that happens
"below" your code.

Subtopics (~30):
1. What an OS is — kernel + userland stack
2. The five jobs: scheduling, memory, filesystem mediation, network
   mediation, users & permissions
3. Userland vs kernel mode — system calls
4. Linux as a kernel vs a distribution
5. The major distros: Ubuntu, Debian, Alpine, RHEL/Fedora, Arch — and
   what makes them different (package manager, init, philosophy)
6. macOS and its Darwin BSD-derived core
7. Windows + WSL — what WSL actually is (a real Linux kernel running on Windows)
8. The init system (systemd) and units, services, journalctl
9. Package managers (apt/dnf/brew/scoop) — what they actually do
10. The standard Linux filesystem layout (/etc, /var, /usr, /opt, /tmp, /home, /root, /proc, /sys)
11. The shell as a process the kernel runs
12. Users and groups — `/etc/passwd`, `/etc/group`
13. Permissions revisited — `rwx` × (owner/group/other), special bits (setuid, sticky)
14. Processes and PIDs — `ps`, `top`, `htop`
15. Signals (SIGTERM vs SIGKILL vs SIGINT)
16. Standard streams (stdin/stdout/stderr)
17. Environment variables at the OS level
18. The OOM killer
19. Inter-process communication: pipes, sockets, shared memory (overview)
20. The clock and timezones (UTC discipline)
21. What "everything is a file" actually means in Unix
22. Device files (/dev/null, /dev/random)
23. Mount points and filesystems (ext4, xfs, apfs, ntfs, zfs)
24. Containers as OS-level isolation (cgroups + namespaces) — preview
25. Why production usually runs Linux
26. Windows-as-a-server (when, why, mostly avoid for greenfield SaaS)
27. The OS's idea of "logged in user" vs "process owner"
28. Why running as root is dangerous — the principle of least privilege
29. The shell's environment as inherited per-process
30. The cost of a syscall and why pure-Python loops feel "slow per item"

Branches:
- Distro choice for production: Ubuntu LTS (familiarity) vs Alpine (size) vs
  Amazon Linux (AWS optimized) vs distroless (security).
- Init systems: systemd (modern Linux) vs OpenRC (Alpine) vs launchd (macOS).
- Containers as the new OS-level abstraction (full coverage in Phase 7).

Anti-patterns:
- Running services as root in production.
- World-writable secrets files.
- Storing application data under `/tmp` (gets wiped).
- Hardcoding `/Users/<name>` paths (won't survive deploy).

Practice sketch:
- Identify which process owns a given port (`lsof -i :3000`).
- Read `/etc/passwd` and explain each field.
- Run `ps aux` and explain at least three real processes.
- Distinguish what kernel logs (`dmesg`) vs application logs (`journalctl -u service`) tell you.

References:
- Tanenbaum, *Modern Operating Systems* ch. 1-2.
- Kerrisk, *The Linux Programming Interface* ch. 2 (essential ideas).
- Julia Evans, *How Containers Work* zine (sets up Phase 7).
- `man 7 signal`, `man 7 credentials`, `man 7 environ` — primary sources.

Prerequisites: L1.
Forward links: L11 (permissions), L179-185 (Linux module in Phase 7),
L186-194 (Docker), L211-215 (Kubernetes — as OS-of-OSes).

Going further:
- *Operating Systems: Three Easy Pieces* (Arpaci-Dusseau) — free online,
  best OS textbook in 30 years.
- eBPF — observability into the kernel from userland.
- The Linux Standard Base / FHS — why directories are where they are.

---

### L3 · The filesystem · STANDARD · ~50 min

Essence: a tree of named bytes. Paths are addresses. Everything else
(/proc, /dev, network mounts, container filesystems) is a variation.

Subtopics (~20):
1. The tree, rooted at `/` on Unix (multi-rooted on Windows: C:\, D:\)
2. Files = labeled byte sequences; folders = lists of files+folders
3. Inodes — what they are, why "delete" is two operations (unlink + free), why disk-full-but-no-files-visible happens
4. Hard links vs symbolic links — when each is used
5. File extensions are conventions, the actual type lives in the bytes
   (and what `file <path>` does)
6. Hidden files (the leading-dot convention)
7. Absolute vs relative paths
8. The `.` / `..` / `~` shortcuts
9. Mount points — multiple filesystems composed into one tree
10. Permissions overview (deep in L11)
11. Owner, group, size, mtime, atime, ctime
12. Globbing and wildcards (* ? [abc] **)
13. `find` for searching the tree
14. `tree`, `ls -la`, `du`, `df`
15. Trailing slashes in `cp` and `rsync` — the gotcha that bites everyone
16. Case sensitivity: Linux yes, macOS (default) no, Windows no
17. The /proc and /sys virtual filesystems — files that aren't really files
18. Network filesystems (NFS, SMB) — file ops over the network
19. Filesystem types (ext4, xfs, apfs, ntfs, zfs) and when they matter
20. Cross-platform path handling — the `os.path` and `pathlib` libraries in Python; `path` module in Node

Branches:
- Path manipulation: `os.path.join` vs `pathlib.Path` (Python); `path.join`
  (Node) — modern preference: `pathlib` / `path.posix`.
- Globbing: shell glob vs `glob` module vs `fnmatch` — different rules,
  surprising overlap.

Anti-patterns:
- Hardcoded absolute paths in source code.
- String concatenation to build paths instead of join helpers.
- Assuming case sensitivity matches your dev machine.
- Reading large files entirely into memory.

Practice sketch:
- Given `ls -la` output, identify file types, permissions, owners.
- Convert an absolute path to a relative path from a different working dir.
- Use `find` to locate every `.env` file under a tree.

References:
- *The Linux Programming Interface* (Kerrisk) ch. 4, 14, 18.
- `man hier`, `man inode`, `man find`.
- Python `pathlib` docs.

Prerequisites: L2.
Forward links: L7 (navigation), L11 (permissions), L20 (project anatomy),
L48 (Python file I/O).

Going further:
- Copy-on-write filesystems (btrfs, zfs).
- Filesystem-in-userspace (FUSE).

---

### L4 · How programs run · DEEP · ~75 min

Essence: source code → machine code → process. The translation step is
either "ahead of time" (compiled) or "on demand" (interpreted) — and many
modern languages blur the line.

Subtopics (~25):
1. Source code is text. CPUs execute machine code. Something has to translate.
2. Compilers — translate-once, run-many.
3. Interpreters — translate at runtime, every time.
4. The blurry middle: bytecode + virtual machines (Python's .pyc, JVM, .NET CLR).
5. JIT compilation (V8, PyPy, HotSpot).
6. AOT compilation (Go, Rust, C, C++).
7. The build pipeline: source → tokenizer → parser → AST → bytecode/IR → optimization → output.
8. What "compile errors" really are vs "runtime errors."
9. Linking — static vs dynamic. What a .so / .dll is.
10. The ELF / Mach-O / PE binary formats (just-know-they-exist).
11. Why Node is fast: V8 + JIT.
12. Why Python is slow: per-op interpretation, no JIT in CPython (PyPy has one).
13. WebAssembly: AOT to a portable bytecode. Where Pyodide fits.
14. The compilation cache (Python's __pycache__).
15. The build step in modern JS — bundling + transpilation + tree-shaking + minification.
16. Source maps — debugging the original code through the compiled output.
17. What "transpile" means specifically: TS → JS, modern JS → old JS.
18. "Compile-time" vs "build-time" vs "runtime" — keeping the timeline straight.
19. Dynamic linking and shared libraries on a Linux server.
20. Why a Docker image often includes a whole language runtime.
21. Hot reload — what it actually does (re-bundle subset, re-execute).
22. The cost of starting a process — "warm" vs "cold" runs.
23. The cost of starting a serverless function — "cold start" problem.
24. ELF inspection (`file`, `ldd`) — useful when "command not found" lies.
25. Binary distributions vs running source: pip wheels, npm prebuilds.

Branches:
- Languages by execution model: C/C++/Rust/Go (compiled to native), Java/Kotlin/Scala (bytecode + JIT), Python/Ruby/JS (interpreted with various optimizations), Lua (interpreted, very small VM).
- Modern Python tooling: cpython, pypy, mypyc, Cython, mojo (preview).

Anti-patterns:
- Shipping unminified, unbundled JS to production.
- Building inside production servers instead of CI.
- Catching syntax errors at runtime when a compile step would have caught them at build (use TypeScript).

Practice sketch:
- Given a stack trace, identify whether the error was at parse-time, compile-time, or runtime.
- Run `python -c "import dis; dis.dis(my_function)"` and read disassembled bytecode.
- Compare build output sizes before and after `npm run build`.

References:
- Nystrom, *Crafting Interpreters* — best book on this topic period.
- Python language reference, "Execution model."
- V8 blog posts on JIT internals.
- esbuild docs on bundling pipeline.

Prerequisites: L1.
Forward links: L23 (build process), L88-92 (Node/npm), L186-194 (Docker, since
images bake the runtime in), L222 (LLM streaming runs differently from
batch — same "translate at the right time" mental tool).

Going further:
- Implement a tiny interpreter for a calculator language.
- Read V8 turbofan optimization passes.
- The Python GIL and why it makes the CPython interpreter simpler.

---

### L5 · Processes, memory, and crashes · DEEP · ~80 min

Essence: every running program is a process; processes own memory; when
programs go wrong, they crash in three patterns (unhandled exception, OOM,
segfault). Knowing the patterns lets you read incident reports correctly.

Subtopics (~26):
1. Definition of a process — kernel-tracked execution context.
2. PID, PPID — the process tree.
3. Memory per process — own address space, can't read others'.
4. The stack (call frames) vs the heap (dynamic allocation).
5. Stack overflow — what causes it (deep recursion), how to read the trace.
6. Heap exhaustion — OOM, the OOM killer.
7. Memory leaks in garbage-collected languages: held references.
8. Memory leaks in manual-memory languages: forgot to free.
9. Reference counting (Python's default) vs mark-and-sweep (JVM, V8) vs generational GC.
10. Why Python's reference counting can fail on cycles (and how `gc` handles it).
11. Threads — multiple control flows in one process. Same memory.
12. The GIL in CPython — why it limits true CPU parallelism.
13. Async / event loop — different concurrency model. Single thread, many "fibers."
14. Multiprocessing — multiple processes for CPU parallelism in Python.
15. Process spawning — fork (Unix), CreateProcess (Win), exec.
16. Zombies and orphans — what they are.
17. Signals: SIGTERM (gentle kill), SIGKILL (hard kill), SIGINT (Ctrl-C), SIGHUP.
18. The 3 classic crashes: unhandled exception (most common), OOM, segfault.
19. Reading a stack trace: top is most recent.
20. Crash dumps and core dumps (briefly).
21. Process supervisors: systemd, PM2, foreman, Docker's restart policies.
22. Healthchecks — how supervisors know to restart.
23. Restart strategies: always, on-failure, never, exponential backoff.
24. Graceful shutdown — drain in-flight requests, close DB connections.
25. Why long-running connections are tricky (websockets, SSE) when restarting.
26. Container-as-process — `docker run` gives one main process, when it exits the container exits.

Branches:
- Concurrency models: threaded (Java, C#), async (Node, Python asyncio),
  process-per-request (PHP traditional), goroutines (Go), actors (Erlang/Elixir/Akka).
- Memory management: manual (C), RAII (C++, Rust), GC (Python, JS, Go, Java).

Anti-patterns:
- Catching every exception and hiding crashes.
- Running without a supervisor in production.
- No healthchecks / no graceful shutdown.
- Storing important state in process memory across restarts.

Practice sketch:
- Read three different Python tracebacks; classify each.
- Read a docker logs output ending in "Killed" — diagnose OOM.
- Sketch the lifecycle of an HTTP request that times out vs one that succeeds.

References:
- Tanenbaum, *MOS* ch. 2.
- `man 7 signal`, `man 7 process-keyring`.
- *Inside the Python Virtual Machine* (chapters on object lifecycle).
- Node.js docs on the event loop.

Prerequisites: L1, L2.
Forward links: L49 (Python error handling), L80 (JS async errors),
L239-243 (observability — how you find out about crashes in production),
L93 (Node event loop in depth).

Going further:
- Implement a tiny process supervisor in Python.
- Read the Linux kernel's OOM scoring algorithm.
- Read about graceful shutdown in Kubernetes (preStop hooks, terminationGracePeriodSeconds).

---

## Module 0.2 — The Terminal

Goal: the shell stops being scary. By end of module the student can compose
small pipelines, navigate any project, edit files, set env vars, and
recognize the most common shell gotchas.

References: Stevens & Rago, *Advanced Programming in the UNIX Environment*
ch. 1-3, 7, 9. Bash Reference Manual (gnu.org). Newham's *Learning the
bash Shell* (still excellent for getting comfortable).

### L6 · What the terminal is · STANDARD · ~30 min
Subtopics: terminal vs shell distinction; bash vs zsh vs fish vs PowerShell;
the REPL pattern; the prompt; tab completion; history; reverse search
(Ctrl-R); shortcut catalog (Ctrl-A/E/U/W/K/L); job control (Ctrl-Z, bg, fg);
the `$PATH` (preview); login vs non-login shells (briefly).

Anti-patterns: copying `curl … | sudo bash` without reading; running unknown
scripts as root.

References: GNU bash manual §3 (interactive shell); `man bash`.

### L7 · Navigating · STANDARD · ~40 min
Subtopics: pwd, ls (with flags -lah, -t, -S, -r), cd (and `cd -`), mkdir
(with -p), touch, cp, mv, rm (with -r, -i, and the `-rf` warning), tab
completion, history, `.` and `..` and `~`; symlinks (`ln -s`); `which`,
`type`, `command`; `tree` if available.

Anti-patterns: `rm -rf $VAR/*` without checking VAR is set; using `rm -rf
~/Documents` while testing scripts.

### L8 · Reading and writing files · STANDARD · ~40 min
Subtopics: cat, less (and its keys: q, /, n, G, gg), head, tail (and
`tail -f`); echo and printf (and why printf is more predictable); redirection
(>, >>, 2>, &>, <); here-documents (<< EOF); here-strings (<<<); the
difference between writing to a file with > and using `tee`; nano (Ctrl-O,
Ctrl-X) for friendly editing; surviving vim (`Esc` then `:q!`).

Anti-patterns: catting massive log files; losing file content with > when
you meant >>.

### L9 · Environment variables · DEEP · ~50 min
Subtopics: definition; `export` vs plain assignment; current shell vs subshell;
`env`, `printenv`, `unset`; the difference between PATH, LANG, HOME, USER,
SHELL, PWD, EDITOR, LC_ALL; per-shell rc files (.bashrc, .zshrc, .profile);
shell quoting and how variables interpolate; `$VAR` vs `${VAR}` vs `$(VAR)`
vs `${VAR:-default}` vs `${VAR:?error}`; the `.env` file convention;
loading `.env` with `set -a; source .env; set +a` or with `dotenv`; per-
language access patterns (`process.env.X`, `os.environ["X"]`); local override
files (`.env.local`); the principle that secrets live in env, not source.

Anti-patterns: `.env` committed to git; secrets baked into Dockerfiles via
ENV; passing secrets on the command line (visible in `ps`).

Branches: dotenv libraries by language (python-dotenv, dotenv (node),
godotenv, direnv) — each with different reload semantics.

References: `man bash` (PARAMETERS, EXPANSION sections); 12-factor config.

### L10 · The PATH · STANDARD · ~30 min
Subtopics: what PATH is; how the shell resolves a command; order matters
(first match wins); appending vs prepending; `which`, `command -v`, `type`;
"command not found" is always a PATH problem; per-project bin folders (e.g.,
`./node_modules/.bin`); shims (nvm, asdf, pyenv); the security risk of
putting `.` in PATH.

Anti-patterns: putting `.` in PATH; relying on `which` for built-ins
(use `type`).

### L11 · Permissions · DEEP · ~50 min
Subtopics: the rwx triplet × (owner/group/other); reading `ls -l` output;
chmod symbolic (`u+x`, `g-w`, `o=r`) and numeric (755, 644, 600); chown and
chgrp; umask (the default-permissions mask); special bits: setuid (run-as-
owner), setgid (inherit-group), sticky (only owner can delete); ACLs
(briefly — most projects don't use them); `sudo` and `/etc/sudoers`
(read-only mental model); the principle of least privilege; SSH key
permissions (chmod 600); why Docker often runs as root inside the container
(and why distroless / non-root images are the answer).

Anti-patterns: `chmod -R 777` to fix any permission error; running services
as root in production; permissions broader than needed.

References: `man chmod`, `man chown`; *TLPI* ch. 15.

### L12 · Piping and redirection · DEEP · ~60 min
Subtopics: stdin/stdout/stderr triumvirate; the pipe `|` connects stdout
to stdin; redirection operators (revisited); `2>&1` and why order matters;
`tee` for "split"; process substitution `<(cmd)` and `>(cmd)`; building
real pipelines (cat | grep | sort | uniq | head); awk and sed (briefly —
when they're justified vs writing a Python script); xargs to convert
stdout into arguments; the "useless use of cat" critique; named pipes
(FIFOs); pipefail and `set -euo pipefail` discipline.

Anti-patterns: useless cat (`cat file | grep x` vs `grep x file`); ignoring
pipe failures (default bash behavior is to return the LAST command's exit
code only; `set -o pipefail` fixes this); long unmaintainable awk one-liners
when a Python script would be clearer.

Branches: awk, sed, perl-one-liners, ripgrep (rg), fd, jq for JSON, yq for
YAML — modern alternatives to the classic Unix tools.

References: `man bash` (REDIRECTION); Eric Pement's awk one-liners; jq
manual; ripgrep README.

Going further: shell scripting in depth (Phase 7.1); writing portable scripts
(POSIX sh vs bash); the entire "Unix Philosophy" essay (Doug McIlroy).

---

## Module 0.3 — How the Internet Works

Goal: when the student opens DevTools, they can read the Network tab
intelligently. They know what every part of an HTTP request does and what
can go wrong at each layer.

References: Kurose & Ross *Computer Networking: A Top-Down Approach* ch. 1-3;
Ilya Grigorik, *High Performance Browser Networking* (free online); MDN's
"Web technology for developers" section; RFC 7230 (HTTP/1.1) — for the
adventurous; web.dev/learn/performance.

### L13 · What happens when you open a URL · VERY-DEEP · ~120 min
Subtopics (~35):
1. URL anatomy (scheme, userinfo, host, port, path, query, fragment, params)
2. URL encoding (percent-encoding) — when characters need escaping
3. Phase 1: parsing the URL
4. Phase 2: DNS resolution (full breakdown in L14)
5. Phase 3: TCP connection establishment — the 3-way handshake
6. TCP slow start
7. Phase 4: TLS handshake (only for https) — full breakdown in L15
8. SNI (server name indication) — why one IP can serve many sites
9. Connection reuse — HTTP keep-alive
10. HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC) — what each changed
11. Phase 5: sending the HTTP request
12. Phase 6: server processes request
13. Phase 7: receiving the response
14. Streaming vs buffered responses
15. Phase 8: rendering — HTML parse, CSS, JS, layout, paint
16. The critical rendering path
17. Network waterfall diagrams in DevTools
18. Time to First Byte (TTFB), First Contentful Paint (FCP), Largest Contentful Paint (LCP)
19. Service workers and offline behavior
20. The browser cache (preview)
21. Cookies sent with each request to matching domains
22. Same-origin policy and what "origin" means
23. CORS — full coverage in L143
24. Referer, User-Agent, Accept headers — what each affects
25. Conditional requests (If-None-Match, If-Modified-Since) and 304s
26. CDNs and edge networks — where do you actually hit?
27. The HSTS preload list
28. Why `localhost` skips some steps
29. Why "it works in development but not production" — most often a DNS, TLS, CORS, or cookie domain issue
30. The OSI model in the back of your head (you don't need it daily, but the L4 vs L7 distinction matters)
31. Network failures: DNS_PROBE_FINISHED_NXDOMAIN, ERR_CONNECTION_REFUSED,
    ERR_SSL_PROTOCOL_ERROR, ERR_NAME_NOT_RESOLVED — diagnosing from the
    Chrome message
32. Captive portals on hotel wifi (briefly)
33. The role of proxies and VPNs in the path
34. IPv4 vs IPv6 — which actually got used, when, why dual-stack
35. The "everything is a packet at the bottom" reality

Branches: HTTP/1.1 (head-of-line blocking, text-based) vs HTTP/2 (binary,
multiplexed) vs HTTP/3 (QUIC over UDP, no head-of-line blocking). When
each matters in production.

Anti-patterns: assuming "slow" is one thing instead of using DevTools to
locate which phase is slow; cargo-culting caching headers; adding a CDN
without understanding what it caches.

Practice sketch: open DevTools on a real production site, screenshot the
network waterfall, annotate which phase each bar represents.

References: Grigorik *High Performance Browser Networking* (entire book worth
skimming); web.dev's "Network" tracks; *RFC 9110* (modern HTTP semantics);
Cloudflare's "Learning Center" articles on HTTP/2 and QUIC.

Forward links: L14 (DNS deep dive), L15 (HTTP/HTTPS deep), L143 (CORS),
L200 (CDNs), L238 (TLS internals).

### L14 · DNS · DEEP · ~70 min
Subtopics: definition; recursive vs authoritative resolvers; the resolution
chain (your machine → resolver → root → TLD → authoritative); record types
(A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, CAA); TTL and propagation; what
"propagation delay" actually is (caching); the hosts file (`/etc/hosts`)
and when it overrides; private DNS (split-horizon); DNS-over-HTTPS (DoH);
DNS-over-TLS (DoT); CNAME flattening at apex (and ALIAS records); why
"www" was traditionally a CNAME to the canonical host; debugging tools:
dig, nslookup, host; reading dig output; ANY queries (mostly deprecated);
common pitfalls (CNAME at zone apex — Cloudflare/CloudFront workarounds,
www vs apex confusion).

Practical SaaS context: pointing a custom domain at Vercel/Netlify/Render;
when to use A records vs CNAMEs; managing DNS at the registrar vs at a
DNS provider (Cloudflare/Route53); DNSSEC (briefly, mostly skip).

Anti-patterns: very short TTLs everywhere (more queries, no real benefit);
hardcoded IP addresses in source.

References: Grigorik ch. 11; Cloudflare DNS docs; *DNS for Rocket Scientists*
(zytrax.com — surprisingly thorough free site).

### L15 · HTTP and HTTPS · VERY-DEEP · ~120 min
Subtopics (~30): request structure (start line, headers, body); response
structure (status line, headers, body); the 8 method verbs (GET, HEAD,
POST, PUT, PATCH, DELETE, OPTIONS, TRACE/CONNECT); idempotency and which
verbs are; safety and which verbs are; status codes deep (5 classes, 20
specific codes worth memorizing); headers catalog — Content-Type,
Content-Length, Authorization, Cookie/Set-Cookie, CORS family,
Cache-Control + Expires + ETag + If-None-Match family, Accept-* family,
X-Forwarded-* (when behind a proxy); MIME types; chunked transfer encoding;
compression (gzip, brotli); persistent connections; pipelining (HTTP/1.1,
rarely used); multiplexing (HTTP/2); push (deprecated); cookies in depth
(Set-Cookie attributes: Domain, Path, HttpOnly, Secure, SameSite=Lax/Strict/None,
Max-Age, Expires, Partitioned); HSTS; how HTTPS works (TLS handshake at a
conceptual level — preview L238); certificate chain and Let's Encrypt;
mixed content; reading curl -v output; reading network traces.

Branches: REST vs RPC vs GraphQL — covered in Phase 5, but mention here so
the student knows HTTP is the transport for all.

Anti-patterns: GETs that mutate state; missing Cache-Control causing
unintended caching; SameSite=None without Secure (rejected); CORS
misconfig of `Access-Control-Allow-Origin: *` with credentials.

References: MDN HTTP docs (entire section); RFC 9110, 9111, 9112, 9113
(HTTP semantics + caching + 1.1 + 2); Smashing Magazine articles on cookies.

### L16 · What an API is · DEEP · ~60 min
Subtopics: API definition; web API vs library API vs system API; the
request/response contract; endpoints; resources; payloads (typically JSON
in 2026); status codes as contract; authentication patterns (overview);
versioning patterns; rate limits; SDKs vs raw HTTP; OpenAPI / Swagger as
the canonical description; reading an API doc (Stripe's is the gold
standard — point readers to it); webhooks vs polling vs streaming as
event-delivery patterns; idempotency keys for safe retries; pagination
patterns (offset, cursor, keyset); long-running operations.

Branches: REST (resource-oriented) vs RPC (action-oriented) vs GraphQL
(query-oriented) vs gRPC (binary RPC) — when to use which.

Anti-patterns: exposing secret keys client-side; chatty endpoints (one
roundtrip per item instead of one per page); no rate limits; status-code
lies (200 with `{error: ...}`).

References: Stripe API docs (read at least the philosophy); REST API
Design Rulebook (Masse); Roy Fielding's REST dissertation (ch. 5 only).

### L17 · Status codes · STANDARD · ~30 min
Subtopics: 1xx informational; 2xx success (200, 201, 202, 204); 3xx redirect
(301, 302, 303, 304, 307, 308 — the difference between 301 and 308 matters);
4xx client error (400, 401, 403, 404, 405, 408, 409, 410, 422, 429); 5xx
server (500, 502, 503, 504); 401 vs 403 (auth vs perms); 422 vs 400; 503
with Retry-After; convention vs RFC.

References: MDN "HTTP response status codes" complete table.

### L18 · Server vs client · DEEP · ~50 min
Subtopics: definitions; trust boundary; what each can see; the cardinal
rule "never trust the client"; defense in depth; UI vs security checks
("the lock icon in the UI is UX, the auth check on the server is law");
public vs private code in Next.js (`NEXT_PUBLIC_` convention); RSC vs
client components in modern frameworks; SSR vs CSR (preview L176);
client-side state vs server-side state; cookies as the bridge; CSRF
threats; the same-origin policy at a conceptual level.

References: OWASP Top 10 entries on broken access control and SSRF;
Auth0's "Client-Side vs Server-Side" article.

### L19 · localhost and ports · STANDARD · ~35 min
Subtopics: 127.0.0.1 = loopback; "localhost" as the standard name; ports
as 16-bit numbers; well-known ports (80, 443, 22, 53); registered ports
(3000, 5000, 8080); ephemeral ports; binding to 0.0.0.0 vs 127.0.0.1 (and
the security implication); finding what's on a port (`lsof -i :3000`,
`ss -tulpn`); killing what's there; port forwarding via SSH;
mkcert for local HTTPS; LAN testing (the phone-on-same-wifi pattern);
ngrok / cloudflared tunnel for external access to localhost.

Anti-patterns: hardcoding localhost in production; binding to 0.0.0.0 on
a public server without firewall.

References: `man lsof`, `man ss`; ngrok docs.

---

## Module 0.4 — Project Anatomy

Goal: open any project folder and know what every file is for. The
File Anatomy Inspector tool is the operational artifact of this module.

### L20 · What a project is · STANDARD · ~40 min
Subtopics: the four categories (source, config, deps, build); plus docs and
secrets; what each category typically looks like in Python/Node/Go projects;
the project root vs the package root; monorepos overview; common top-level
files; reading a directory listing systematically.

### L21 · Common files · VERY-DEEP · ~120 min
This is the practical lesson that ties to the File Anatomy Inspector tool.
Subtopics (~50): every file in a typical SaaS repo, what it does, who
created it, whether you read/edit/never-touch, what to ask the agent about
it. Concretely:

Package manifests: package.json, package-lock.json, yarn.lock, pnpm-lock.yaml,
requirements.txt, requirements-dev.txt, pyproject.toml, Pipfile,
Pipfile.lock, poetry.lock, uv.lock, Gemfile, Gemfile.lock, go.mod, go.sum,
Cargo.toml, Cargo.lock.

Tool configs: tsconfig.json, .babelrc, .swcrc, eslint config (.eslintrc.*,
eslint.config.js), prettier (.prettierrc, .prettierignore), .editorconfig,
tailwind.config.ts, postcss.config.mjs, next.config.mjs, vite.config.ts,
webpack.config.js, vitest.config.ts, jest.config.js, playwright.config.ts,
.nvmrc, .node-version, .python-version, .tool-versions, mypy.ini, ruff.toml,
black config in pyproject.

Build/deploy: Dockerfile, Dockerfile.dev, docker-compose.yml,
docker-compose.override.yml, .dockerignore, fly.toml, vercel.json, netlify.toml,
railway.json, render.yaml, Procfile, Makefile, Justfile, Taskfile.yml.

CI: .github/workflows/*.yml, .circleci/config.yml, .gitlab-ci.yml.

Git: .git/, .gitignore, .gitattributes, .git-blame-ignore-revs, CODEOWNERS.

Docs: README.md, CHANGELOG.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, LICENSE,
SECURITY.md, ROADMAP.md, ARCHITECTURE.md, docs/.

Secrets/env: .env, .env.local, .env.example, .env.production, .env.test.

Build output (gitignored): node_modules/, .next/, dist/, build/, out/,
.turbo/, .cache/, .vercel/, coverage/, .pytest_cache/, __pycache__/, *.pyc.

OS junk: .DS_Store, Thumbs.db, *.swp.

IDE: .vscode/, .idea/, .cursor/, .windsurf/ — when these are committed and when not.

Database: prisma/schema.prisma, prisma/migrations/, drizzle/, knex
migrations, alembic/, db/migrate/.

For each of these the doc should specify: role, created-by, read?, edit?,
contents, ask-the-agent questions, taught-in lesson, related files.

Anti-patterns: committing .env; committing node_modules; missing .gitignore;
both yarn.lock and package-lock.json present.

References: gitignore.io for canonical .gitignore templates; npm docs on
package.json fields; Python Packaging Authority (PyPA) docs on
pyproject.toml.

### L22 · What dependencies are · DEEP · ~80 min
Subtopics: direct vs transitive; semver in depth (MAJOR.MINOR.PATCH, ^, ~,
exact, *, pre-release tags); lockfiles and reproducibility; security
vulnerabilities (npm audit, pip-audit, Snyk, Dependabot); supply chain
attacks; the "left-pad" history; private registries; scoped packages;
peer dependencies vs dependencies vs devDependencies vs optionalDependencies;
the workspace pattern (pnpm/yarn/npm workspaces); npm vs pnpm vs yarn
trade-offs; Python: pip vs poetry vs uv vs pipenv; pip-tools and
requirements compilation; Renovate / Dependabot for automated updates;
dependency footprint as production risk; choosing libraries (popularity,
maintenance, bus factor, license).

Anti-patterns: adding a 1MB lib for a 5-line job; not pinning major versions
in production; ignoring security advisories; both yarn.lock and
package-lock.json.

References: semver.org; npm docs on package.json; PyPA on dependency
management; Rich Harris's "Lockfiles" talk.

### L23 · The build process · DEEP · ~80 min
Subtopics: from source to runnable; the pipeline: compile/transpile, bundle,
tree-shake, minify, optimize assets; what each step buys you; build caches;
incremental builds; common bundlers (esbuild, swc, webpack, vite, rollup,
parcel, turbopack); transpilers (babel, swc, tsc); the difference between
build and deploy; the difference between dev build and prod build; reading
a build output (sizes, warnings, errors); source maps; cold start; the
"works on my machine" failure mode and how Docker/lockfiles address it;
build pipelines for Python (less needed — bytecode caching, wheel building);
the Next.js build specifically.

Anti-patterns: building on production servers; skipping the build step;
committing the build output; build errors swallowed and shipped.

References: esbuild docs; Vite docs; Next.js build deep dives; webpack docs
for the historical context.

### L24 · Dev vs staging vs prod · DEEP · ~60 min
Subtopics: definitions; the 5 things that differ (config, data, scale,
infra, error tolerance); environment-specific config strategies (.env per
env, secrets manager); NODE_ENV / PYTHON_ENV / APP_ENV conventions; the
promotion model (dev → preview → staging → prod); ephemeral preview
environments per-PR (Vercel/Netlify/Railway pattern); feature flags as a
bridge (deploy ≠ release); release strategies (rolling, blue-green, canary,
feature-flag based); database promotion (you don't just copy prod data);
seed data; data anonymization for staging; production parity (12-factor #10);
why staging never truly equals prod and how to live with it.

Anti-patterns: "let me just SSH in and fix it on prod"; using prod database
from dev; different runtime versions across envs; staging-only bugs.

References: The Twelve-Factor App (12factor.net); LaunchDarkly "feature
flags 101"; The Phoenix Project (narrative; useful for the why).

---

## Phase 0 cross-thread coverage

- **Testing:** light. Mentioned only in passing — "you'll learn this in
  Phase 2." Phase 0 is mostly conceptual.
- **Debugging:** medium. Reading stack traces (L5), reading shell errors
  (L7-L8), reading network errors (L13-L19). Not a separate lesson; absorbed.
- **Performance:** L1 introduces the latency hierarchy; L13 introduces
  request-lifecycle profiling. Foundation only — Phase 9 goes deep.
- **Security:** L9 (env vars / secrets discipline), L11 (file permissions),
  L18 (client-vs-server trust). Real coverage in Phase 9, but the
  foundational instincts are set here.
- **AI-integration:** none — too early.

---

## What Phase 0 doesn't cover (deliberately deferred)

- Writing actual code in a real language — Phase 2 onward.
- Git — Phase 1.
- Algorithms / data structures — woven into Phase 2 onward at the
  intuition level. No standalone algorithms phase; we don't grind
  LeetCode. Big-O intuition surfaces in L98 (database indexes), L245
  (query optimization).
- Software design patterns — Phase 10.
- Regular expressions — Phase 2 (when strings get real).
- Concurrency models in depth — Phase 5/8 (when async I/O matters).
