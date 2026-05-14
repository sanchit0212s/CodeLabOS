import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";
import { PythonPlayground } from "@/components/interactive/PythonPlayground";

export default function Lesson39() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Variables and types are the alphabet of Python. Almost every bug
          an AI agent ships in Python is one of three things: wrong type
          (treating a string like a number), unexpected reference (mutating
          something shared), or a silent failure when a value is{" "}
          <code>None</code>. The orchestrator's instinct must be to read
          every line and ask <em>"what type is this, really?"</em>
        </p>
        <p>
          This lesson covers the mechanics deeply enough that you'll catch
          those bugs at a glance. You'll write real Python in five playground
          exercises — by the end you'll have made and read every primitive
          type Python has.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is a variable in Python, really?</>}
          back={
            <p className="text-center text-lg">
              A variable in Python is a <strong>name bound to a value</strong>{" "}
              — not a box that holds the value. The name lives in a
              namespace; the value lives in memory. Assignment{" "}
              (<code>x = 5</code>) makes the name <code>x</code> point at the
              value <code>5</code>. Variables don't have types — values do.
            </p>
          }
        />

        <Diagram caption="Python's variable model. Names point at values. Reassigning a name moves the pointer; it does not change the old value.">
          <div className="font-mono text-[13px] text-ink-dim leading-[1.8]">
            <pre>{`     namespace                         memory
   ┌────────────┐                  ┌──────────┐
   │  x   ──────┼──────▶           │   42     │   (an int)
   ├────────────┤                  ├──────────┤
   │  name ─────┼──────▶           │  "Ada"   │   (a str)
   ├────────────┤                  ├──────────┤
   │  price ────┼──────▶           │  3.99    │   (a float)
   └────────────┘                  └──────────┘`}</pre>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Assignment — the core operation</h2>
        <p>
          The <code>=</code> operator is <strong>assignment</strong>, not
          equality. <code>x = 5</code> reads as "bind the name x to the
          value 5." If <code>x</code> didn't exist, it now does. If it did,
          the name now points somewhere else.
        </p>

        <AnnotatedCode
          filename="assignment basics"
          lines={[
            { code: "x = 5",                       note: "name `x` now points at the integer 5" },
            { code: "x = 10",                      note: "rebinds — `x` now points at 10. The old 5 is unreferenced and garbage-collected." },
            { code: "y = x",                       note: "`y` now points at the SAME value `x` points at (10)" },
            { code: "x = 99",                      note: "rebind `x` only. `y` still points at 10. Names don't chain — only the value matters at the moment of assignment." },
          ]}
        />

        <h2>Naming rules and conventions</h2>
        <p>The rules (enforced by Python):</p>
        <ul>
          <li>Letters, digits, and underscores only.</li>
          <li>Cannot start with a digit. <code>2cool</code> is invalid; <code>cool2</code> is fine.</li>
          <li>Cannot be a reserved word: <code>if</code>, <code>for</code>, <code>None</code>, <code>True</code>, <code>class</code>, <code>def</code>, <code>import</code>, etc.</li>
          <li>Case-sensitive. <code>name</code> and <code>Name</code> are different.</li>
          <li>Unicode names are technically allowed but never used in practice.</li>
        </ul>

        <p>The conventions (enforced by humans / linters):</p>
        <ul>
          <li><code>snake_case</code> — for variables, functions, methods, module names. <strong>The default.</strong></li>
          <li><code>UPPER_SNAKE_CASE</code> — for constants. <code>MAX_RETRIES = 3</code>.</li>
          <li><code>PascalCase</code> — for class names. <code>UserAccount</code>.</li>
          <li><code>_leading_underscore</code> — "internal use; don't touch from outside this module." Soft convention only.</li>
          <li><code>__dunder__</code> — Python-special methods. <code>__init__</code>, <code>__main__</code>, etc. Don't invent your own.</li>
        </ul>

        <h3>Try it</h3>

        <PythonPlayground
          title="Drill: bind your first variables"
          prompt={<>Bind three variables — <code>x</code>, <code>name</code>, and <code>price</code> — to the values shown in the tests. Print each on its own line.</>}
          initialCode={`# Bind:
#   x to the integer 42
#   name to the string "Ada"
#   price to the float 3.99
# Then print each one.

`}
          tests={[
            { name: "x equals 42", expr: "x == 42", hint: "Use plain integer literal: x = 42" },
            { name: "name equals 'Ada'", expr: 'name == "Ada"', hint: "Strings need quotes: name = \"Ada\"" },
            { name: "price equals 3.99", expr: "price == 3.99", hint: "Floats have a decimal point: price = 3.99" },
          ]}
          hints={[
            "Each binding is one line: variable = value.",
            "Strings need quotes around them. Numbers don't. Decimal numbers (floats) have a dot.",
            'Solution: `x = 42`, `name = "Ada"`, `price = 3.99`, then `print(x)`, `print(name)`, `print(price)`.',
          ]}
        />

        <h2>The four primitive types you'll meet first</h2>

        <h3>int — integers</h3>
        <p>
          Whole numbers, positive or negative. Python ints are{" "}
          <strong>arbitrary precision</strong> — they grow as big as memory
          allows, no overflow. <code>10 ** 1000</code> is a valid integer in
          Python.
        </p>

        <h3>float — floating point numbers</h3>
        <p>
          Decimals. Internally IEEE 754 double-precision, the same format
          most languages use. Beware: floats are inexact for many decimal
          values. <code>0.1 + 0.2</code> in Python is{" "}
          <code>0.30000000000000004</code>. Use the <code>decimal</code>{" "}
          module when you need exact money math.
        </p>

        <h3>str — strings</h3>
        <p>
          Text. Sequences of Unicode characters. Wrapped in single quotes
          (<code>'hi'</code>) or double quotes (<code>"hi"</code>) — they're
          equivalent. Triple-quoted strings span multiple lines.
        </p>
        <AnnotatedCode
          filename="strings"
          lines={[
            { code: `s1 = "double quotes"`,                       note: "" },
            { code: `s2 = 'single quotes'`,                       note: "same type, same behavior" },
            { code: `s3 = "She said \\"hi\\""`,                   note: "\\\" escapes a quote inside the same-quote string" },
            { code: `s4 = 'She said "hi"'`,                       note: "no escape needed: use the other quote outside" },
            { code: `multi = """This is a`,                      note: 'triple-quoted = multi-line, newlines preserved' },
            { code: `multi-line string."""`,                     note: "" },
            { code: `name = "Ada"`,                              note: "" },
            { code: `f = f"Hello, {name}!"`,                     note: 'f-string — {name} is replaced with the value' },
            { code: `r = r"C:\\Users\\you"`,                     note: 'r-prefix = raw string, no escape processing — use for regex and Windows paths' },
          ]}
        />

        <h3>bool — booleans</h3>
        <p>
          Two values: <code>True</code> and <code>False</code>.{" "}
          <strong>Capitalized</strong>. Lowercase <code>true</code> is a
          NameError (it's not defined). Coming from JS/Python-2 muscle
          memory, this trips everyone once.
        </p>

        <h3>NoneType — None</h3>
        <p>
          Python's "nothing" / null. There is exactly one <code>None</code>{" "}
          value. Used as default return values, "missing" markers, and
          unset state. Compare with <code>is None</code>, never{" "}
          <code>== None</code>.
        </p>

        <h2>Checking a value's type</h2>
        <ul>
          <li><code>type(x)</code> — returns the type object. <code>type(5)</code> is <code>{`<class 'int'>`}</code>.</li>
          <li><code>isinstance(x, int)</code> — returns True if x is an int (or subclass). The preferred check in production code.</li>
        </ul>

        <h3>Try it</h3>

        <PythonPlayground
          title="Drill: identify the types"
          prompt={<>Bind <code>a</code>, <code>b</code>, <code>c</code>, <code>d</code> so that each is the type the test names. Use any value of that type.</>}
          initialCode={`# Make:
#   a an int
#   b a float
#   c a str
#   d a bool

`}
          tests={[
            { name: "a is an int", expr: "isinstance(a, int) and not isinstance(a, bool)", hint: "Plain whole number, no quotes, no decimal point." },
            { name: "b is a float", expr: "isinstance(b, float)", hint: "Decimal number, e.g. 1.5 or 0.0" },
            { name: "c is a str", expr: "isinstance(c, str)", hint: "Wrap text in quotes." },
            { name: "d is a bool", expr: "isinstance(d, bool)", hint: "True or False (capitalized)." },
          ]}
          hints={[
            "Each variable just needs one value of the right kind. Don't overthink.",
            "Examples: a = 1, b = 1.0, c = \"x\", d = True. Note `bool` is technically a subclass of `int` in Python — the test for `a` filters that out.",
          ]}
        />

        <h2>Type conversion</h2>
        <p>
          Python won't auto-convert types for you (mostly). You have to be
          explicit. The constructors:
        </p>
        <ul>
          <li><code>int("42")</code> → <code>42</code>. <code>int("hi")</code> → ValueError.</li>
          <li><code>float("3.14")</code> → <code>3.14</code>.</li>
          <li><code>str(42)</code> → <code>"42"</code>. Always works.</li>
          <li><code>bool(0)</code> → False. <code>bool("hi")</code> → True. (Truthiness rules below.)</li>
        </ul>

        <p>
          The most common bug in Python: reading user input or JSON, getting
          back a string, and trying to do math on it.{" "}
          <code>"5" + 3</code> raises TypeError. You must explicitly cast:
          <code>int("5") + 3 == 8</code>.
        </p>

        <PythonPlayground
          title="Drill: a string from input, do math"
          prompt={<>You get <code>age_str</code> as a string. Convert it to a number and bind <code>age_next_year</code> to age + 1.</>}
          initialCode={`age_str = "29"   # imagine this came from input() or a JSON API
# Bind age_next_year to next year's age (as an int).
`}
          tests={[
            { name: "age_next_year is 30", expr: "age_next_year == 30", hint: "Cast the string to int first, then add 1." },
            { name: "age_next_year is an int (not a string)", expr: "isinstance(age_next_year, int)", hint: 'Make sure you used int(...). "29" + "1" would give the string "291".' },
          ]}
          hints={[
            "Cast first: int(age_str). Then add 1.",
            "age_next_year = int(age_str) + 1",
          ]}
        />

        <h2>Truthiness — the hidden complexity</h2>
        <p>
          Every value in Python is either "truthy" (acts as True in a
          condition) or "falsy" (acts as False). The rules:
        </p>
        <table>
          <thead><tr><th>Falsy</th><th>Truthy</th></tr></thead>
          <tbody>
            <tr><td><code>False</code></td><td><code>True</code></td></tr>
            <tr><td><code>None</code></td><td>any non-None object</td></tr>
            <tr><td><code>0</code>, <code>0.0</code></td><td>any non-zero number</td></tr>
            <tr><td><code>""</code> (empty string)</td><td>any non-empty string, including <code>"0"</code> or <code>" "</code></td></tr>
            <tr><td><code>[]</code>, <code>{}</code>, <code>set()</code> (empty containers)</td><td>any non-empty container</td></tr>
          </tbody>
        </table>
        <p>
          This is enormously useful (<code>if some_list:</code> means "if not
          empty") and a common source of bugs. The string <code>"0"</code> is
          truthy because it's a non-empty string, not the number zero.
        </p>

        <PythonPlayground
          title="Drill: predict truthiness, then verify"
          prompt={<>Before clicking run: in your head, decide whether each value is truthy or falsy. Then run to check.</>}
          initialCode={`# Each line prints True if the value is truthy, False if falsy.

print(bool(0))           # ?
print(bool(0.0))         # ?
print(bool(""))          # ?
print(bool("0"))         # ?
print(bool(" "))         # ?
print(bool(None))        # ?
print(bool([]))          # ?
print(bool([0]))         # ?
print(bool({}))          # ?
print(bool({"x": 1}))    # ?
`}
        />

        <h2>Integer vs float division — a classic surprise</h2>
        <ul>
          <li>
            <code>/</code> — <strong>true division</strong>. Always returns
            a float. <code>10 / 4</code> is <code>2.5</code>.{" "}
            <code>10 / 2</code> is <code>5.0</code>, not <code>5</code>.
          </li>
          <li>
            <code>//</code> — <strong>floor division</strong>. Integer-style.
            <code>10 // 4</code> is <code>2</code>. <code>-10 // 4</code> is{" "}
            <code>-3</code> (rounds toward negative infinity, not zero).
          </li>
          <li>
            <code>%</code> — <strong>modulo</strong>. <code>10 % 3</code> is{" "}
            <code>1</code>. Useful for "every Nth" patterns.
          </li>
        </ul>
        <p>
          Coming from JS, you'd expect <code>/</code> to do whichever fits.
          Python forces you to pick.
        </p>

        <h2>The reference trap — assignment doesn't copy</h2>
        <p>
          For mutable values (lists, dicts, sets, custom objects), assignment
          makes a new <em>name</em>, not a new value:
        </p>
        <AnnotatedCode
          filename="the reference trap"
          lines={[
            { code: "a = [1, 2, 3]",            note: "a points at a list" },
            { code: "b = a",                    note: "b points at the SAME list" },
            { code: "b.append(4)",              note: "mutate the list via b" },
            { code: "print(a)",                 note: "→ [1, 2, 3, 4]   — a and b are the same list!" },
            { code: "",                         note: "" },
            { code: "# To get an independent copy:",     note: "" },
            { code: "c = a.copy()  # shallow copy",      note: "or list(a), or a[:] — all make a new list" },
          ]}
        />
        <p>
          This shows up in agent code as "I mutated this, why did the other
          thing change?" — the answer is always: they're the same object.
          Lesson 44 (Lists) covers this in depth.
        </p>

        <h2>None vs falsy vs missing</h2>
        <p>
          Three different concepts that beginners conflate:
        </p>
        <ul>
          <li>
            <strong>None</strong> — an explicit "no value here." Compare with{" "}
            <code>is None</code>.
          </li>
          <li>
            <strong>Falsy</strong> — a value that acts as False in a
            boolean context. <code>None</code> is falsy, but so is{" "}
            <code>0</code> and <code>""</code>.
          </li>
          <li>
            <strong>Missing</strong> (in a dict): the key doesn't exist.
            Different from <code>{"{'k': None}"}</code> (key exists, value
            is None).
          </li>
        </ul>
        <p>
          Why this matters: <code>if value:</code> treats <code>0</code> and{" "}
          <code>None</code> the same. If you really mean "is this None?"
          write <code>if value is None:</code>. AI agents often blur this and
          produce silently wrong code.
        </p>

        <h2>Final exercise — fix the buggy script</h2>
        <p>
          Below is a real Python file with three type-related bugs. Read it,
          run it (see the errors), and fix it so the tests pass.
        </p>

        <PythonPlayground
          title="Bug hunt: type errors"
          prompt={<>Three bugs. Fix all of them so the tests pass. The intent: compute the total price (quantity × unit price) and print a confirmation line.</>}
          initialCode={`# Imagine these came from a form:
quantity_str = "3"
unit_price = 4.50

# Bug 1: can't multiply a string by a float
total = quantity_str * unit_price

# Bug 2: trying to add a number into a string fails
message = "Total: " + total

# Bug 3: 'true' is not a Python boolean
purchased = true

print(message)
`}
          tests={[
            { name: "total equals 13.5", expr: "total == 13.5", hint: "Convert quantity_str to int (or float) before multiplying." },
            { name: "message is a string containing the total", expr: 'isinstance(message, str) and "13.5" in message', hint: "You can't `+` a string and a float directly. Use str(total) or an f-string." },
            { name: "purchased is True (the Python bool)", expr: "purchased is True", hint: "True (capital T) — lowercase 'true' isn't defined in Python." },
          ]}
          hints={[
            "Bug 1: cast quantity_str with int() before multiplying.",
            "Bug 2: convert the number to a string with str(), or use f-strings: f\"Total: {total}\"",
            "Bug 3: Python booleans are capitalized: True / False.",
            "Solution: quantity = int(quantity_str); total = quantity * unit_price; message = f\"Total: {total}\"; purchased = True",
          ]}
        />

        <h2>Cheat sheet — keep this handy</h2>
        <AnnotatedCode
          filename="types reference"
          lines={[
            { code: "# Bind",                                          note: "" },
            { code: "x = 5                       # int",               note: "" },
            { code: "x = 5.0                     # float",             note: "" },
            { code: 'x = "hello"                 # str',               note: "" },
            { code: "x = True                    # bool",              note: "" },
            { code: "x = None                    # NoneType",          note: "" },
            { code: "",                                                 note: "" },
            { code: "# Check",                                         note: "" },
            { code: "type(x)                     # the class",          note: "" },
            { code: "isinstance(x, int)          # bool",               note: "" },
            { code: "",                                                 note: "" },
            { code: "# Convert",                                       note: "" },
            { code: "int('42')                   # 42",                 note: "" },
            { code: "float('3.14')               # 3.14",               note: "" },
            { code: "str(42)                     # '42'",               note: "" },
            { code: "bool(0)                     # False",              note: "" },
            { code: "",                                                 note: "" },
            { code: "# Common operators",                              note: "" },
            { code: "10 / 4                      # 2.5  (float)",       note: "" },
            { code: "10 // 4                     # 2    (floor)",       note: "" },
            { code: "10 % 3                      # 1    (modulo)",      note: "" },
            { code: "2 ** 10                     # 1024 (power)",       note: "" },
            { code: "",                                                 note: "" },
            { code: "# None check",                                    note: "" },
            { code: "if x is None: ...",                                note: "use `is` for None" },
            { code: "if x == 'something': ...",                         note: "use `==` for value equality" },
          ]}
        />
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "data = json.loads(response.text)", context: "Reading an API response. Values come back as strings/ints/dicts/lists/None — your job to handle the types correctly." },
            { file: "user_id: int = 42", context: "A type annotation. Optional in Python, but the agent should use them — they document intent and let mypy catch bugs." },
            { context: "An agent writes `if value == None` — politely suggest `is None` instead. Same result usually, but `is` is the idiomatic check and faster." },
            { file: "from decimal import Decimal", context: "When the code touches money — never use float for currency, use Decimal." },
            { context: "When a test fails with `expected '5', got 5` — type mismatch. Cast one side." },
            { file: "MAX_RETRIES = 3", context: "ALL_CAPS = module-level constant convention. Python doesn't enforce immutability, but the casing is a signal." },
            { context: "When agent code does `name = name + str(suffix)` — works, but `f\"{name}{suffix}\"` is clearer and the modern way." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Comparing to None with `==`",
            body: (
              <>
                The agent writes <code>{"if user == None:"}</code>. It works
                most of the time but silently breaks for any object that
                overrides <code>__eq__</code> to do something weird.
              </>
            ),
          }}
          good={{
            title: "Always `is None` and `is not None`",
            body: (
              <>
                <code>if user is None:</code>. There is exactly ONE None;
                identity check is correct and fast. Linters flag the{" "}
                <code>== None</code> form.
              </>
            ),
          }}
          why={
            <>
              The idiomatic test for None is <code>is</code>, because None
              is a singleton (only one ever exists). For value comparison
              between two of anything else, use <code>==</code>.
            </>
          }
        />

        <AntiPattern
          bad={{
            title: "Using float for money",
            body: (
              <>
                <code>price = 0.1 + 0.2</code> →{" "}
                <code>0.30000000000000004</code>. Run this enough times in
                a billing system and you have customer support emails about
                $19.99 charges showing up as $19.9899999999.
              </>
            ),
          }}
          good={{
            title: "Use Decimal or store cents as integers",
            body: (
              <>
                <code>from decimal import Decimal; price = Decimal("0.1") + Decimal("0.2")</code>{" "}
                — exact. Or store everything as integer cents and only
                divide by 100 for display.
              </>
            ),
          }}
          why={
            <>
              IEEE 754 floats can't represent 0.1 exactly. The error
              compounds. For money, time, or anything where precision
              matters, never use float.
            </>
          }
        />

        <AntiPattern
          bad={{
            title: "Bare `if value:` when you mean `if value is not None:`",
            body: (
              <>
                Agent writes <code>if count:</code> to mean "if count was
                provided." But <code>count = 0</code> is falsy too. The
                function silently treats zero as missing.
              </>
            ),
          }}
          good={{
            title: "Be explicit about what you're checking",
            body: (
              <>
                <code>if count is not None:</code> — explicit "value was
                provided." <code>if count:</code> — explicit "value is
                truthy (non-zero, non-empty)." Don't conflate the two.
              </>
            ),
          }}
          why={
            <>
              The truthiness shortcut is great when you mean "is this
              non-empty / non-zero." It's a bug when you mean "is this
              missing." Read every <code>if value:</code> with this
              question in mind.
            </>
          }
        />

        <AntiPattern
          bad={{
            title: "Mutating a default argument",
            body: (
              <>
                <code>{`def add(item, items=[]): items.append(item); return items`}</code>{" "}
                — the default list is shared between every call. The second
                call sees data from the first call. Famous Python footgun.
              </>
            ),
          }}
          good={{
            title: "Use None as the sentinel, create inside",
            body: (
              <>
                <code>{`def add(item, items=None): items = items if items is not None else []; items.append(item); return items`}</code>
              </>
            ),
          }}
          why={
            <>
              Default argument values are evaluated once, at function
              definition time. A mutable default becomes shared state across
              every call to that function. Always use <code>None</code> as
              the sentinel, then construct the real default inside.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={39}
          questions={[
            {
              kind: "mcq",
              prompt: "What does `x = 5` do in Python?",
              options: [
                "Declares x as a variable of type int and stores 5 in it.",
                "Binds the name `x` to the value 5. The name has no type; the value has the type.",
                "Compares x to 5.",
                "Creates a new memory address called x.",
              ],
              answer: 1,
              explanation:
                "Names point at values. The same name can later point at a value of a completely different type — `x = 'hello'` is fine right after `x = 5`.",
            },
            {
              kind: "mcq",
              prompt:
                "After `a = [1,2,3]; b = a; b.append(4)`, what is `a`?",
              options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "None"],
              answer: 1,
              explanation:
                "`b = a` makes b a second name for the SAME list object. Mutating through one name is visible through the other.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are FALSY in Python?",
              options: [
                "0",
                "0.0",
                "None",
                "\"\" (empty string)",
                "\"0\" (string with character zero)",
                "[]",
                "[None]",
              ],
              answer: [0, 1, 2, 3, 5],
              explanation:
                'The string "0" is non-empty so it\'s truthy. [None] is a non-empty list, also truthy. Everything else listed is falsy.',
            },
            {
              kind: "mcq",
              prompt: "What does `10 / 4` evaluate to in Python 3?",
              options: ["2 (int)", "2.5 (float)", "3 (int)", "TypeError"],
              answer: 1,
              explanation:
                "`/` is always true division in Python 3 — always returns a float. Use `//` for floor division.",
            },
            {
              kind: "fill",
              prompt:
                "Which operator gives the REMAINDER of an integer division? (Example: 10 ___ 3 → 1)",
              answers: ["%", "%%"],
              placeholder: "one symbol",
              explanation:
                "Modulo operator. Useful for 'every Nth' patterns and cycling indices.",
            },
            {
              kind: "mcq",
              prompt:
                "The most idiomatic way to check whether a variable is None?",
              options: [
                "if x == None:",
                "if x is None:",
                "if not x:",
                "if type(x) == NoneType:",
              ],
              answer: 1,
              explanation:
                "`is None` — identity check. None is a singleton so identity is correct AND faster. `not x` is wrong because it's also true for 0, '', [], etc.",
            },
            {
              kind: "mcq",
              prompt:
                "Why is `float` a bad choice for storing money values?",
              options: [
                "It's slower.",
                "IEEE 754 floats can't represent decimal fractions like 0.1 exactly — small errors compound. Use Decimal (or store integer cents).",
                "Floats are deprecated.",
                "Python doesn't allow it.",
              ],
              answer: 1,
              explanation:
                "Classic 0.1 + 0.2 = 0.30000000000000004 problem. For money, time, or anywhere precision matters, never use float.",
            },
            {
              kind: "fill",
              prompt:
                "Which keyword turns a string like `\"42\"` into the integer `42`?",
              answers: ["int", "int()"],
              explanation:
                "int(\"42\") → 42. Will raise ValueError if the string isn't a valid integer.",
            },
            {
              kind: "multi",
              prompt:
                "Which Python identifiers follow the standard PEP 8 style?",
              options: [
                "user_id",
                "userId",
                "UserAccount (a class)",
                "MAX_RETRIES (a constant)",
                "_internal",
                "MyVariable (a variable)",
              ],
              answer: [0, 2, 3, 4],
              explanation:
                "snake_case for variables. PascalCase for classes. UPPER_CASE for constants. _leading for 'internal'. camelCase and PascalCase-for-variables are out.",
            },
            {
              kind: "mcq",
              prompt: "Which line will RAISE an error?",
              options: [
                "x = 'hello'",
                "x = True",
                "x = true",
                "x = None",
              ],
              answer: 2,
              explanation:
                "Python booleans are capitalized: True / False. Lowercase `true` is NameError.",
            },
            {
              kind: "mcq",
              prompt:
                "Your agent writes `def add(x, items=[]): items.append(x); return items`. Why is this an anti-pattern?",
              options: [
                "It's fine.",
                "Default arguments are evaluated once at definition time, so the empty list is SHARED across every call. The second call sees the first call's data.",
                "Lists can't be default values.",
                "Python forbids it.",
              ],
              answer: 1,
              explanation:
                "Mutable default argument is a famous Python footgun. Use None as the sentinel and create the real default inside the function body.",
            },
            {
              kind: "mcq",
              prompt:
                "Python's int type can hold values up to:",
              options: [
                "2^31 - 1, like C.",
                "2^63 - 1, like 64-bit integers.",
                "Arbitrary precision — limited only by available memory. 10 ** 1000 is fine.",
                "A million.",
              ],
              answer: 2,
              explanation:
                "Python ints grow as needed. No overflow. (Floats DO have IEEE 754 limits — that's a different story.)",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
