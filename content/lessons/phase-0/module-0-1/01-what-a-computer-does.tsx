import { LayerSection } from "@/components/lesson/LayerSection";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson01() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          You will spend the next year reading the output of AI agents that build
          on top of computers. If you don't have a clear mental model of what a
          computer is actually doing — moving numbers between three places — every
          decision an agent makes about performance, memory, storage, or speed
          will feel like magic. <strong>Magic is unreviewable.</strong> By the end
          of this lesson you will never again read "this is slow because it's
          hitting the disk" without knowing exactly what that means.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={
            <>What does a computer <em>actually</em> do, in one sentence?</>
          }
          back={
            <p className="text-center text-lg">
              A computer is a machine that <strong>moves numbers between three
              places — the CPU, the RAM, and storage — really, really fast.</strong>{" "}
              Everything else (apps, websites, AI) is built on top of that one fact.
            </p>
          }
        />

        <Diagram caption="The three places. Every program ever written is some sequence of moves between these boxes.">
          <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
            <DBox tone="accent" label="CPU" sub="thinks" />
            <DBox tone="info"   label="RAM" sub="remembers (for now)" />
            <DBox tone="phase"  label="Storage" sub="remembers (forever)" />
          </div>
          <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mt-4">
            <span className="text-center text-[11px] text-ink-mute font-mono">
              ~1 ns per op
            </span>
            <span className="text-center text-[11px] text-ink-mute font-mono">
              ~100 ns per op
            </span>
            <span className="text-center text-[11px] text-ink-mute font-mono">
              ~1,000,000 ns per op
            </span>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The three places, in plain English</h2>

        <p>
          A computer has three things that hold data, and they trade off the same
          way every time:
        </p>

        <h3>1. The CPU — the part that thinks</h3>
        <p>
          The <strong>CPU</strong> (Central Processing Unit) is a small chip,
          usually a square the size of a postage stamp. It does <em>one thing</em>:
          it reads instructions and performs them — add these two numbers,
          compare these two values, copy this byte to that location. It does this
          billions of times per second. But the CPU can only act on data that is
          right in front of it. It cannot reach across the computer for data
          that lives somewhere else.
        </p>

        <h3>2. RAM — the workspace</h3>
        <p>
          <strong>RAM</strong> (Random Access Memory) is the place data lives
          while a program is running. Think of it as the desk you spread your work
          out on. The CPU reaches over to RAM constantly to grab the numbers it's
          about to operate on. RAM is fast — maybe 100× slower than the CPU's own
          internal memory, but still extremely fast in human terms.
        </p>
        <p>
          The catch: RAM is <strong>volatile</strong>. When the power goes off,
          everything in RAM is gone. That's why your unsaved work in a Google
          Doc evaporates if your laptop dies.
        </p>

        <h3>3. Storage — the long-term filing cabinet</h3>
        <p>
          <strong>Storage</strong> (your SSD or hard drive) is where everything
          that needs to survive a reboot lives — your photos, your installed apps,
          your saved files. It's enormous compared to RAM (often 100× larger)
          and persistent (data stays when power is off). But it's slow — for the
          CPU, reaching to storage is like getting up from your desk, walking to
          the basement, and pulling a file from a cabinet.
        </p>

        <h2>Why the speed gaps matter</h2>
        <p>
          If a CPU operation takes 1 nanosecond, then in proportional human time:
        </p>
        <ul>
          <li>An operation inside the CPU's own cache → 1 second</li>
          <li>An operation reading RAM → about 1.5 minutes</li>
          <li>An operation reading from an SSD → about a week</li>
          <li>An operation reading from a hard disk → about 4 months</li>
          <li>An operation over the internet → multiple years</li>
        </ul>
        <p>
          When an engineer says "this code is slow because it's hitting the
          database," they mean: instead of grabbing data that was already in
          RAM (1.5 minutes), the code went to disk or across the network
          (a week or years).
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <h2>Where this shows up when an AI agent builds your project</h2>

        <WhereYoullSeeThis
          items={[
            {
              context:
                "An agent says 'we should cache this response in Redis' — Redis lives in RAM. That's the agent moving slow disk lookups into fast RAM lookups.",
            },
            {
              context:
                "An agent says 'use an index on this column' — an index is a RAM-friendly shortcut so the database doesn't have to scan the whole disk.",
            },
            {
              file: "process.memoryUsage()",
              context:
                "Node.js code that prints RAM usage. If this number grows forever, the app has a memory leak — eventually crashes when RAM runs out.",
            },
            {
              file: "/dev/null",
              context:
                "A special path on Unix. Writing to it discards data instantly. Used in scripts to throw away output without touching storage.",
            },
            {
              context:
                "When an AI agent loads a 2GB file 'into memory' — it's loading the file from storage into RAM. If RAM is only 1GB, the program will crash. Catch this.",
            },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Reading the same file from disk a hundred times",
            body: (
              <>
                An AI agent writes a function that opens a config file from disk
                every time it's called. The function is called inside a hot loop
                10,000 times. Each call takes a "week" of CPU-relative time.
              </>
            ),
          }}
          good={{
            title: "Read once, keep in memory",
            body: (
              <>
                Load the file once, store it in a variable (RAM), and reuse that
                variable. Now 9,999 of those calls take "1.5 minutes" instead of
                a week.
              </>
            ),
          }}
          why={
            <>
              This is the single most common shape of "why is this slow?" The
              fix is almost always: stop touching slower storage. Whenever an
              agent's code reads from disk or hits a database in a loop, your
              instinct should be: <em>can we do this once and reuse?</em>
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={1}
          questions={[
            {
              kind: "mcq",
              prompt:
                "An AI agent says, 'I'll cache the user's profile after the first lookup so we don't have to hit the database again.' What is being moved, and from where to where?",
              options: [
                "The data is being moved from the CPU's cache to RAM.",
                "The data is being moved from slow storage (the database) into fast RAM, so the next read is much faster.",
                "The data is being moved from RAM to storage to make it permanent.",
                "The data is being moved from RAM into the CPU itself.",
              ],
              answer: 1,
              explanation:
                "Caching = keeping a copy in fast memory (RAM) so we don't have to walk to the slow cabinet (disk/DB) again.",
            },
            {
              kind: "mcq",
              prompt:
                "Your laptop crashes mid-edit. You haven't saved. What is most likely lost?",
              options: [
                "Everything you've installed.",
                "Your operating system.",
                "The unsaved changes that were only in RAM.",
                "Your photos in cloud backup.",
              ],
              answer: 2,
              explanation:
                "RAM is volatile — it vanishes without power. Anything that hadn't been saved to storage is gone.",
            },
            {
              kind: "multi",
              prompt:
                "Select every statement that is TRUE about the three places (CPU, RAM, storage).",
              options: [
                "The CPU is much faster than RAM, which is much faster than storage.",
                "RAM keeps data when the computer is off.",
                "Storage is typically much larger than RAM.",
                "An AI agent should always do work on disk to keep things simple.",
              ],
              answer: [0, 2],
              explanation:
                "1 and 3 are right. 2 is wrong (RAM is volatile). 4 is wrong (disk is the slowest place — usually the LAST resort, not the first).",
            },
            {
              kind: "fill",
              prompt:
                "If reading from the CPU's internal cache takes 1 second in human terms, reading from RAM takes roughly _______ minutes.",
              answers: ["1.5", "one and a half", "1.5 minutes", "1-2"],
              placeholder: "a number",
              explanation:
                "RAM is about 100× slower than CPU cache. That ratio translates to ~1.5 minutes in human time if cache = 1 second.",
            },
            {
              kind: "mcq",
              prompt:
                "An AI agent writes code that reads a 5GB CSV file 'into memory' on a server that has 4GB of RAM. What is the orchestrator's pushback?",
              options: [
                "'Looks good — just run it.'",
                "'The file won't fit in RAM. We'll need to stream/process it in chunks, or run on a bigger machine.'",
                "'Convert the file to JSON first, it will be smaller.'",
                "'Move the file to storage to fix this.'",
              ],
              answer: 1,
              explanation:
                "RAM is finite. You can't load more into RAM than RAM holds. Streaming reads the file a piece at a time so only a small chunk is in RAM at any moment.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
