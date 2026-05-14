import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson04() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          When you say "run this code," the computer does a sequence of very
          specific things. Knowing that sequence is how you understand
          compilation errors, interpreter crashes, "command not found", build
          systems, and why some languages have a "build step" and others don't.
          Without it, half your debugging will be cargo-cult guessing.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>How does a file of source code become a running program?</>}
          back={
            <p className="text-center text-lg">
              Source code is text. The computer can only execute{" "}
              <strong>machine code</strong> (raw CPU instructions). Something has
              to translate text → instructions. That something is either a{" "}
              <strong>compiler</strong> (translate once, run forever) or an{" "}
              <strong>interpreter</strong> (translate line by line, every time).
            </p>
          }
        />

        <Diagram caption="Two paths from source to running program. Compiled languages do the heavy work up front. Interpreted languages do it on demand.">
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
            <div className="space-y-2">
              <div className="marker text-center">compiled (C, Go, Rust)</div>
              <DBox label="source.c" tone="muted" />
              <div className="flex justify-center"><DArrow direction="down" label="compiler" /></div>
              <DBox label="binary executable" tone="accent" />
              <div className="flex justify-center"><DArrow direction="down" label="run" /></div>
              <DBox label="running process" tone="info" />
            </div>
            <div className="space-y-2">
              <div className="marker text-center">interpreted (Python, JS)</div>
              <DBox label="script.py" tone="muted" />
              <div className="flex justify-center"><DArrow direction="down" label="interpreter (python)" /></div>
              <DBox label="running process" tone="info" />
            </div>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The CPU only speaks machine code</h2>
        <p>
          A CPU is a chunk of silicon with a fixed set of instructions it
          understands — add, compare, jump, load from RAM, store to RAM. These
          instructions are just numbers. The CPU has no idea what "for loop" or
          "function" is. That's a fiction for human convenience.
        </p>

        <h2>Two ways to bridge the gap</h2>

        <h3>Compilers — translate once, run forever</h3>
        <p>
          A compiler reads your source code <em>before</em> you run it and emits
          a file of machine code (a "binary" or "executable"). Running the
          program is just feeding that binary to the CPU.
        </p>
        <p>
          Languages that work this way: <strong>C, C++, Go, Rust</strong>.
          They're fast at runtime because the translation already happened.
          They have a "build step" — you run a compiler before you can run the
          program.
        </p>

        <h3>Interpreters — translate as you go</h3>
        <p>
          An interpreter is a program that reads your source code at runtime,
          line by line, and immediately performs the corresponding actions on
          the CPU.
        </p>
        <p>
          Languages that work this way: <strong>Python, JavaScript, Ruby</strong>.
          There's no build step — you just run <code>python script.py</code>{" "}
          and the Python interpreter handles the rest. The trade-off:
          slower at runtime, because translation is happening every time.
        </p>

        <h3>The blurry middle: bytecode and JIT</h3>
        <p>
          Most modern "interpreted" languages cheat. Python compiles your code
          to an intermediate form called <strong>bytecode</strong> (the{" "}
          <code>.pyc</code> files you'll see), which is then interpreted.
          JavaScript engines use <strong>JIT</strong> (Just-In-Time) compilation
          — they interpret first, then compile hot code paths to native machine
          code on the fly.
        </p>

        <h2>The "build step" — what is it?</h2>
        <p>
          For compiled languages, the build step is the compilation. For modern
          JS/TS projects, it's a bit different: the build step turns your
          source (TypeScript, JSX, SCSS, etc.) into <strong>plain JavaScript
          and CSS</strong> the browser can run. The browser is the interpreter;
          the build step prepares the food. We'll go deep on this in Phase 6.
        </p>

        <h2>"Command not found"</h2>
        <p>
          When you type <code>python script.py</code>, the OS searches for a
          program named <code>python</code> in a list of folders called the
          <strong> PATH</strong>. If it can't find one, you get the universally
          loved <code>command not found</code>. We'll cover this exact error in
          lesson 10.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "npm run build", context: "Triggers a project's build step. Source → optimized files ready to ship." },
            { file: "node server.js", context: "Tells the Node.js interpreter to run a JS file." },
            { file: "python manage.py", context: "Same idea — feeding a script to the Python interpreter." },
            { file: ".pyc files", context: "Python bytecode. Auto-generated cache, safe to delete." },
            { context: "When an agent says 'we'll need to recompile' — they mean re-run the build/compile step." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Skipping the build step before deploy",
            body: (
              <>
                The agent commits source code straight to production and tries
                to run it. The server has Node but not TypeScript installed.
                Crash.
              </>
            ),
          }}
          good={{
            title: "Build in CI, deploy the build artifact",
            body: (
              <>
                CI runs <code>npm run build</code>, produces optimized output,
                and that output is what's deployed. The server runs the
                finished product — never the raw source.
              </>
            ),
          }}
          why={
            <>
              Production servers should not be compiling code at runtime. It's
              slow, fragile (compiler may not be installed), and gives attackers
              extra surface area. Build once in a controlled environment, ship
              the artifact.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={4}
          questions={[
            {
              kind: "mcq",
              prompt:
                "What is the fundamental difference between a compiled language and an interpreted language?",
              options: [
                "Compiled languages are written in different characters.",
                "Compiled languages are translated to machine code ahead of time; interpreted languages are translated as they run.",
                "Compiled languages are only for servers.",
                "There is no difference, the words are interchangeable.",
              ],
              answer: 1,
              explanation:
                "That's the core distinction. Compile = ahead of time. Interpret = at runtime, line by line.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these languages are commonly described as 'compiled'?",
              options: ["C", "Python", "Go", "Rust", "JavaScript"],
              answer: [0, 2, 3],
              explanation:
                "C, Go, and Rust are compiled. Python and JavaScript are interpreted (though both use bytecode/JIT under the hood).",
            },
            {
              kind: "fill",
              prompt:
                "Modern Python compiles your `.py` files to an intermediate cached form. What's the file extension you'll see in `__pycache__` folders?",
              answers: [".pyc", "pyc"],
              explanation:
                "Python bytecode. The interpreter reads these to skip re-parsing the same source on every run.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent commits TypeScript source files directly to production. The server has Node.js but no TypeScript. What's the orchestrator's pushback?",
              options: [
                "Install TypeScript on the server.",
                "Add a `build` step in CI that compiles TS to JS. Deploy the compiled JS only.",
                "Switch to a different agent.",
                "Reboot the server.",
              ],
              answer: 1,
              explanation:
                "Don't compile on prod. Compile in CI, deploy the finished JS. This is standard practice and what your agent should be doing.",
            },
            {
              kind: "mcq",
              prompt:
                "You type `node app.js` and get `command not found: node`. What does that tell you?",
              options: [
                "The file `app.js` doesn't exist.",
                "Node.js is broken.",
                "The OS couldn't find a program named `node` in any of the folders on the PATH. Node may not be installed, or the install is missing from PATH.",
                "Your computer needs a reboot.",
              ],
              answer: 2,
              explanation:
                "This error is always about the PATH. The OS searches a list of folders for the program named 'node' and didn't find one.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
