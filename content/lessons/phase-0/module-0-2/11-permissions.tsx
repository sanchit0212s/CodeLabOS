import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson11() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every deploy, every Docker image, every "permission denied" error
          touches this lesson. Unix permissions look cryptic at first (
          <code>-rw-r--r--</code>) but it's an extremely simple system once
          someone decodes it for you. Once you can read these flags, you can
          audit security decisions an agent makes.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={
            <>What does <code>-rwxr-xr--</code> mean on a file?</>
          }
          back={
            <p className="text-center text-lg">
              Three groups of three: <strong>owner / group / everyone else</strong>.
              Each group gets <strong>read, write, execute</strong> bits. So
              <code>rwxr-xr--</code> = owner can read+write+execute, group
              members can read+execute, everyone else can only read.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The structure</h2>
        <p>
          When you run <code>ls -l</code>, each line starts with 10 characters:
        </p>
        <pre>{`-rwxr-xr--   1   alice  staff   1234   May 14 09:22   script.sh

│└─┴─┴─┐
│ owner│  group  others
type
`}</pre>
        <ul>
          <li><strong>1st char</strong>: type. <code>-</code> = file, <code>d</code> = directory, <code>l</code> = symlink.</li>
          <li><strong>2-4</strong>: what the OWNER can do (r/w/x).</li>
          <li><strong>5-7</strong>: what the GROUP can do.</li>
          <li><strong>8-10</strong>: what EVERYONE ELSE can do.</li>
        </ul>

        <h2>What r, w, x mean</h2>
        <ul>
          <li><strong>r</strong> (read) — can view the file's contents (or list a directory).</li>
          <li><strong>w</strong> (write) — can modify the file (or add/remove files in a directory).</li>
          <li><strong>x</strong> (execute) — can run the file as a program (or `cd` into the directory).</li>
        </ul>

        <h2>chmod — changing permissions</h2>
        <TerminalSim
          title="chmod basics"
          lines={[
            { kind: "cmd", text: "ls -l deploy.sh" },
            { kind: "out", text: "-rw-r--r--  1 you you  1432 May 14 09:00 deploy.sh", annotate: "not executable" },

            { kind: "cmd", text: "chmod +x deploy.sh", annotate: "add execute for everyone" },
            { kind: "cmd", text: "ls -l deploy.sh" },
            { kind: "out", text: "-rwxr-xr-x  1 you you  1432 May 14 09:00 deploy.sh", annotate: "now executable" },

            { kind: "cmd", text: "./deploy.sh", annotate: "now it runs" },
          ]}
        />

        <h3>The numeric form (advanced, but you'll see it)</h3>
        <p>
          Each group's permissions can be expressed as a single octal digit:
          r=4, w=2, x=1, sum them up.
        </p>
        <ul>
          <li><code>chmod 755 file</code> → owner: 7 (rwx), group: 5 (rx), others: 5 (rx). Common for scripts.</li>
          <li><code>chmod 644 file</code> → owner: 6 (rw), group: 4 (r), others: 4 (r). Common for regular files.</li>
          <li><code>chmod 600 file</code> → owner: 6 (rw), no one else. Common for secrets like SSH keys.</li>
        </ul>

        <h2>chown — changing the owner</h2>
        <p>
          <code>chown user:group file</code> changes who owns a file. Usually
          requires <code>sudo</code>. You'll see this in Dockerfiles and
          deploy scripts.
        </p>

        <h2>sudo — temporary superpowers</h2>
        <p>
          <code>sudo</code> means "run this command as the root (superuser)
          user." It's how you do things your normal user can't, like
          installing system packages. Use sparingly. Read the command twice
          before pressing enter.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "chmod 600 ~/.ssh/id_rsa", context: "Locking your SSH private key. SSH refuses to use a key if it's readable by anyone but you." },
            { file: "chmod +x build.sh", context: "Making a shell script executable so you can run `./build.sh`." },
            { context: "An agent says 'permission denied' when reading a file — either the file's permissions block the user, or they're in the wrong user." },
            { file: "USER nobody (in Dockerfile)", context: "Switching the container's running user from root to an unprivileged one — defense in depth." },
            { context: "When SSH refuses your key with 'WARNING: UNPROTECTED PRIVATE KEY FILE!' — the file permissions are too open. `chmod 600` fixes it." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "chmod 777 to make a permission error 'go away'",
            body: (
              <>
                Permission denied? The agent suggests{" "}
                <code>chmod -R 777 /app</code>. Now every file is readable,
                writable, executable by everyone — including any attacker who
                gets in.
              </>
            ),
          }}
          good={{
            title: "Diagnose, then set the minimum needed",
            body: (
              <>
                Figure out what user is running and what permissions it
                actually needs. Usually <code>chmod 755</code> for executables,{" "}
                <code>chmod 644</code> for data files, owned by the right
                user.
              </>
            ),
          }}
          why={
            <>
              `chmod 777` is the digital equivalent of leaving every door in
              your office unlocked. Sometimes it makes the immediate symptom
              disappear; it creates much bigger problems later.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={11}
          questions={[
            {
              kind: "mcq",
              prompt: "In `-rwxr-xr--`, what can a user OUTSIDE the file's group do?",
              options: ["Nothing.", "Read only.", "Read and execute.", "Read, write, execute."],
              answer: 1,
              explanation:
                "The last three chars (`r--`) are for 'others'. Read only.",
            },
            {
              kind: "fill",
              prompt:
                "What flag do you pass to `chmod` to add execute permission for everyone in one command?",
              answers: ["+x", "x"],
              placeholder: "e.g. +X",
              explanation: "`chmod +x file` is the common idiom.",
            },
            {
              kind: "mcq",
              prompt: "What does `chmod 600 file` mean?",
              options: [
                "Everyone can read and write.",
                "The owner can read and write; nobody else can do anything.",
                "Everyone has full access.",
                "The file is encrypted.",
              ],
              answer: 1,
              explanation:
                "6 = rw for owner. 0 = nothing for group, 0 = nothing for others. Standard for SSH private keys.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent fixes a 'permission denied' error by running `chmod -R 777 /app`. What's the orchestrator's response?",
              options: [
                "Approve — it solved the problem.",
                "Reject — that opens the entire app to read/write/execute by everyone. Find the actual permission needed and set it narrowly.",
                "Suggest 'chmod 999' for extra safety.",
                "Rename the files.",
              ],
              answer: 1,
              explanation:
                "777 is a security disaster. Always diagnose first, set least privilege.",
            },
            {
              kind: "mcq",
              prompt:
                "SSH refuses your key with 'UNPROTECTED PRIVATE KEY FILE'. What does this mean?",
              options: [
                "Your key is corrupted.",
                "The file's permissions are too permissive — SSH demands the private key is readable only by you (chmod 600).",
                "Your network is down.",
                "You need to reinstall SSH.",
              ],
              answer: 1,
              explanation:
                "SSH is strict on purpose. A private key that's group- or world-readable could be stolen. Tighten with `chmod 600`.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
