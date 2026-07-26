<template>
  <article class="post">
    <h1 class="post-title">Using an LLM to Draft Static Infographics with Remotion</h1>
    <time class="post-date">July 24, 2026</time>

    <p>Every internal announcement — a policy notice, an event flyer, a community circular — starts with the same tax: open a blank canvas, pick a layout, fight with alignment, ship something that looks like it took longer than it should have. For one-off internal communications, that tax is rarely worth paying by hand.</p>

    <p>This is a walkthrough of a workflow that removes most of it: an LLM turns a rough source document into a structured static infographic, rendered by <a href="https://www.remotion.dev/" target="_blank" rel="noopener">Remotion</a> — a framework built for programmatically generating video, which also happens to render a single still frame just fine.</p>

    <h2>Why Remotion, not Canva or Figma</h2>

    <p>Remotion isn't a competitor to Canva or Figma here. It's a first draft.</p>

    <p><strong>It's programmatic, which means it's automatable.</strong> Canva and Figma assume a human clicking through a UI. Remotion is a React component rendered to an image — you can call it from a script, a cron job, or an LLM's tool loop with no human in the middle. That's the entire point of pairing it with an LLM in the first place.</p>

    <p><strong>LLMs are already fluent in the medium.</strong> A model that's seen millions of React components is far better at writing and modifying a Remotion component than it is at driving a Figma plugin API or a Canva integration it's rarely, if ever, been trained against.</p>

    <p><strong>And it's explicitly assistive, not a replacement.</strong> The output is a fast, data-driven boilerplate — a real starting layout, not a polished final asset. If something needs to look genuinely designed, a Canva or Figma user can still pick it up from there. This workflow just means nobody has to start from nothing.</p>

    <p>Here's what that actually looks like — including where it broke.</p>

    <h2>The setup</h2>

    <p>The source material was a photographed community circular — a condo association's printed notice about weather and safety guidelines for a Sunday fun run. Not typed notes, not a JSON blob. A photo of a physical letterhead document, the kind of thing that actually accumulates in a shared drive.</p>

    <p>The prompt was one line, handed to an LLM already working inside the Remotion project's codebase:</p>

    <pre><code>generate a static mobile formatted announcement based on
reference/fun-run-guidelines.jpg. follow our established CTA patterns</code></pre>

    <p>No files were pointed to. "Established CTA patterns" was left for the model to figure out on its own.</p>

    <h2>How it found the pattern</h2>

    <p>Watching what the model actually did to resolve "established patterns" turned out to be the most useful part of this exercise.</p>

    <p>It read <code>Root.tsx</code> first and learned that static posters in this codebase are registered as Remotion <code>&lt;Still&gt;</code> compositions, distinct from the animated <code>&lt;Composition&gt;</code> entries sitting next to them. From there it found an existing poster component and used it as a direct structural precedent — letterhead band, headline, a highlighted panel, a call-to-action block, a footer. Then it pulled the shared color palette and font loader out of the project's theme file, and sampled a sibling component to see how time-sensitive information — a deadline, a pickup window — gets styled: a red rounded block, a muted label, a large white value.

    </p>

    <p>Here's the letterhead and the pickup-window block from the shipped component — the two pieces that most directly reused an existing pattern. Names, circular number, and location are fictionalized for this post; the JSX structure and styling are exactly what shipped:</p>

    <pre v-pre><code>&lt;div style={{backgroundColor: C.greenDark, padding: '34px 60px', textAlign: 'center'}}&gt;
  &lt;div style={{fontSize: 32, fontWeight: 800, color: '#FFFFFF', letterSpacing: 3}}&gt;
    RIVERBEND COMMONS CONDOMINIUM ASSOCIATION
  &lt;/div&gt;
  &lt;div style={{fontSize: 24, fontWeight: 600, color: '#DCEEE2', marginTop: 8}}&gt;
    Property Management Office · Circular RBC-CIR-2026-007-053
  &lt;/div&gt;
&lt;/div&gt;

{/* Kit pick-up window — red urgency block, reused from a sibling component */}
&lt;div style={{backgroundColor: C.red, borderRadius: 20, padding: '30px 48px', textAlign: 'center'}}&gt;
  &lt;div style={{fontSize: 34, fontWeight: 600, color: '#FFD9D9'}}&gt;
    Runner kit &amp; attendance pick-up
  &lt;/div&gt;
  &lt;div style={{fontSize: 58, fontWeight: 800, color: '#FFFFFF', marginTop: 8}}&gt;
    5:00 – 5:40 AM
  &lt;/div&gt;
  &lt;div style={{fontSize: 29, fontWeight: 600, color: '#FFFFFF', marginTop: 10}}&gt;
    Covered area outside the clubhouse east gate entrance
  &lt;/div&gt;
