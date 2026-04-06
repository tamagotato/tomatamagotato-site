<template>
  <div class="work-page">

    <div class="work-intro">
      <h1>I design systems that make organizations work.</h1>
      <p>Operating models, enforcement logic, data visibility, cross-functional alignment. I work at the intersection of operations, product, and engineering — translating ambiguous problems into structured, scalable solutions.</p>
    </div>

    <p class="work-section-label">selected work</p>
    <div class="work-projects">

      <div class="work-card">
        <div class="work-card-header">
          <h3>Attendance & Utilization Tracking System</h3>
          <span class="work-tag">workforce systems</span>
        </div>
        <p>Designed and oversaw implementation of an end-to-end attendance system with enforced dependencies — timesheet submission gates access to downstream workflows, eliminating manual policing of compliance. Introduced configurable activity tracking to support multi-stream service delivery across teams.</p>
        <p class="work-card-outcome">↳ Reduced manual exception handling. Compliance enforced at the system level, not by management overhead.</p>
      </div>

      <div class="work-card">
        <div class="work-card-header">
          <h3>Overtime Governance Framework</h3>
          <span class="work-tag">process governance</span>
        </div>
        <p>Built overtime tracking with validation logic that enforces policy constraints before approval is granted. Replaced spreadsheet-based tracking and ad-hoc approvals with a structured workflow that surfaces policy violations before they become payroll problems.</p>
        <p class="work-card-outcome">↳ Policy enforced at the point of request, not after the fact. Supervisor workload reduced.</p>
      </div>

      <div class="work-card">
        <div class="work-card-header">
          <h3>Multi-Dimensional Operations Dashboard</h3>
          <span class="work-tag">data reporting</span>
        </div>
        <p>Designed reporting tools enabling leadership visibility across teams, clients, and timeframes simultaneously. Built hybrid data-fetching and caching strategies to keep dashboards fast under high usage. Defined the metrics and data model, collaborated with engineering on implementation.</p>
        <p class="work-card-outcome">↳ Leadership decision-making moved from reactive to data-informed. Single source of truth across functions.</p>
      </div>

      <div class="work-card">
        <div class="work-card-header">
          <h3>Cross-Functional Workflow Standardization</h3>
          <span class="work-tag">operational design</span>
        </div>
        <p>Mapped and redesigned inconsistent workflows across operations, HR, and finance. Translated operational intent into system logic — validations, role-based access, and enforced step sequences — so process compliance is built in, not bolted on.</p>
        <p class="work-card-outcome">↳ Reduced process drift. Teams operate from shared, enforceable workflows instead of institutional memory.</p>
      </div>

    </div>

    <p class="work-section-label">how I work</p>
    <div class="work-approach">
      <ul class="approach-list">
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Systems thinking</strong>
            <span>I design solutions that account for dependencies, edge cases, and long-term scale — not just the happy path.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Problem definition first</strong>
            <span>I operate in ambiguous environments. Breaking a vague problem into solvable components is usually the hardest and most valuable part of the work.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Data-informed</strong>
            <span>I use metrics and observable behavior to guide decisions — not assumptions about what users or teams should be doing.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Influence without authority</strong>
            <span>I drive alignment across operations, product, HR, finance, and engineering through clarity and design — not hierarchy.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Self-sustaining solutions</strong>
            <span>A solution that requires constant manual oversight isn't finished. I build systems that enforce their own rules.</span>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Work — tomatamagotato' })
</script>

<style src="~/assets/css/work.css"></style>
