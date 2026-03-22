<template>
  <div class="report-page">
    <!-- Hero -->
    <section class="report-hero">
      <div class="report-hero-content">
        <span class="report-badge">Sentiment Analysis Report</span>
        <h1>How Filipino Workers <span class="highlight">Lost WFH</span> — and Who They Blame</h1>
        <p class="report-hero-sub">An analysis of grassroots sentiment across Reddit, Twitter/X, Facebook, and TikTok — tracing five years of pandemic hope, political fury, and strategic resignation.</p>
        <div class="report-hero-stats">
          <div class="report-hero-stat">
            <span class="num" style="color: var(--report-accent)">1.7M</span>
            <span class="label">BPO Workers</span>
          </div>
          <div class="report-hero-stat">
            <span class="num" style="color: var(--report-accent2)">$35B</span>
            <span class="label">Annual Revenue</span>
          </div>
          <div class="report-hero-stat">
            <span class="num" style="color: var(--report-accent3)">78%</span>
            <span class="label">Want Remote/Hybrid</span>
          </div>
          <div class="report-hero-stat">
            <span class="num" style="color: var(--report-accent4)">4hrs</span>
            <span class="label">Avg Daily Commute</span>
          </div>
        </div>
      </div>
      <a class="report-scroll-hint" href="#timeline">↓ Scroll to explore</a>
    </section>

    <!-- TOC -->
    <nav class="report-toc" :class="{ scrolled: tocScrolled }">
      <div class="report-toc-inner">
        <NuxtLink class="report-toc-home" to="/">🍅 tomatamagotato</NuxtLink>
        <a v-for="link in tocLinks" :key="link.id" class="report-toc-link" :class="{ active: activeSection === link.id }" :href="'#' + link.id">{{ link.label }}</a>
      </div>
    </nav>

    <!-- Content -->
    <main class="report-content">

      <!-- Intro -->
      <div class="report-section" id="intro">
        <p>The dominant Filipino sentiment on Work From Home is unambiguous: <strong>workers overwhelmingly want it back</strong>, and they point fingers at a three-headed villain — government fiscal policy, corporate real estate interests, and a minority of colleagues who abused the arrangement.</p>
        <p>What makes the Philippine WFH debate distinct from its Western counterpart is the central role of <strong>PEZA</strong> (Philippine Economic Zone Authority) and <strong>FIRB</strong> (Fiscal Incentives Review Board) in forcing the BPO industry back into offices to preserve tax incentives originally designed for physical economic zones.</p>
      </div>

      <!-- Timeline -->
      <div class="report-section" id="timeline">
        <div class="report-section-number">01</div>
        <h2>Five Phases of a Sentiment Rollercoaster</h2>
        <p>Filipino WFH sentiment moved through distinct emotional phases since 2020 — an arc of <strong>necessity → enthusiasm → fury → blame → strategic resignation</strong>.</p>
        <div class="report-timeline">
          <div v-for="(phase, i) in timelinePhases" :key="phase.year" class="report-timeline-item" :class="{ open: i === 0 }" @click="toggleItem($event)">
            <div class="report-timeline-dot"></div>
            <div class="report-timeline-header">
              <span class="report-timeline-year">{{ phase.year }}</span>
              <span class="report-timeline-title">{{ phase.title }}</span>
            </div>
            <div class="report-timeline-body">
              <p>{{ phase.body }}</p>
            </div>
            <span class="report-timeline-toggle">click to {{ i === 0 ? 'toggle' : 'expand' }}</span>
          </div>
        </div>
      </div>

      <!-- Blame Hierarchy -->
      <div class="report-section" id="blame">
        <div class="report-section-number">02</div>
        <h2>The Blame Hierarchy</h2>
        <p>Filipino workers online assign blame in a remarkably consistent hierarchy — <strong>PEZA first, corporations second, coworkers third</strong>.</p>
        <div class="report-ranked-stack">
          <div v-for="blame in blameItems" :key="blame.rank" class="report-ranked-bar" :style="{ '--width': blame.width }" @click="toggleExpand($event)">
            <div class="fill" :style="{ background: blame.color }"></div>
            <span class="rank" :style="{ color: blame.color }">{{ blame.rank }}</span>
            <div>
              <div class="name">{{ blame.name }}</div>
              <div class="detail"><p>{{ blame.detail }}</p></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Abuse Stories -->
      <div class="report-section" id="abuse">
        <div class="report-section-number">03</div>
        <h2>The Abuse Stories Employers Weaponized</h2>
        <p>Specific categories of WFH misconduct became central to the Philippine RTO justification narrative.</p>
        <div class="report-card-grid">
          <div v-for="card in abuseCards" :key="card.title" class="report-card" @click="toggleItem($event)">
            <div class="report-card-header">
              <span class="report-card-icon">{{ card.icon }}</span>
              <h4>{{ card.title }}</h4>
              <span class="chevron">▼</span>
            </div>
            <div class="report-card-body">
              <div class="report-card-body-inner" v-html="card.body"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- BPO Ground Zero -->
      <div class="report-section" id="bpo">
        <div class="report-section-number">04</div>
        <h2>Why the BPO Industry Became Ground Zero</h2>
        <p>The Philippine BPO sector's WFH trajectory was uniquely shaped by the collision between government fiscal policy, foreign client demands, and worker preferences.</p>
        <div class="report-callout info">
          <div class="report-callout-title">The PEZA Constraint</div>
          <p>Companies registered in special economic zones received income tax holidays, a preferential 5% gross income tax rate, VAT exemptions, and duty-free importation. When FIRB required physical presence to keep these benefits, BPO companies faced an existential choice: allow WFH and lose tax perks, or mandate RTO and keep them.</p>
        </div>
        <h3>Foreign Client Demands</h3>
        <p>Companies handling healthcare data (HIPAA), financial information (PCI-DSS), and government contracts faced client mandates for physically secured offices. <strong>Data security was the most concrete, least ideological justification for RTO.</strong></p>
        <h3>IBPAP's Fight — and Partial Victory</h3>
        <p>The industry association consistently lobbied for WFH allowances. IBPAP was instrumental in securing the <strong>CREATE MORE Act's provisions allowing up to 50% WFH</strong> for registered IT-BPM firms.</p>
        <div class="report-callout warning">
          <div class="report-callout-title">Competitive Risk</div>
          <p>India's major IT companies pushed aggressive RTO in 2023–2024. The Philippines risked losing talent to fully remote international positions rather than to rival outsourcing destinations.</p>
        </div>
      </div>

      <!-- Commute Crisis -->
      <div class="report-section" id="commute">
        <div class="report-section-number">05</div>
        <h2>Manila's Commute Crisis Makes WFH Existential</h2>
        <p><strong>Metro Manila's commute is the single most powerful driver of WFH demand</strong> — more than work-life balance, productivity, or any Western WFH talking point.</p>
        <div class="report-stat-grid">
          <div class="report-stat-card">
            <span class="value" style="color: var(--report-accent)">1.5–4 hrs</span>
            <span class="desc">Average one-way commute</span>
          </div>
          <div class="report-stat-card">
            <span class="value" style="color: var(--report-accent2)">₱3.5B</span>
            <span class="desc">Daily cost of congestion (JICA est.)</span>
          </div>
          <div class="report-stat-card">
            <span class="value" style="color: var(--report-accent4)">₱8–12K</span>
            <span class="desc">Monthly commute cost</span>
          </div>
          <div class="report-stat-card">
            <span class="value" style="color: var(--report-accent3)">15–20</span>
            <span class="desc">Typhoons per year</span>
          </div>
        </div>
        <p>When Filipino workers say WFH gave them back <strong>"4–6 hours of my life daily,"</strong> they mean it literally. <strong>Every RTO mandate is functionally a pay cut.</strong></p>
        <div class="report-quote">"Workers regularly wade through chest-deep floodwaters to reach offices."<span class="source">— common during typhoon season, with 15–20 typhoons annually</span></div>
        <h3>The Provincial Migration</h3>
        <p>Workers relocated to Cebu, Davao, Iloilo, and Baguio — or returned home to care for aging parents while maintaining Manila-level salaries. <strong>"Probinsya life"</strong> gained traction on social media. Being forced back to Manila means the dissolution of an entire lifestyle restructuring.</p>
      </div>

      <!-- Cultural Fault Lines -->
      <div class="report-section" id="culture">
        <div class="report-section-number">06</div>
        <h2>Cultural Fault Lines</h2>
        <p>The WFH debate is inflected by specific cultural dynamics that shape how both abuse and resistance are framed.</p>
        <div class="report-term-list">
          <div v-for="term in culturalTerms" :key="term.word" class="report-term-item">
            <div class="report-term-word">{{ term.word }} <span v-if="term.pron" class="pron">{{ term.pron }}</span></div>
            <div class="report-term-def" v-html="term.def"></div>
          </div>
        </div>
      </div>

      <!-- The Numbers -->
      <div class="report-section" id="data">
        <div class="report-section-number">07</div>
        <h2>The Numbers: A Massive Preference Gap</h2>
        <p>Survey data reveals a significant employer-employee divide on WFH in the Philippines.</p>
        <h3>Worker Preferences</h3>
        <div class="report-bar-chart">
          <div v-for="bar in workerBars" :key="bar.label" class="report-bar-row">
            <span class="report-bar-label">{{ bar.label }}</span>
            <div class="report-bar-track" :style="{ '--w': bar.width }">
              <div class="report-bar-fill" :style="{ background: bar.gradient }">{{ bar.value }}</div>
            </div>
          </div>
        </div>
        <h3>Employer Preferences</h3>
        <div class="report-bar-chart">
          <div v-for="bar in employerBars" :key="bar.label" class="report-bar-row">
            <span class="report-bar-label">{{ bar.label }}</span>
            <div class="report-bar-track" :style="{ '--w': bar.width }">
              <div class="report-bar-fill" :style="{ background: bar.gradient }">{{ bar.value }}</div>
            </div>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--report-text-muted);">Sources: Jobstreet "Decoding Global Talent" 2022, Sprout Solutions Workplace Survey 2023</p>
        <div class="report-stat-grid">
          <div class="report-stat-card">
            <span class="value" style="color: var(--report-accent3)">3×</span>
            <span class="desc">Broadband speed increase 2019→2024</span>
          </div>
          <div class="report-stat-card">
            <span class="value" style="color: var(--report-accent2)">₱1.5–2.5K</span>
            <span class="desc">Monthly home internet cost</span>
          </div>
          <div class="report-stat-card">
            <span class="value" style="color: var(--report-accent)">₱10–12</span>
            <span class="desc">Per kWh electricity (among Asia's highest)</span>
          </div>
        </div>
      </div>

      <!-- Conclusion -->
      <div class="report-section" id="conclusion">
        <div class="report-section-number">08</div>
        <h2>Conclusion</h2>
        <p>The Filipino WFH debate is not a simple productivity argument. It is a collision between <strong>fiscal policy architecture</strong> (PEZA's economic zone model), <strong>infrastructure failure</strong> (Manila's transport crisis), <strong>cultural assumptions</strong> about worker trustworthiness, and a genuine but amplified catalogue of worker misconduct.</p>
        <div class="report-quote">Filipino workers see WFH not as a perk but as compensation for a broken urban infrastructure — and losing it feels like punishment for systemic failures they didn't create.</div>
        <p>The CREATE MORE Act's codification of 50% WFH for registered IT-BPM firms represents a partial resolution, but the deeper trust question remains unresolved.</p>
        <p><strong>The abuse narratives are real but isolated; the structural incentives for WFH are overwhelming.</strong> What Filipino social media reveals most clearly is that the WFH debate is, at bottom, a proxy war over who bears the cost of the Philippines' infrastructure deficit — and workers are losing.</p>
      </div>

    </main>

    <footer class="report-footer">
      <p>Research compiled from r/phcareers, r/Philippines, r/antiworkPH, Twitter/X, Facebook, and TikTok</p>
      <p style="margin-top: 8px;"><NuxtLink to="/">← tomatamagotato.com</NuxtLink></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'How Filipino Workers Lost WFH — Sentiment Analysis | tomatamagotato',
  meta: [{ name: 'description', content: 'An interactive analysis of Filipino sentiment on Work From Home — from pandemic adaptation to strategic resignation.' }]
})

