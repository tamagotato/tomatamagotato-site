<template>
  <div class="work-page">

    <div class="work-intro">
      <h1>I build the <span class="ink-underline">rules<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2,8 C18,3 32,10 50,6 C66,3 82,9 98,5" /></svg></span> into the system, so nobody has to enforce them by hand.</h1>
      <p>I work between operations, product, and engineering. Most of what I do is turning a policy that lives in someone's head, or a spreadsheet, into something the software checks on its own.</p>
    </div>

    <p class="work-section-label">selected work</p>
    <div class="work-projects">

      <NuxtLink class="work-card work-card-link" to="/work/attendance-utilization">
        <div class="work-card-header">
          <h3>Attendance and utilization tracking</h3>
          <span class="work-tag">workforce systems</span>
        </div>
        <span class="work-case-badge">case study &rarr;</span>
        <p>An end-to-end attendance system with enforced dependencies: submitting a timesheet is what unlocks the next workflow, so compliance stops being something managers chase. Activity tracking is configurable to handle teams running several service streams at once.</p>
        <div class="work-shift">
          <div class="work-shift-half">
            <span class="work-shift-label">Before</span>
            <strong>Managers chase people for timesheets</strong>
          </div>
          <div class="work-shift-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h16" /><path d="M13 6l6 6-6 6" /></svg>
          </div>
          <div class="work-shift-half is-after">
            <span class="work-shift-label">After</span>
            <strong>The workflow stays locked until it's submitted</strong>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink class="work-card work-card-link" to="/work/overtime-governance">
        <div class="work-card-header">
          <h3>Overtime governance</h3>
          <span class="work-tag">process governance</span>
        </div>
        <span class="work-case-badge">case study &rarr;</span>
        <p>Overtime tracking with validation that runs before approval, not after. It replaced spreadsheet tracking and ad-hoc sign-off, so a request that breaks policy gets caught at the point it's filed instead of surfacing later as a payroll problem.</p>
        <div class="work-shift">
          <div class="work-shift-half">
            <span class="work-shift-label">Before</span>
            <strong>Policy breaches found at payroll</strong>
          </div>
          <div class="work-shift-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h16" /><path d="M13 6l6 6-6 6" /></svg>
          </div>
          <div class="work-shift-half is-after">
            <span class="work-shift-label">After</span>
            <strong>Caught when the request is filed</strong>
          </div>
        </div>
      </NuxtLink>

      <div class="work-card">
        <div class="work-card-header">
          <h3>Operations dashboard</h3>
          <span class="work-tag">data reporting</span>
        </div>
        <p>Reporting that lets leadership look across teams, clients, and timeframes at the same time. I defined the metrics and the data model and worked with engineering on the build, including the caching and fetching strategy that keeps it fast under load.</p>
        <div class="work-shift">
          <div class="work-shift-half">
            <span class="work-shift-label">Before</span>
            <strong>Each function reporting its own numbers</strong>
          </div>
          <div class="work-shift-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h16" /><path d="M13 6l6 6-6 6" /></svg>
          </div>
          <div class="work-shift-half is-after">
            <span class="work-shift-label">After</span>
            <strong>One source everyone reads from</strong>
          </div>
        </div>
      </div>

      <NuxtLink class="work-card work-card-link" to="/work/workflow-standardization">
        <div class="work-card-header">
          <h3>Workflow standardization</h3>
          <span class="work-tag">operational design</span>
        </div>
        <span class="work-case-badge">case study &rarr;</span>
        <p>Mapped and redesigned workflows that had drifted apart across operations, HR, and finance. The operational intent became system logic: validations, role-based access, and step sequences that have to happen in order.</p>
        <div class="work-shift">
          <div class="work-shift-half">
            <span class="work-shift-label">Before</span>
            <strong>Every team working from memory</strong>
          </div>
          <div class="work-shift-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h16" /><path d="M13 6l6 6-6 6" /></svg>
          </div>
          <div class="work-shift-half is-after">
            <span class="work-shift-label">After</span>
            <strong>One workflow the system holds them to</strong>
          </div>
        </div>
      </NuxtLink>

    </div>

    <p class="work-section-label">how I work</p>
    <div class="work-approach">
      <ul class="approach-list">
        <li v-for="item in approach" :key="item.title" class="approach-item">
          <svg class="approach-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 13l5 5L20 5" />
          </svg>
          <div>
            <strong>{{ item.title }}</strong>
            <span>{{ item.body }}</span>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Work | tomatamagotato' })

const approach = [
  {
    title: 'Systems thinking',
    body: 'I design for the dependencies and edge cases, not just the path where everything goes right.'
  },
  {
    title: 'Problem definition first',
    body: 'Breaking a vague problem into solvable pieces is usually the hardest part, and where most of the value is.'
  },
  {
    title: 'Data-informed',
    body: 'I go by what people actually do in the system, not what we assumed they would do.'
  },
  {
    title: 'Influence without authority',
    body: 'Getting operations, product, HR, finance, and engineering to agree is a design problem, not a reporting-line problem.'
  },
  {
    title: 'Self-sustaining solutions',
    body: "A fix that needs someone watching it isn't finished. The system should enforce its own rules."
  }
]
</script>

<style src="~/assets/css/work.css"></style>
