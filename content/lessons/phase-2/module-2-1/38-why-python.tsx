import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";
import { PythonPlayground } from "@/components/interactive/PythonPlayground";

export default function Lesson38() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Python is the language your AI agents speak natively, the language
          every AI/ML library is written in, the language used for most
          scripts and automations, and the modern standard for data work.
          It's also the language easiest for a non-engineer to read at sight.
          Learning Python is not just learning a language — it's learning the
          ambient vocabulary of the AI era.
        </p>
        <p>
          This phase doesn't aim to make you a Python expert. It aims to
          make you <strong>fluent enough to read any Python file an agent
          produces, predict what it will do, spot the suspicious parts, and
          rewrite small pieces yourself</strong>. That's a lot more than
          "tutorial-knows-Python." That's orchestrator-knows-Python.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What kind of language is Python?</>}
          back={
            <p className="text-center text-lg">
              Python is a <strong>high-level, dynamically-typed,
              interpreted, multi-paradigm</strong> language designed around{" "}
              <strong>readability</strong>. It looks like English pseudocode,
              runs anywhere a Python interpreter exists, and ships with
              "batteries included" — a huge standard library and the world's
              largest open-source package ecosystem.
            </p>
          }
        />

        <Diagram caption="Python's surface area. The language is just the tip — the ecosystem of packages on top is what makes Python the default for AI, data, scripts, and web.">
          <div className="space-y-2 w-full max-w-2xl">
            <DBox label="your Python script" tone="accent" sub="50 lines you wrote" />
            <div className="flex justify-center"><DArrow direction="down" label="imports" /></div>
            <DBox label="3rd-party packages (PyPI · ~500,000 of them)" tone="info" sub="numpy, pandas, requests, fastapi, openai, …" />
            <div className="flex justify-center"><DArrow direction="down" /></div>
            <DBox label="Python standard library (hundreds of modules)" tone="info" sub="os, json, datetime, re, http, sqlite3, statistics, …" />
            <div className="flex justify-center"><DArrow direction="down" /></div>
            <DBox label="CPython interpreter (the program named `python`)" tone="phase" sub="reads + executes your code, one line at a time" />
            <div className="flex justify-center"><DArrow direction="down" /></div>
            <DBox label="the operating system" tone="muted" sub="files, processes, network — Python talks to all of it" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Where Python actually shows up</h2>
        <p>
          Python is one of the world's most-used languages, but not for one
          single reason — it's the default in five distinct domains. Knowing
          which domain a Python file belongs to is the first step of reading
          it correctly.
        </p>

        <h3>1. AI and ML — the dominant home</h3>
        <p>
          Nearly every AI/ML library — PyTorch, TensorFlow, JAX, scikit-learn,
          Hugging Face Transformers, LangChain, LlamaIndex, the official
          OpenAI and Anthropic SDKs — is Python-first. When your AI agent
          builds anything that calls an LLM, fine-tunes a model, processes
          embeddings, or runs a vector search, the code is Python.
        </p>
        <p>
          The why: Python's slow execution doesn't matter because the heavy
          lifting happens in compiled C/CUDA inside libraries like NumPy and
          PyTorch. Python is the "glue" layer where scientists and engineers
          can experiment quickly.
        </p>

        <h3>2. Scripts and automation</h3>
        <p>
          The classic "I need to do this once a day" or "I need to migrate
          this data" task. A 20-line Python script with the standard library
          can read CSVs, hit APIs, manipulate files, send emails, and post to
          Slack. <code>cron</code> + Python is half the world's data plumbing.
        </p>

        <h3>3. Web backends (FastAPI, Django, Flask)</h3>
        <p>
          Less dominant than Node.js here, but Python web frameworks power a
          huge slice of the internet — Instagram, Pinterest, Spotify backends,
          early Reddit, Dropbox. FastAPI is the modern default for new
          Python APIs, especially AI-adjacent ones.
        </p>

        <h3>4. Data engineering and science</h3>
        <p>
          NumPy + Pandas + Jupyter notebooks is the standard data-analysis
          stack. Apache Airflow (pipelines), dbt (data transformations), and
          the entire data-warehouse tooling ecosystem are Python-heavy.
          Every notebook you've seen with charts and tables — Python.
        </p>

        <h3>5. DevOps and tooling</h3>
        <p>
          Many internal CLIs at tech companies are Python. Tools like Ansible
          (configuration management), the AWS CLI, and most "wrapper around a
          REST API" tooling are written in Python.
        </p>

        <h2>What Python is NOT good at</h2>
        <p>
          Knowing the negatives is part of orchestrating — agents will
          sometimes propose Python where it's the wrong tool.
        </p>
        <ul>
          <li>
            <strong>Browser frontends.</strong> Browsers run JavaScript, not
            Python. Pyodide (what we're using in this playground!) is an
            exception — Python compiled to WebAssembly — but real frontends
            don't ship that way.
          </li>
          <li>
            <strong>Mobile apps.</strong> Native iOS is Swift, native Android
            is Kotlin. Python's mobile story is poor.
          </li>
          <li>
            <strong>High-performance CPU-bound work.</strong> Pure Python is
            slow. If you're doing image processing or simulations, you write
            the hot loop in C, Rust, or use NumPy.
          </li>
          <li>
            <strong>Concurrent low-latency systems.</strong> The GIL (Global
            Interpreter Lock) prevents true multi-threaded CPU parallelism.
            Async is great for I/O but Python isn't where you write trading
            engines.
          </li>
        </ul>

        <h2>Python 2 vs Python 3</h2>
        <p>
          Python 2 was EOL'd in January 2020. Every modern project uses
          Python 3 (current: 3.13 as of this writing). The two are not
          source-compatible — Python 2 code will not run in Python 3
          unchanged. If you see an old StackOverflow answer with{" "}
          <code>print "hi"</code> (no parens) — that's Python 2. Skip it.
        </p>
        <p>
          When this curriculum says "Python," it means Python 3.{" "}
          <strong>Always Python 3.</strong>
        </p>

        <h2>The design philosophy — the Zen of Python</h2>
        <p>
          Type <code>import this</code> into a Python interpreter and it
          prints "The Zen of Python" — 19 design principles that shape the
          language and idiomatic code. The most relevant ones for you:
        </p>
        <ul>
          <li><em>Readability counts.</em></li>
          <li><em>There should be one — and preferably only one — obvious way to do it.</em></li>
          <li><em>Explicit is better than implicit.</em></li>
          <li><em>Errors should never pass silently. Unless explicitly silenced.</em></li>
          <li><em>If the implementation is hard to explain, it's a bad idea.</em></li>
        </ul>
        <p>
          When you're reading a Python file an agent produced and something
          feels "weird," it's usually weird because it violates these. A
          well-written Python program reads almost like English. If you have
          to squint, the code probably has a problem.
        </p>

        <h2>What a Python file looks like, structurally</h2>
        <p>
          Python files end in <code>.py</code>. They contain a mix of
          imports, function definitions, class definitions, and "module-level"
          code that runs when the file is imported or executed.
        </p>

        <AnnotatedCode
          filename="hello.py — a typical small Python file"
          lines={[
            { code: '"""Greet the world. A doctring is the first line."""',  note: "module docstring — convention for top-of-file" },
            { code: 'import sys',                                            note: "import a standard-library module" },
            { code: 'from datetime import datetime',                          note: "import a specific thing from a module" },
            { code: '',                                                       note: "" },
            { code: 'GREETING = "Hello"',                                    note: "module-level constant (caps by convention)" },
            { code: '',                                                       note: "" },
            { code: 'def greet(name: str) -> str:',                           note: "function definition; the ':' opens an indented block" },
            { code: '    """Return a greeting line."""',                     note: "indented with 4 spaces — Python REQUIRES indentation" },
            { code: '    when = datetime.now().strftime("%H:%M")',           note: "" },
            { code: '    return f"{GREETING}, {name}! It is {when}."',       note: "f-string — interpolated formatting" },
            { code: '',                                                       note: "" },
            { code: 'if __name__ == "__main__":',                            note: "the 'run as script' guard — Phase 2.2 explains" },
            { code: '    name = sys.argv[1] if len(sys.argv) > 1 else "World"', note: "read CLI arg or default" },
            { code: '    print(greet(name))',                                 note: "print to stdout" },
          ]}
        />

        <h2>Indentation IS the syntax</h2>
        <p>
          This is the single most surprising thing about Python coming from
          other languages: blocks are defined by indentation, not braces.
          Where C/JS/Java use <code>{"{ }"}</code>, Python uses leading
          whitespace.
        </p>
        <p>
          The rules:
        </p>
        <ul>
          <li>Every line in a block must be indented to the same level.</li>
          <li>The standard is <strong>4 spaces per level</strong>. Never tabs in modern Python (set your editor to insert spaces).</li>
          <li>Mixing tabs and spaces is a runtime error.</li>
          <li>Wrong indentation = wrong meaning, or a syntax error.</li>
        </ul>
        <p>
          This forces consistent visual structure — you cannot have ugly
          indentation in valid Python. It also means copy-pasting code from
          a webpage occasionally breaks because the whitespace got mangled.
        </p>

        <h2>The Python interpreter</h2>
        <p>
          When you install Python, you get a program called <code>python</code>{" "}
          (or <code>python3</code> on some systems). Two ways to use it:
        </p>
        <ol>
          <li>
            <strong>Run a file.</strong>{" "}
            <code>python hello.py</code> reads the file and executes it
            top to bottom.
          </li>
          <li>
            <strong>The REPL.</strong> Run <code>python</code> with no
            arguments and you get an interactive prompt where you type one
            line at a time and see results. The REPL is your best
            experimentation tool — agents use it too, just internally.
          </li>
        </ol>

        <h2>CPython, PyPy, Pyodide — multiple implementations</h2>
        <p>
          What we call "Python" is usually <strong>CPython</strong> — the
          reference implementation written in C. There are others:
        </p>
        <ul>
          <li>
            <strong>CPython</strong> — the default. When in doubt, this.
          </li>
          <li>
            <strong>PyPy</strong> — a JIT-compiling Python that's much
            faster on pure-Python code but slower to start. Used when raw
            Python speed matters.
          </li>
          <li>
            <strong>MicroPython / CircuitPython</strong> — Python on
            microcontrollers (Raspberry Pi Pico, etc).
          </li>
          <li>
            <strong>Pyodide</strong> — CPython compiled to WebAssembly so it
            runs in browsers. <em>This is what you're about to use in the
            playground below.</em>
          </li>
        </ul>

        <h2>Your first taste — a live Python REPL</h2>
        <p>
          We haven't taught syntax yet, but Python is the kind of language
          where "guess what this does" usually works. Below is a real Python
          interpreter running in this very page (Pyodide — Python on
          WebAssembly). Mess with it. Run things. The next lesson teaches the
          mechanics; for now, just confirm Python is real and reachable.
        </p>
        <p>Suggested experiments after you click <strong>run</strong>:</p>
        <ul>
          <li>Change <code>name</code> to your own.</li>
          <li>Add another <code>print(...)</code> on a new line.</li>
          <li>Try <code>print(2 + 2)</code>, <code>print(2 ** 10)</code>, <code>print(len("CodeLabOS"))</code>.</li>
          <li>Type <code>import this</code> and run — see the Zen for yourself.</li>
        </ul>

        <PythonPlayground
          title="First Python in your browser"
          prompt={<>Click <strong>run</strong>. Edit anything. Run again. You're not graded on this one — this is the "is Python real?" sanity check.</>}
          initialCode={`# This is a Python comment — hash means "ignore this line."

name = "Sanchit"           # name is a string (text)
year = 2026                # year is an integer (whole number)

# f-strings let you interpolate values into a string.
print(f"Hello, {name}.")
print(f"The year is {year}.")
print(f"In {2030 - year} years it will be 2030.")

# Try editing the values above and clicking run again.
# Or try one of these on a fresh line:
#     print(2 ** 10)            # 1024 — exponentiation
#     print(len("CodeLabOS"))   # 9   — length of a string
#     print("py" * 5)           # pypypypypy
`}
        />

        <h2>The vocabulary you just used (and will see constantly)</h2>
        <table>
          <thead><tr><th>Term</th><th>What it means</th></tr></thead>
          <tbody>
            <tr><td><code>print()</code></td><td>Write text to standard output. The most-used Python builtin.</td></tr>
            <tr><td><strong>variable</strong></td><td>A name bound to a value. <code>name = "Ada"</code> binds "Ada" to the name <code>name</code>.</td></tr>
            <tr><td><strong>string</strong></td><td>Text. Wrapped in quotes: <code>"hello"</code> or <code>'hello'</code>.</td></tr>
            <tr><td><strong>integer</strong></td><td>A whole number: <code>42</code>, <code>2026</code>, <code>-7</code>.</td></tr>
            <tr><td><strong>float</strong></td><td>A decimal number: <code>3.14</code>, <code>0.5</code>.</td></tr>
            <tr><td><strong>f-string</strong></td><td>A string with embedded expressions: <code>f"value is {`{x}`}"</code>. The <code>f</code> prefix matters.</td></tr>
            <tr><td><strong>comment</strong></td><td>Anything after <code>#</code> on a line is ignored at runtime.</td></tr>
            <tr><td><strong>function call</strong></td><td><code>print(...)</code> — the parentheses say "do this thing with these arguments."</td></tr>
          </tbody>
        </table>
        <p>
          Lesson 39 (next) goes deep on variables and types. Lesson 40
          covers operators and expressions. Lesson 41 covers if/else.
          From lesson 42 onward you'll be writing real Python every lesson.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "requirements.txt or pyproject.toml", context: "The Python equivalent of package.json. Lists every dependency the project needs." },
            { file: "venv/ or .venv/", context: "A project-local Python install. Always gitignored. Lesson 57 goes deep." },
            { file: "*.ipynb (Jupyter notebooks)", context: "Interactive Python documents — code cells + output + markdown. Standard for data science and AI experimentation." },
            { context: "When your AI agent says 'I'll use openai-python' or 'I'll use FastAPI' — both are Python libraries from PyPI." },
            { file: "shebang #!/usr/bin/env python3", context: "First line of executable Python scripts on Unix. Tells the OS which interpreter to use." },
            { context: "When you see `__init__.py` files in a folder — that folder is a Python package (a directory you can import from)." },
            { file: "if __name__ == '__main__':", context: "The 'run as script vs. import as module' guard. You'll see this in almost every Python entry point." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Using Python 2 examples from old tutorials",
            body: (
              <>
                Stack Overflow has 15 years of answers. Pre-2020 ones often
                show Python 2 syntax — <code>print "hello"</code>,{" "}
                <code>xrange</code>, integer division gotchas. Pasting them
                into Python 3 either errors immediately or silently does the
                wrong thing.
              </>
            ),
          }}
          good={{
            title: "Filter by 'python 3' or recent year; verify in a REPL",
            body: (
              <>
                On Stack Overflow filter by tag, prefer answers with recent
                dates. Better: paste any unfamiliar one-liner into a fresh
                REPL and see if it runs. The REPL is the fastest "does this
                actually work?" oracle Python provides.
              </>
            ),
          }}
          why={
            <>
              Python 2 is dead but its corpse litters the internet. An AI
              agent occasionally regurgitates Python 2 patterns when its
              training data leaned old. The orchestrator's habit: read every
              line for "is this 2 or 3?" until it's automatic.
            </>
          }
        />

        <AntiPattern
          bad={{
            title: "Tabs for indentation (or mixed tabs and spaces)",
            body: (
              <>
                The agent's editor inserts tabs. Yours inserts spaces. The
                resulting file mixes them. Python raises{" "}
                <code>TabError: inconsistent use of tabs and spaces</code>{" "}
                — or worse, runs but with the wrong block structure.
              </>
            ),
          }}
          good={{
            title: "4 spaces, always. Configure your editor to insert spaces on Tab.",
            body: (
              <>
                PEP 8 (Python's style guide) says 4 spaces. VS Code and most
                editors have a setting "insert spaces instead of tabs" —
                turn it on globally. Many projects also ship an{" "}
                <code>.editorconfig</code> file that enforces this.
              </>
            ),
          }}
          why={
            <>
              Indentation is syntax in Python. Two ways to express the same
              indentation level → ambiguous code. The community settled on
              "spaces, four of them" 20 years ago. Don't fight it.
            </>
          }
        />

        <AntiPattern
          bad={{
            title: "Picking Python for the wrong job",
            body: (
              <>
                The agent suggests writing a high-frequency trading engine,
                a mobile app, or a browser frontend in Python. None of those
                are Python's strengths. The result is fragile or won't
                deploy.
              </>
            ),
          }}
          good={{
            title: "Match the language to the job",
            body: (
              <>
                Web frontends → TypeScript. Mobile → Swift / Kotlin / React
                Native. AI/ML, data, scripts, web backends, automation →
                Python. The agent should justify language choice; you
                should be able to push back when the choice is wrong.
              </>
            ),
          }}
          why={
            <>
              "Use the right tool" is a basic orchestrator move. Python is
              dominant in five domains and weak in three. Knowing the map
              prevents months of fighting the language.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={38}
          questions={[
            {
              kind: "mcq",
              prompt:
                "Which best describes Python as a language?",
              options: [
                "Compiled, low-level, statically-typed.",
                "Interpreted, high-level, dynamically-typed, multi-paradigm, designed around readability.",
                "Browser-only, single-paradigm.",
                "Embedded systems only.",
              ],
              answer: 1,
              explanation:
                "Python is high-level (no manual memory), dynamically typed (variables don't declare types), interpreted (no separate compile step you wait on), multi-paradigm (OO, functional, procedural), and explicitly readability-first.",
            },
            {
              kind: "multi",
              prompt:
                "In which of these domains is Python a dominant or default choice?",
              options: [
                "AI / ML",
                "Browser frontends",
                "Native iOS apps",
                "Scripts and automation",
                "Data engineering and analysis",
                "Web backends (FastAPI, Django)",
                "High-frequency trading engines",
              ],
              answer: [0, 3, 4, 5],
              explanation:
                "Strong: AI/ML, scripts, data, web backends. Weak: browser frontends, mobile, ultra-low-latency systems.",
            },
            {
              kind: "mcq",
              prompt:
                "Why does Python's slow execution speed not matter much for AI/ML work?",
              options: [
                "AI is patient.",
                "The heavy lifting (matrix math, GPU calls) happens in compiled C/CUDA inside libraries like NumPy and PyTorch. Python is the lightweight glue layer.",
                "Python is actually fast.",
                "GPUs run Python directly.",
              ],
              answer: 1,
              explanation:
                "Python's slowness is irrelevant when the bottleneck is a GPU kernel. Most numeric Python code is dispatching to compiled libraries, not running pure Python.",
            },
            {
              kind: "fill",
              prompt:
                "What's the file extension of a Python source file?",
              answers: [".py", "py"],
              explanation:
                ".py — the universal Python file extension. (Notebooks are .ipynb. Compiled bytecode is .pyc.)",
            },
            {
              kind: "mcq",
              prompt:
                "Which Python version should every new project use in 2026?",
              options: [
                "Python 2.7",
                "Python 3 (e.g. 3.11, 3.12, 3.13)",
                "Doesn't matter",
                "Whichever the agent picks",
              ],
              answer: 1,
              explanation:
                "Python 2 was EOL'd in January 2020. Always 3. Always.",
            },
            {
              kind: "fill",
              prompt:
                "What's the standard indentation in idiomatic Python (PEP 8)?",
              answers: ["4 spaces", "four spaces", "4"],
              explanation:
                "4 spaces. Not tabs. Mixing is a runtime error.",
            },
            {
              kind: "mcq",
              prompt:
                "An AI agent's Python file has lines that start with `print \"hi\"` (no parentheses) and uses `xrange`. What's going on?",
              options: [
                "It's a different language.",
                "Those are Python 2 patterns. They won't run in Python 3. Reject and ask for Python 3 code.",
                "Those are typos.",
                "Python supports both.",
              ],
              answer: 1,
              explanation:
                "`print` is a function in Python 3 (needs parens). `xrange` doesn't exist (use `range`). Classic Python 2 fingerprint.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are Python's standard package / dependency files (one or more may exist in a project)?",
              options: [
                "requirements.txt",
                "pyproject.toml",
                "package.json",
                "Pipfile",
                "yarn.lock",
              ],
              answer: [0, 1, 3],
              explanation:
                "requirements.txt is classic. pyproject.toml is modern. Pipfile (from pipenv) is an older alternative. package.json/yarn.lock are JS, not Python.",
            },
            {
              kind: "fill",
              prompt:
                "What's the name of the design philosophy listing 19 principles you can read by running `import this`?",
              answers: ["Zen of Python", "the zen of python", "zen of python", "the Zen of Python"],
              explanation:
                "The Zen of Python — written by Tim Peters. The unofficial Python culture document.",
            },
            {
              kind: "mcq",
              prompt:
                "What is Pyodide?",
              options: [
                "A Python package manager.",
                "An IDE.",
                "CPython compiled to WebAssembly so it can run inside web browsers — what powers the live playground on this page.",
                "A code formatter.",
              ],
              answer: 2,
              explanation:
                "Pyodide = Python in the browser. Real CPython, ~10MB of WASM, no server needed.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
