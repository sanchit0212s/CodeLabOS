import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";
import { PythonPlayground } from "@/components/interactive/PythonPlayground";

export default function Lesson40() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every Python expression you read is a tree of operators applied to
          values. The 30 operators in this lesson cover almost everything an
          AI agent will write before classes and functions enter the
          picture. Confusion here — "what does <code>or</code> actually
          return?" — produces some of Python's most baffling silent bugs.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is an operator?</>}
          back={
            <p className="text-center text-lg">
              An operator is a <strong>symbol or keyword that takes one or
              two values and produces a new value</strong>.{" "}
              <code>+</code> on two numbers gives their sum; on two strings
              gives their concatenation. Operators are typed — applying one
              to wrong-typed values raises TypeError.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The five families</h2>
        <ol>
          <li><strong>Arithmetic</strong> — math on numbers.</li>
          <li><strong>Comparison</strong> — produce bool.</li>
          <li><strong>Boolean</strong> — combine bools (and weirder things).</li>
          <li><strong>Assignment</strong> — bind and update.</li>
          <li><strong>Membership / identity</strong> — <code>in</code>, <code>is</code>.</li>
        </ol>

        <h2>1 · Arithmetic operators</h2>
        <table>
          <thead><tr><th>Op</th><th>Example</th><th>Result</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td><code>+</code></td><td>3 + 4</td><td>7</td><td>also string concat: <code>"a" + "b"</code></td></tr>
            <tr><td><code>-</code></td><td>10 - 3</td><td>7</td><td>binary or unary (<code>-5</code>)</td></tr>
            <tr><td><code>*</code></td><td>3 * 4</td><td>12</td><td>also string repeat: <code>"ab" * 3</code></td></tr>
            <tr><td><code>/</code></td><td>10 / 4</td><td>2.5</td><td>ALWAYS returns float</td></tr>
            <tr><td><code>//</code></td><td>10 // 4</td><td>2</td><td>floor division (toward −∞)</td></tr>
            <tr><td><code>%</code></td><td>10 % 3</td><td>1</td><td>modulo (remainder)</td></tr>
            <tr><td><code>**</code></td><td>2 ** 10</td><td>1024</td><td>exponentiation</td></tr>
          </tbody>
        </table>

        <h3>Floor division and modulo with negatives</h3>
        <p>
          Python rounds <strong>toward negative infinity</strong>, not
          toward zero. <code>-10 // 3</code> is <code>-4</code>, not{" "}
          <code>-3</code>. Modulo follows the same rule:{" "}
          <code>-10 % 3</code> is <code>2</code>. This is mathematically
          cleaner but surprises people from C/JS.
        </p>

        <PythonPlayground
          title="Drill: arithmetic with surprise rounding"
          prompt={<>Compute each value the test asks for. Mind the difference between <code>/</code> and <code>//</code>, and the sign rules for floor division.</>}
          initialCode={`# Bind each variable to the correct value.
# Some require careful operator choice.

a = ___          # 17 divided by 5, as a FLOAT
b = ___          # 17 divided by 5, as an INTEGER (floor)
c = ___          # 17 modulo 5  (the remainder)
d = ___          # -10 divided by 3, floor
e = ___          # 2 raised to the 16th power
`}
          tests={[
            { name: "a == 3.4", expr: "a == 3.4", hint: "Use `/` for true division." },
            { name: "b == 3", expr: "b == 3", hint: "Use `//` for floor division." },
            { name: "c == 2", expr: "c == 2", hint: "Use `%`." },
            { name: "d == -4", expr: "d == -4", hint: "Floor rounds toward NEGATIVE infinity, not zero." },
            { name: "e == 65536", expr: "e == 65536", hint: "Use `**`." },
          ]}
          hints={[
            "a = 17 / 5 ; b = 17 // 5 ; c = 17 % 5 ; d = -10 // 3 ; e = 2 ** 16",
          ]}
        />

        <h2>2 · String operators (overloaded arithmetic)</h2>
        <p>
          A handful of arithmetic operators have meaning on strings (and
          lists, and other sequences). Knowing them keeps you from
          reinventing built-in syntax.
        </p>
        <AnnotatedCode
          filename="string operators"
          lines={[
            { code: '"hello" + " " + "world"',     note: "concatenation → 'hello world'" },
            { code: '"-" * 30',                    note: "repetition → '------------------------------'" },
            { code: '"py" in "python"',            note: "substring test → True" },
            { code: '"x" not in "python"',         note: "→ True" },
            { code: 'len("python")',                note: "length → 6" },
            { code: '"python"[0]',                  note: "indexing → 'p' (zero-indexed)" },
            { code: '"python"[-1]',                 note: "negative index counts from end → 'n'" },
            { code: '"python"[1:4]',                note: "slice → 'yth'  (start inclusive, end exclusive)" },
          ]}
        />
        <p>
          We dig into strings properly in lesson 47. For now: know that
          these work, and that <code>+</code>/<code>*</code> with strings
          isn't a quirk — it's deliberate operator overloading.
        </p>

        <h2>3 · Comparison operators</h2>
        <table>
          <thead><tr><th>Op</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>==</code></td><td>equal in value</td></tr>
            <tr><td><code>!=</code></td><td>not equal in value</td></tr>
            <tr><td><code>{`<`}</code> <code>{`>`}</code> <code>{`<=`}</code> <code>{`>=`}</code></td><td>numeric / lexical order</td></tr>
            <tr><td><code>is</code></td><td>same object in memory (identity)</td></tr>
            <tr><td><code>is not</code></td><td>not the same object</td></tr>
          </tbody>
        </table>

        <h3>== vs is — the most common newbie trap</h3>
        <p>
          <code>==</code> compares <strong>values</strong>:{" "}
          <code>[1,2,3] == [1,2,3]</code> is True even though they're two
          different lists.
        </p>
        <p>
          <code>is</code> compares <strong>identity</strong>:{" "}
          <code>[1,2,3] is [1,2,3]</code> is False because those are two
          freshly-created list objects.
        </p>
        <p>
          Use <code>is</code> only for: <code>None</code>, <code>True</code>,{" "}
          <code>False</code>, and other known-singleton sentinels. For
          everything else use <code>==</code>.
        </p>

        <h3>Chained comparisons — a Python superpower</h3>
        <p>
          Unlike most languages, Python lets you chain:{" "}
          <code>0 {`<`} x {`<`} 10</code> means{" "}
          <code>0 {`<`} x and x {`<`} 10</code>. Reads like math, evaluates
          correctly, doesn't double-evaluate <code>x</code>.
        </p>

        <PythonPlayground
          title="Drill: predict comparisons"
          prompt={<>Set each variable to either True or False — what the expression on the right will evaluate to. Run to check.</>}
          initialCode={`# Predict each one BEFORE clicking run.

a = ___    # value of:  5 == 5.0
b = ___    # value of:  [1,2] == [1,2]
c = ___    # value of:  [1,2] is [1,2]
d = ___    # value of:  None is None
e = ___    # value of:  1 < 2 < 3
f = ___    # value of:  "py" < "python"
g = ___    # value of:  "Python" == "python"
`}
          tests={[
            { name: "a is True  (int and float with same numeric value are ==)", expr: "a is True", hint: "5 == 5.0 → numeric equality, regardless of type." },
            { name: "b is True  (== on lists is element-wise)", expr: "b is True", hint: "Two lists with same contents are == even if different objects." },
            { name: "c is False  (`is` is identity, those are different list objects)", expr: "c is False", hint: "`is` checks 'same object in memory.' Two list literals make two objects." },
            { name: "d is True", expr: "d is True", hint: "None is a singleton; identity works." },
            { name: "e is True", expr: "e is True", hint: "Chained comparison: 1 < 2 AND 2 < 3." },
            { name: "f is True  ('py' is a prefix of 'python', lex-shorter)", expr: "f is True", hint: "Strings compare lexicographically. 'py' < 'python' because it's a prefix and shorter." },
            { name: "g is False  (case-sensitive)", expr: "g is False", hint: "'P' (80) is not 'p' (112). Python is case-sensitive." },
          ]}
          hints={[
            "All of them have answers — write True or False literally.",
            "a=True b=True c=False d=True e=True f=True g=False",
          ]}
        />

        <h2>4 · Boolean operators — and the short-circuit surprise</h2>
        <p>
          The three boolean operators in Python are spelled out as words:{" "}
          <code>and</code>, <code>or</code>, <code>not</code>. No{" "}
          <code>&amp;&amp;</code>, <code>||</code>, <code>!</code> in
          Python.
        </p>
        <table>
          <thead><tr><th>Op</th><th>Result</th></tr></thead>
          <tbody>
            <tr><td><code>a and b</code></td><td>a if a is falsy, else b</td></tr>
            <tr><td><code>a or b</code></td><td>a if a is truthy, else b</td></tr>
            <tr><td><code>not a</code></td><td>True if a is falsy, False if a is truthy</td></tr>
          </tbody>
        </table>
        <p>
          Read carefully: <code>and</code> and <code>or</code> don't return{" "}
          <code>True</code>/<code>False</code>. They return <em>one of the
          operands</em>. This is enormously useful — and a source of
          confusion.
        </p>

        <AnnotatedCode
          filename="short-circuit returns"
          lines={[
            { code: 'name = "" or "default"',              note: 'first is falsy ("" empty), so it returns the second → "default"' },
            { code: 'name = "Ada" or "default"',           note: 'first is truthy, returns it → "Ada"' },
            { code: 'value = obj and obj.x',                note: 'guard pattern: if obj is None/falsy, return obj (= None/falsy); else obj.x' },
            { code: 'ready = is_loaded and not is_error',  note: 'classic boolean compose' },
          ]}
        />

        <h3>Short-circuit evaluation</h3>
        <p>
          Python evaluates <code>and</code>/<code>or</code> lazily — it stops
          as soon as the result is determined.
        </p>
        <ul>
          <li><code>False and expensive()</code> — <code>expensive()</code> is never called.</li>
          <li><code>True or expensive()</code> — <code>expensive()</code> is never called.</li>
        </ul>
        <p>
          This is what powers the safe-access pattern:{" "}
          <code>user and user.profile and user.profile.name</code> won't
          crash if <code>user</code> or <code>profile</code> is None — it
          stops at the first falsy.
        </p>

        <PythonPlayground
          title="Drill: what does this actually return?"
          prompt={<>Run the snippet — predict each print's output first. The lesson is: <code>or</code> doesn't return True, it returns <em>a value</em>.</>}
          initialCode={`# Predict each one before clicking run.

print("" or "fallback")            # ?
print(0 or 42)                     # ?
print("first" or "second")         # ?
print(None or 0 or "" or "final")  # ?
print("ready" and "go")            # ?
print(0 and 1 / 0)                 # ? (and: hint, no crash. why?)
print(not 0)                       # ?
print(not "")                      # ?
print(not "0")                     # ?
`}
        />

        <h2>5 · Assignment operators</h2>
        <p>
          <code>=</code> binds. The compound forms update in place:
        </p>
        <table>
          <thead><tr><th>Op</th><th>Equivalent to</th></tr></thead>
          <tbody>
            <tr><td><code>x += y</code></td><td><code>x = x + y</code></td></tr>
            <tr><td><code>x -= y</code></td><td><code>x = x - y</code></td></tr>
            <tr><td><code>x *= y</code></td><td><code>x = x * y</code></td></tr>
            <tr><td><code>x /= y</code></td><td><code>x = x / y</code></td></tr>
            <tr><td><code>x //= y</code></td><td><code>x = x // y</code></td></tr>
            <tr><td><code>x %= y</code></td><td><code>x = x % y</code></td></tr>
            <tr><td><code>x **= y</code></td><td><code>x = x ** y</code></td></tr>
          </tbody>
        </table>
        <p>
          Note: Python has <strong>no</strong> <code>++</code> or{" "}
          <code>--</code>. Use <code>x += 1</code> and <code>x -= 1</code>.
        </p>

        <h3>The walrus operator <code>:=</code></h3>
        <p>
          Python 3.8+ has an "assignment expression" operator. It assigns AND
          returns a value, useful inside conditions:
        </p>
        <pre>{`if (n := len(data)) > 100:
    print(f"Too many items: {n}")`}</pre>
        <p>
          You'll see this occasionally. Don't overuse it; it can hurt
          readability.
        </p>

        <h2>6 · Membership and identity</h2>
        <ul>
          <li>
            <code>in</code> — "is this in that?" Works on strings, lists,
            tuples, sets, dicts (checks keys), and any iterable.
          </li>
          <li>
            <code>not in</code> — opposite.
          </li>
          <li>
            <code>is</code> / <code>is not</code> — covered above. For None
            and singletons only.
          </li>
        </ul>

        <AnnotatedCode
          filename="in operator"
          lines={[
            { code: '"a" in "apple"',                 note: "True — substring" },
            { code: "2 in [1, 2, 3]",                note: "True — list membership" },
            { code: '"name" in {"name": "Ada"}',     note: 'True — dict membership checks KEYS' },
            { code: '"Ada" in {"name": "Ada"}',      note: "False — values are NOT checked by `in`" },
            { code: "5 not in range(10)",            note: "False (5 IS in range)" },
          ]}
        />

        <h2>Operator precedence — the short list</h2>
        <p>
          When operators chain without parentheses, Python evaluates in this
          order (top = highest priority):
        </p>
        <ol>
          <li><code>**</code> (exponent)</li>
          <li>unary <code>-x</code>, <code>+x</code></li>
          <li><code>*</code>, <code>/</code>, <code>//</code>, <code>%</code></li>
          <li><code>+</code>, <code>-</code></li>
          <li>comparisons <code>{`<`}</code> <code>{`<=`}</code> <code>{`>`}</code> <code>{`>=`}</code> <code>!=</code> <code>==</code></li>
          <li><code>not</code></li>
          <li><code>and</code></li>
          <li><code>or</code></li>
        </ol>
        <p>
          When in doubt: <strong>use parentheses</strong>. Code with explicit
          parens is easier to read than code that relies on remembering the
          full table. Linters do not punish "unnecessary" parens.
        </p>

        <h2>Final exercise — a small real problem</h2>

        <PythonPlayground
          title="Real problem: tiered discount"
          prompt={<>Compute the final price of a cart given the rules in the comments. No <code>if</code>/<code>else</code> yet — use only arithmetic and boolean operators.</>}
          initialCode={`# Rules:
# - The cart subtotal is the unit_price times the quantity.
# - If the subtotal is 100 or more, apply a 10% discount.
# - Tax is 8% on whatever's left after discount.
# - Round the final number to 2 decimal places: round(value, 2)
#
# (You CAN solve this without if/else using a boolean trick:
#   discount_rate = 0.10 * (subtotal >= 100)
#  because True is 1 and False is 0 when used arithmetically.)

unit_price = 24.99
quantity = 5

subtotal = ___
discount_rate = ___        # 0.10 if subtotal>=100, else 0.0
after_discount = ___       # subtotal minus the discount
final_total = ___          # after_discount with 8% tax added, rounded to 2 decimals
`}
          tests={[
            { name: "subtotal == 124.95", expr: "subtotal == 124.95", hint: "unit_price * quantity" },
            { name: "discount_rate == 0.10  (subtotal is above the threshold)", expr: "abs(discount_rate - 0.10) < 1e-9", hint: "Use the boolean-as-int trick: 0.10 * (subtotal >= 100)" },
            { name: "after_discount == 112.455", expr: "abs(after_discount - 112.455) < 1e-9", hint: "subtotal - subtotal * discount_rate, or subtotal * (1 - discount_rate)" },
            { name: "final_total == 121.45", expr: "final_total == 121.45", hint: "round(after_discount * 1.08, 2)" },
          ]}
          hints={[
            "Subtotal: just multiply the two given values.",
            "For the discount: True == 1 and False == 0 in Python arithmetic. So `0.10 * (subtotal >= 100)` is 0.10 when the condition holds, 0.0 otherwise.",
            "Full solution:\n  subtotal = unit_price * quantity\n  discount_rate = 0.10 * (subtotal >= 100)\n  after_discount = subtotal * (1 - discount_rate)\n  final_total = round(after_discount * 1.08, 2)",
          ]}
        />

        <h2>Cheat sheet</h2>
        <AnnotatedCode
          filename="operators reference"
          lines={[
            { code: "# Arithmetic",         note: "" },
            { code: "+  -  *  /  //  %  **", note: "" },
            { code: "",                      note: "" },
            { code: "# Comparison",         note: "" },
            { code: "==  !=  <  <=  >  >=", note: "" },
            { code: "is  is not            # identity (None and singletons)", note: "" },
            { code: "",                      note: "" },
            { code: "# Boolean (words, not symbols!)", note: "" },
            { code: "and  or  not",          note: "" },
            { code: "",                      note: "" },
            { code: "# Assignment",          note: "" },
            { code: "=  +=  -=  *=  /=  //=  %=  **=", note: "" },
            { code: ":=  (walrus, assign-in-expression)", note: "" },
            { code: "",                      note: "" },
            { code: "# Membership",          note: "" },
            { code: "in  not in",            note: "" },
            { code: "",                      note: "" },
            { code: "# Chained comparison",  note: "" },
            { code: "0 <= x < 10            # equivalent to (0 <= x) and (x < 10)", note: "" },
          ]}
        />
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "if user and user.is_active:", context: "Short-circuit AND used as a None-safe attribute access. If user is None/falsy, the access is skipped." },
            { file: "name = data.get('name') or 'Anonymous'", context: "Default-value-on-falsy pattern. Common in agent code reading API payloads." },
            { file: "i % 2 == 0", context: "The 'is i even?' test. Modulo is everywhere in pagination, alternating rows, time math." },
            { file: "is_valid = bool(value) and value > 0", context: "Combining bool() with a comparison to guard against weird inputs." },
            { context: "When you see `x == None` in agent code, mentally rewrite to `x is None` and suggest the change." },
            { file: "round(price * 1.08, 2)", context: "Add tax, round to two decimals for currency display. Standard." },
            { context: "When you see `1 / 0` and the code didn't crash — there's a short-circuit somewhere protecting it. Read backward." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Using `or` for default values without thinking about falsy values",
            body: (
              <>
                <code>count = user_input or 10</code>. Works for{" "}
                <code>None</code>. Breaks when the user genuinely entered{" "}
                <code>0</code> — gets the default instead of 0.
              </>
            ),
          }}
          good={{
            title: "Explicit None-check when 0 / '' / [] are valid",
            body: (
              <>
                <code>count = user_input if user_input is not None else 10</code>{" "}
                — or use dict <code>.get(key, default)</code> which only
                falls back when the key is missing, not when the value is 0.
              </>
            ),
          }}
          why={
            <>
              <code>or</code> is great when "falsy = missing." It's a bug
              when 0 / "" / [] are legitimate values you want to preserve.
              Read every <code>x or default</code> with this question.
            </>
          }
        />

        <AntiPattern
          bad={{
            title: "Relying on operator precedence instead of parens",
            body: (
              <>
                <code>a + b * c &gt; 100 and not flag</code> — correct, but
                you (or the next reader) have to remember the precedence
                table to verify it.
              </>
            ),
          }}
          good={{
            title: "Use parentheses to make grouping explicit",
            body: (
              <>
                <code>((a + (b * c)) &gt; 100) and (not flag)</code> — or at
                least <code>(a + b * c &gt; 100) and not flag</code>. Linters
                don't complain about explicit parens.
              </>
            ),
          }}
          why={
            <>
              Code is read 10× more than written. The five extra characters
              for parentheses save the reader a trip to the precedence
              table and prevent silent precedence bugs.
            </>
          }
        />

        <AntiPattern
          bad={{
            title: "Comparing floats with ==",
            body: (
              <>
                <code>{`if 0.1 + 0.2 == 0.3: …`}</code> — always False.
                Floating-point math is inexact, so direct equality fails
                for almost any computed float.
              </>
            ),
          }}
          good={{
            title: "Compare floats with a tolerance",
            body: (
              <>
                <code>abs(a - b) {`<`} 1e-9</code> — "close enough." Or use
                <code> math.isclose(a, b)</code>. Or store as Decimal and
                use <code>==</code> on those.
              </>
            ),
          }}
          why={
            <>
              0.1 + 0.2 != 0.3 in any IEEE 754 language. == on computed
              floats is an unreliable test. Use tolerance or Decimal.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={40}
          questions={[
            {
              kind: "fill",
              prompt:
                "What is `17 // 5` in Python?",
              answers: ["3"],
              explanation: "Floor division on positives is the integer part of the quotient.",
            },
            {
              kind: "fill",
              prompt:
                "What is `-10 // 3` in Python?",
              answers: ["-4"],
              explanation: "Python rounds toward negative infinity. -10/3 = -3.33…, floor → -4. (C/JS would give -3.)",
            },
            {
              kind: "mcq",
              prompt: "What does `\"\" or \"fallback\"` evaluate to?",
              options: ['""', '"fallback"', "True", "False"],
              answer: 1,
              explanation:
                "or returns the FIRST truthy operand, or the LAST operand if none are truthy. Empty string is falsy, so the second wins.",
            },
            {
              kind: "mcq",
              prompt:
                "Which of these expressions is True?",
              options: [
                "[1, 2] is [1, 2]",
                "[1, 2] == [1, 2]",
                "{1: 'a'} is {1: 'a'}",
                "'5' == 5",
              ],
              answer: 1,
              explanation:
                "`==` compares values, so the two equal lists compare equal. `is` checks if it's literally the same object — two literals produce two objects.",
            },
            {
              kind: "fill",
              prompt:
                "Python boolean operators are spelled with three KEYWORDS (not symbols like && / || / !). Name any one of them.",
              answers: ["and", "or", "not"],
              explanation:
                "and, or, not. Python explicitly avoided the C-style symbols for readability.",
            },
            {
              kind: "mcq",
              prompt:
                "What does `0 and 1/0` evaluate to in Python?",
              options: [
                "ZeroDivisionError",
                "0 — short-circuit evaluation means 1/0 is never evaluated",
                "1",
                "TypeError",
              ],
              answer: 1,
              explanation:
                "`and` short-circuits. The first operand is 0 (falsy), so the result is 0 without ever touching the right side. This is what protects None-guard patterns.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are CORRECT use cases for `is` (rather than `==`)?",
              options: [
                "Checking if x is None",
                "Checking if two lists have the same contents",
                "Checking if x is True",
                "Checking if x is False",
                "Comparing two strings",
              ],
              answer: [0, 2, 3],
              explanation:
                "`is` is for identity — known singletons like None, True, False. Use `==` for value comparison (lists, strings, numbers).",
            },
            {
              kind: "mcq",
              prompt:
                "Chained comparison: `0 < x < 10` is equivalent to:",
              options: [
                "(0 < x) < 10",
                "0 < x and x < 10",
                "min(0, x, 10)",
                "It's not valid Python.",
              ],
              answer: 1,
              explanation:
                "Python supports mathematical chained comparisons. Each adjacent pair is an `and`-joined comparison.",
            },
            {
              kind: "mcq",
              prompt: "What does `\"name\" in {\"name\": \"Ada\", \"age\": 30}` evaluate to?",
              options: [
                'False — "name" is a key, not a value',
                "True — `in` on a dict checks for membership in keys",
                "True — `in` on a dict checks for membership in values",
                "TypeError",
              ],
              answer: 1,
              explanation:
                "`in` on dict checks KEYS, not values. To check values use `\"Ada\" in d.values()`.",
            },
            {
              kind: "mcq",
              prompt:
                "Why is `count = value or 10` a bug when 0 is a legitimate value for `value`?",
              options: [
                "It's not a bug.",
                "0 is falsy, so `value or 10` returns 10 even when value is genuinely 0. Use `if value is not None` to preserve 0.",
                "Python doesn't allow this pattern.",
                "It triggers a syntax error.",
              ],
              answer: 1,
              explanation:
                "`or` returns the first truthy operand. 0, '', [] are all falsy and trigger the fallback. Use an explicit None check when 0 is valid.",
            },
            {
              kind: "fill",
              prompt:
                "What operator raises a number to a power? (Example: 2 ___ 8 evaluates to 256.)",
              answers: ["**"],
              placeholder: "two characters",
              explanation:
                "`**` is exponentiation. `pow(2, 8)` does the same thing.",
            },
            {
              kind: "mcq",
              prompt:
                "Why does `0.1 + 0.2 == 0.3` evaluate to False in Python?",
              options: [
                "Bug in Python.",
                "Floats are IEEE 754 doubles. 0.1 and 0.2 can't be represented exactly in binary, so the sum is approximately 0.30000000000000004 — not exactly 0.3.",
                "Numbers must match in type.",
                "Python rounds incorrectly.",
              ],
              answer: 1,
              explanation:
                "Standard IEEE 754 reality, not Python-specific. Use tolerance comparisons or Decimal for exact decimal arithmetic.",
            },
            {
              kind: "fill",
              prompt:
                "Python 3.8 introduced the `___` operator (two characters) that lets you assign a value AND use it inside an expression. Nicknamed the 'walrus.'",
              answers: [":="],
              placeholder: "two characters",
              explanation:
                ":= — useful sparingly. Common in `while (chunk := f.read(1024)):` patterns.",
            },
            {
              kind: "mcq",
              prompt:
                "What's the value of `\"-\" * 30`?",
              options: [
                "An error.",
                'A string of 30 dashes.',
                '-30',
                '0',
              ],
              answer: 1,
              explanation:
                "`*` between a string and an int is REPETITION. `\"-\" * 30` → 30 dashes. Handy for separators.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