const { tocScrolled, activeSection, toggleItem, toggleExpand, initAll } = useReport()

onMounted(initAll)

const tocLinks = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'blame', label: 'Blame Hierarchy' },
  { id: 'abuse', label: 'Abuse Stories' },
  { id: 'bpo', label: 'BPO Ground Zero' },
  { id: 'commute', label: 'Commute Crisis' },
  { id: 'culture', label: 'Cultural Fault Lines' },
  { id: 'data', label: 'The Numbers' },
  { id: 'conclusion', label: 'Conclusion' },
]

const timelinePhases = [
  { year: '2020', title: 'Chaotic Adaptation', body: 'When Duterte declared Enhanced Community Quarantine, BPO companies scrambled to send ~1.3 million workers home with laptops and VPNs. Workers in cramped Manila apartments (18–24 sqm studios) struggled with noise, shared spaces, and unreliable internet. The dominant tone was survival, not celebration.' },
  { year: '2021', title: 'The Revelation', body: 'Workers adapted, internet improved, and a powerful realization crystallized: commute-free life was transformative. Workers calculated savings of ₱5,000–15,000/month on transport, food, and clothing — significant when BPO entry salaries range from ₱18,000–25,000.' },
  { year: '2022–23', title: 'Political Fury', body: "FIRB's pandemic WFH allowances expired April 1, 2022, requiring PEZA-registered companies to bring workers back or forfeit tax holidays. Online discourse exploded. After IBPAP lobbying, a 70/30 compromise (70% onsite, 30% WFH) emerged in September 2022." },
  { year: '2023–24', title: 'Blame Narratives', body: 'Workers began pointing fingers at colleagues who allegedly ruined WFH for everyone. The overemployment discourse peaked. Companies deployed aggressive monitoring software, generating privacy backlash.' },
  { year: '2024–26', title: 'Strategic Resignation', body: 'The CREATE MORE Act codified up to 50% WFH for IT-BPM firms — a major policy victory. But many workers shifted from protest to individual action: filtering jobs for remote-only, moving into freelancing, or accepting the "WFH premium" (lower pay for remote work).' },
]