&lt;/div&gt;</code></pre>

    <p>None of that was pointed to explicitly. It was inferred — and it was only inferable because the components it was reading carried comments that explained <em>intent</em>, not just structure. One theme file had a comment noting that a given component should read as part of the same visual family as its siblings. That line did real work: it functioned as a design-system spec for a future LLM pass, not just documentation for a future human.</p>

    <p>The lesson generalizes past this one example: if you want an LLM to infer your conventions, the conventions have to be written down somewhere it can read them. Consistent code shape alone isn't enough — a model can't always tell the difference between "this is the pattern" and "this is just how this one file happened to be written."</p>

    <h2>Two passes, not one</h2>

    <p>The first generation typechecked cleanly and rendered without error. It also silently overflowed the canvas — the call-to-action block and footer were clipped off the bottom of a fixed 1920px frame. Nothing in the tooling flagged it. A type check and a successful render both say nothing about whether the layout actually fits.</p>

    <p>The second pass fixed exactly that, and only that — no copy changed, only spacing and type scale came down across the board:</p>

    <table>
      <thead>
        <tr><th>Element</th><th>First pass</th><th>Shipped</th></tr>
      </thead>
      <tbody>
        <tr><td>Headline size</td><td>84px</td><td>78px</td></tr>
        <tr><td>CTA block padding</td><td>32×80px</td><td>28×56px</td></tr>
        <tr><td>Deadline block time size</td><td>64px</td><td>58px</td></tr>
      </tbody>
    </table>

    <p>What made the second pass possible wasn't human feedback — it was the model inspecting its own rendered PNG output and catching the overflow itself. That's worth being precise about: this was a two-shot result with a self-correction, not a one-shot success. Rounding that up to "it nailed it on the first try" would misrepresent how the workflow actually behaves.</p>

    <h2>The result</h2>

    <p>What shipped was a clean, mobile-formatted static poster: letterhead, headline, a weather-guidance panel, a red pickup-window block, a call-to-action, and a footer — matching the visual family of every other poster already in the project, generated from a photo of a printed notice and one sentence of instruction.</p>

    <img src="/img/funrun-poster-fictional.png" alt="Rendered static poster: a mobile-formatted weather and safety advisory for a community fun run, with a letterhead band, headline, weather-guidance panel, red pickup-window block, call-to-action, and footer" width="1080" height="1920">

    <p class="post-caption">The names, circular number, and contact details above are fictional — swapped in for this post. The layout, copy, and structure are exactly what the model shipped.</p>

    <h2>Where this actually breaks</h2>

    <p>None of this replaces judgment. Five specific things are worth knowing before you trust this pattern for something real.</p>

    <h3>1. Overflow fails silently</h3>
    <p>A typecheck passing and a render completing tell you nothing about whether the layout fits inside its own canvas. The only reliable check is looking at the rendered image. If that step gets skipped, a clipped result ships looking exactly as "successful" as a correct one.</p>

    <h3>2. Fidelity checks catch wrong text, not missing text</h3>
    <p>The shipped poster never states which Sunday the event is on. The source circular had a date on it; the standalone poster doesn't. Every individual fact that made it in was accurate — the miss was something the model didn't know it had dropped. Reviewing an LLM's output for correctness isn't the same as reviewing it for completeness, and this workflow doesn't remove the need for a human pass before anything goes out the door.</p>

    <h3>3. The pattern-matching was pre-paid</h3>
    <p>This worked cleanly because earlier work in the codebase left comments explaining design intent, not just code. On a codebase without that groundwork, "follow our established patterns" has nothing to infer from — it degrades into the model guessing.</p>

    <h3>4. The real session wasn't a straight line</h3>
    <p>Partway through, before the component was finished, the session shifted into a planning step for the remaining work. Harmless, but worth naming: the actual path from prompt to poster is rarely as tidy as a written retelling makes it look.</p>

    <h3>5. Invented copy needs a human sign-off</h3>
    <p>The call-to-action line on the shipped poster wasn't in the source circular — the model wrote it because the established pattern called for one, and the source document didn't supply it. It's a genuine improvement over what was there. It's also not a faithful reproduction of an official notice anymore. For anything representing a real organization, synthesized copy needs someone to actually read and approve it before it goes out as that organization's voice.</p>

    <h2>Where this leaves off</h2>

    <p>The pitch here was never "faster than Canva." It's "faster than a blank canvas, with a human still finishing the job." For internal, low-stakes, one-off announcements, that trade is an easy one. The moment stakes rise — an official notice, anything customer-facing, anything that needs a signature before it's real — the review step in section five stops being optional and becomes the whole point.</p>

    <p>This covers the static case only. The same project produces short animated pieces the same way, with a timeline instead of a single frame — that's a different set of tradeoffs, and a different post.</p>
  </article>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dark'
})

useHead({ title: 'Using an LLM to Draft Static Infographics with Remotion — tomatamagotato' })
</script>

<style src="~/assets/css/post.css"></style>
<style scoped>
.post table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 0.9rem;
}

.post-caption {
  margin-top: -12px;
  font-size: 0.82rem;
  color: #888;
  font-style: italic;
}

.post th,
.post td {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #2a2a2a;
}

.post th {
  color: #8aaa55;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.post td {
  color: #ddd5cc;
}
</style>
