import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { FileTree } from "@/components/interactive/FileTree";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson03() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every AI agent works by writing files. If you can't read a project's
          filesystem, you can't tell what the agent actually built. The
          filesystem is also where every "where did my data go?" debugging
          session lives. A clear mental model here pays back forever.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What are files and folders, really?</>}
          back={
            <p className="text-center text-lg">
              A <strong>file</strong> is just a labeled sequence of bytes on
              disk. A <strong>folder</strong> (or "directory") is a list of files
              and other folders — a way to organize them into a tree. The
              "file system" is the OS's library catalog mapping names to byte
              ranges on the disk.
            </p>
          }
        />

        <div className="my-6">
          <FileTree
            caption="A typical user's home folder. Everything is just bytes — the OS gives them names and arranges them in a tree."
            root={{
              name: "/", kind: "dir", children: [
                { name: "home", kind: "dir", children: [
                  { name: "you", kind: "dir", children: [
                    { name: "Documents", kind: "dir", children: [
                      { name: "resume.pdf", kind: "doc", role: "a sequence of bytes the OS labels 'PDF'" },
                    ]},
                    { name: "projects", kind: "dir", children: [
                      { name: "my-app", kind: "dir", role: "your code lives here" },
                    ]},
                    { name: ".bashrc", kind: "config", role: "shell config (dotfile = hidden by default)" },
                  ]},
                ]},
                { name: "etc",  kind: "dir", role: "system-wide config files" },
                { name: "var",  kind: "dir", role: "logs and changing files live here" },
                { name: "tmp",  kind: "dir", role: "temporary scratch — wiped on reboot" },
                { name: "usr",  kind: "dir", role: "installed programs" },
              ],
            }}
          />
        </div>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The filesystem is a tree</h2>
        <p>
          On Unix-like systems (Linux, macOS), there is one root, written as a
          single forward slash: <code>/</code>. Everything — every file, every
          attached disk, every USB drive — appears somewhere inside that tree.
          (Windows is similar but has multiple roots, like <code>C:\</code> and{" "}
          <code>D:\</code>.)
        </p>

        <h2>Absolute vs. relative paths</h2>
        <p>
          A <strong>path</strong> is the address of a file in the tree.
        </p>
        <ul>
          <li>
            An <strong>absolute path</strong> starts with{" "}
            <code>/</code> and describes the file from the root of the tree
            (e.g. <code>/home/you/projects/my-app/package.json</code>).
          </li>
          <li>
            A <strong>relative path</strong> describes a file relative to where
            you currently are. If you're inside <code>my-app/</code>, then the
            file <code>package.json</code> can simply be written as{" "}
            <code>./package.json</code> or <code>package.json</code>.
          </li>
        </ul>
        <p>Two special shortcuts:</p>
        <ul>
          <li><code>.</code> means "this folder"</li>
          <li><code>..</code> means "the folder above this one"</li>
          <li><code>~</code> means "my home folder" (your personal space)</li>
        </ul>

        <h2>Hidden files</h2>
        <p>
          On Unix, any file or folder whose name starts with a dot (e.g.{" "}
          <code>.gitignore</code>, <code>.env</code>) is{" "}
          <strong>hidden</strong> by default — it doesn't show up in <code>ls</code>{" "}
          or your file explorer. That's it. There's no other magic. They're
          called "dotfiles" and they're where projects store their
          configuration.
        </p>

        <h2>Files have metadata</h2>
        <p>
          Beyond the bytes, every file has metadata: who owns it, who can read
          or modify it, when it was created and modified, and its size. The OS
          uses this for security checks and for tools like search.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "~/.zshrc", context: "Your shell's config. The tilde expands to your home directory." },
            { file: "/var/log/", context: "Linux logs live here. When an agent says 'check the logs', this is often where to look." },
            { file: "./node_modules", context: "Relative path — 'this folder, then node_modules'. Where Node installs dependencies." },
            { file: "../../shared", context: "Go up two folders, then into 'shared'. You'll see this in monorepos." },
            { context: "When you run `ls` and see nothing, but `ls -a` shows .git, .env, .gitignore — those were dotfiles all along." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Hardcoded absolute paths inside source code",
            body: (
              <>
                The agent writes <code>fs.readFile("/Users/sanchit/projects/app/data.json")</code>{" "}
                — works on the agent's idea of your laptop, breaks on the server, breaks on every other developer's machine.
              </>
            ),
          }}
          good={{
            title: "Build paths relative to the project root",
            body: (
              <>
                Use <code>path.join(__dirname, "data.json")</code> or read from a
                config file. The code now works wherever the project is installed.
              </>
            ),
          }}
          why={
            <>
              An absolute path is a promise about the world outside the project.
              Production servers don't have your <code>/Users/sanchit</code>{" "}
              folder. Every hardcoded absolute path is a deployment failure
              waiting to happen.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={3}
          questions={[
            {
              kind: "mcq",
              prompt: "What does the path `..` mean?",
              options: [
                "The current folder.",
                "The folder one level above the current folder.",
                "The user's home folder.",
                "The root of the filesystem.",
              ],
              answer: 1,
              explanation: "`.` is here, `..` is the parent, `~` is home, `/` is root.",
            },
            {
              kind: "mcq",
              prompt:
                "You run `ls` in a folder and see nothing, but you know there's a `.env` file there. Why is it not shown?",
              options: [
                "It's encrypted.",
                "Files starting with a dot are hidden by default. `ls -a` would show it.",
                "The file is corrupted.",
                "Only root users can see it.",
              ],
              answer: 1,
              explanation:
                "Dotfiles are hidden by convention. Use `ls -a` to see them.",
            },
            {
              kind: "multi",
              prompt: "Which of these are ABSOLUTE paths?",
              options: [
                "/etc/hosts",
                "./package.json",
                "/Users/you/projects/app",
                "src/index.tsx",
                "~/.zshrc (with the tilde expanded)",
              ],
              answer: [0, 2, 4],
              explanation:
                "Absolute paths start with `/`. `~` expands to an absolute home path, so #5 counts. The others are relative.",
            },
            {
              kind: "fill",
              prompt:
                "The root of the filesystem on Linux and macOS is written as a single character. What is it?",
              answers: ["/"],
              placeholder: "the character",
              explanation:
                "A forward slash. The whole filesystem is a tree rooted at `/`.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent's code reads from `/Users/agent/data/users.json`. The deploy to your production Linux server fails. Why?",
              options: [
                "The file is too large.",
                "Linux servers don't have a `/Users/agent` folder — that path doesn't exist outside the agent's environment.",
                "JSON is unsupported on Linux.",
                "Production servers can't read files.",
              ],
              answer: 1,
              explanation:
                "Absolute paths are promises about the environment. They almost never survive a move from dev to production.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