const blameItems = [
  { rank: '#1', width: '90%', color: 'var(--report-accent)', name: 'Government Policy (PEZA / FIRB)', detail: 'Fiscal incentives were weaponized to force BPO workers into offices — not for productivity, but to protect commercial real estate landlords and the businesses surrounding office districts in BGC, Makati, and Ortigas.' },
  { rank: '#2', width: '65%', color: 'var(--report-accent4)', name: 'Corporate Control & Real Estate Interests', detail: 'Workers cite companies\' long-term office leases and middle management\'s need to feel important. "They trust us with their data but not with our time."' },
  { rank: '#3', width: '40%', color: 'var(--report-accent2)', name: 'Fellow Workers Who Abused WFH', detail: 'The most internally contentious target. But rebuttals are swift: "Slackers exist in the office too, they just look busy. WFH just made it measurable."' },
]

const abuseCards = [
  { icon: '😴', title: 'Sleeping During Shifts', body: '<p>The most commonly cited abuse, particularly for BPO workers on graveyard shifts serving U.S. time zones.</p><p>The counter-narrative: some workers openly admit napping but insist they met all KPIs.</p>' },
  { icon: '💼', title: 'Overemployment (J1, J2, J3)', body: '<p>The most divisive topic. Workers adopted the "overemployed" trend — holding two or three full-time remote jobs. Defenders frame it as "diskarte" (resourcefulness); critics call it fraud.</p>' },
  { icon: '💻', title: 'Unreturned Equipment', body: '<p>BPO companies distributed laptops, monitors, headsets, chairs. Reports circulated of resigned employees selling company laptops on Facebook Marketplace and Carousell PH.</p>' },
  { icon: '👻', title: 'Ghost Employees & Side Businesses', body: '<p>Workers used mouse jigglers and auto-clickers to simulate activity while running Shopee/Lazada stores, freelancing on Upwork, or watching Netflix.</p>' },
]

const culturalTerms = [
  { word: 'Diskarte', pron: '/dis·kar·te/', def: 'Resourcefulness, street-smarts, creative problem-solving. Pro-WFH workers use it to describe smart career management. Critics use it pejoratively: <em>"diskarte ng tamad"</em> — resourcefulness of the lazy.' },
  { word: 'Crab Mentality', pron: 'utak talangka', def: 'The idea that people pull others down to prevent them from succeeding. Workers who report colleagues\' misconduct are sometimes accused of crab mentality.' },
  { word: 'Paternalistic Supervision', pron: null, def: '<em>"Pag walang nagbabantay, walang gagawa"</em> — if no one is watching, no one will work. Surveillance tools deployed — keystroke loggers, screenshot captures every 5 minutes — represent a digital recreation of physical oversight.' },
]

const workerBars = [
  { label: 'Hybrid', width: '63%', value: '~63%', gradient: 'linear-gradient(90deg, var(--report-accent4), var(--report-accent5))' },
  { label: 'Fully Remote', width: '22%', value: '~22%', gradient: 'linear-gradient(90deg, var(--report-accent3), var(--report-accent4))' },
  { label: 'Fully Onsite', width: '17%', value: '~17%', gradient: 'linear-gradient(90deg, var(--report-accent), var(--report-accent2))' },
]

const employerBars = [
  { label: 'Fully Onsite', width: '48%', value: '~48%', gradient: 'linear-gradient(90deg, var(--report-accent), var(--report-accent2))' },
  { label: 'Hybrid', width: '40%', value: '~40%', gradient: 'linear-gradient(90deg, var(--report-accent4), var(--report-accent5))' },
  { label: 'Fully Remote', width: '12%', value: '~12%', gradient: 'linear-gradient(90deg, var(--report-accent3), var(--report-accent4))' },
]
</script>

<style src="~/assets/css/report.css"></style>
