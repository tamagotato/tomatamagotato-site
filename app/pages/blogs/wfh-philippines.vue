<template>
  <div class="report-page">
    <!-- Hero -->
    <section class="report-hero">
      <div class="report-hero-content">
        <span class="report-badge">Sentiment Analysis Report</span>
        <h1>How Filipino Workers <span class="highlight">Lost WFH</span>, and Who They Blame</h1>
        <p class="report-hero-sub">Five years of grassroots sentiment across Reddit, Twitter/X, Facebook, and TikTok, from pandemic adaptation to strategic resignation.</p>
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
        <p>Filipino sentiment on Work From Home is not ambiguous. <strong>Workers want it back</strong>, and they blame government fiscal policy first, corporate real estate interests second, and a minority of colleagues who abused the arrangement third.</p>
        <p>The Philippine version of this debate differs from the Western one mostly because of two agencies. <strong>PEZA</strong> (Philippine Economic Zone Authority) and <strong>FIRB</strong> (Fiscal Incentives Review Board) pushed the BPO industry back into offices to preserve tax incentives that were written for physical economic zones.</p>
      </div>

      <!-- Timeline -->
      <div class="report-section" id="timeline">
        <div class="report-section-number">01</div>
        <h2>Five phases since 2020</h2>
        <p>Sentiment moved through five stages: <strong>necessity, enthusiasm, fury, blame, and strategic resignation</strong>.</p>
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
        <h2>The blame hierarchy</h2>
        <p>Workers online assign blame in a consistent order: <strong>PEZA first, corporations second, coworkers third</strong>.</p>
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
        <h2>The abuse stories employers cited</h2>
        <p>A few categories of WFH misconduct came up again and again in the case for returning to the office.</p>
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
        <h2>Why the BPO industry took the brunt of it</h2>
        <p>Three pressures landed on the BPO sector at once: government fiscal policy, foreign client requirements, and what workers themselves wanted.</p>
        <div class="report-callout info">
          <div class="report-callout-title">The PEZA constraint</div>
          <p>Companies registered in special economic zones received income tax holidays, a preferential 5% gross income tax rate, VAT exemptions, and duty-free importation. When FIRB required physical presence to keep these benefits, BPO companies had to choose: allow WFH and lose the tax perks, or mandate RTO and keep them.</p>
        </div>
        <h3>Foreign client demands</h3>
        <p>Companies handling healthcare data (HIPAA), financial information (PCI-DSS), and government contracts faced client requirements for physically secured offices. <strong>Data security was the most concrete argument for RTO, and the least ideological one.</strong></p>
        <h3>IBPAP's fight and partial win</h3>
        <p>The industry association lobbied for WFH allowances throughout. IBPAP helped secure the <strong>CREATE MORE Act's provisions allowing up to 50% WFH</strong> for registered IT-BPM firms.</p>
        <div class="report-callout warning">
          <div class="report-callout-title">Competitive risk</div>
          <p>India's major IT companies pushed hard on RTO in 2023 and 2024. The Philippines risked losing talent to fully remote international positions rather than to rival outsourcing destinations.</p>
        </div>
      </div>

      <!-- Commute Crisis -->
      <div class="report-section" id="commute">
        <div class="report-section-number">05</div>
        <h2>Manila's commute is the real driver</h2>
        <p><strong>The commute drives WFH demand here more than anything else</strong>, well ahead of work-life balance, productivity, or the arguments that dominate the Western version of this debate.</p>
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
        <div class="report-quote">"Workers regularly wade through chest-deep floodwaters to reach offices."<span class="source">A recurring account during typhoon season. The Philippines sees 15–20 typhoons a year.</span></div>
        <h3>The move to the provinces</h3>
        <p>Workers relocated to Cebu, Davao, Iloilo, and Baguio, or moved back home to care for aging parents while keeping Manila-level salaries. <strong>"Probinsya life"</strong> gained traction on social media. An RTO mandate asks those workers to undo all of it and move back.</p>
      </div>

      <!-- Cultural Fault Lines -->
      <div class="report-section" id="culture">
        <div class="report-section-number">06</div>
        <h2>Cultural fault lines</h2>
        <p>A few Filipino concepts shape how both the abuse and the resistance get framed.</p>
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
        <h2>The numbers: a wide preference gap</h2>
        <p>Survey data shows employers and employees want different things.</p>
        <h3>Worker preferences</h3>
        <div class="report-bar-chart">
          <div v-for="bar in workerBars" :key="bar.label" class="report-bar-row">
            <span class="report-bar-label">{{ bar.label }}</span>
            <div class="report-bar-track" :style="{ '--w': bar.width }">
              <div class="report-bar-fill" :style="{ background: bar.gradient }">{{ bar.value }}</div>
            </div>
          </div>
        </div>
        <h3>Employer preferences</h3>
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
        <p>This was never really an argument about productivity. PEZA's economic zone model set the tax rules, Manila's transport system made the commute unbearable, and a set of assumptions about whether workers can be trusted unsupervised sat underneath both. The stories about people abusing WFH are true, but they are a small part of what decided the outcome.</p>
        <div class="report-quote">Workers do not treat WFH as a perk. They treat it as compensation for infrastructure that does not work, which is why losing it feels like being punished for a problem they did not cause.</div>
        <p>The CREATE MORE Act's 50% WFH allowance for registered IT-BPM firms settled part of the fight. It did not settle the trust question.</p>
        <p><strong>The abuse is real but isolated. The structural case for WFH is overwhelming.</strong> Filipino social media makes the underlying question clear enough: someone has to absorb the cost of the country's infrastructure gap, and right now it is the workers.</p>
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
  title: 'How Filipino Workers Lost WFH: Sentiment Analysis | tomatamagotato',
  meta: [{ name: 'description', content: 'An interactive analysis of Filipino sentiment on Work From Home, from pandemic adaptation to strategic resignation.' }]
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
  { year: '2021', title: 'The Realization', body: 'Workers adapted and internet service improved. Life without a commute turned out to be worth a lot: workers calculated savings of ₱5,000 to ₱15,000 a month on transport, food, and clothing, against BPO entry salaries of ₱18,000 to ₱25,000.' },
  { year: '2022–23', title: 'Political Fury', body: "FIRB's pandemic WFH allowances expired April 1, 2022, requiring PEZA-registered companies to bring workers back or forfeit tax holidays. Online discourse exploded. After IBPAP lobbying, a 70/30 compromise (70% onsite, 30% WFH) emerged in September 2022." },
  { year: '2023–24', title: 'Blame Narratives', body: 'Workers started blaming colleagues who had allegedly ruined WFH for everyone. Talk about overemployment peaked. Companies rolled out monitoring software, which set off a backlash over privacy.' },
  { year: '2024–26', title: 'Strategic Resignation', body: 'The CREATE MORE Act codified up to 50% WFH for IT-BPM firms, a significant policy win. But many workers had already stopped protesting and started acting on their own: filtering job searches for remote-only, moving into freelancing, or accepting the "WFH premium" of lower pay for remote work.' },
]

const blameItems = [
  { rank: '#1', width: '90%', color: 'var(--report-accent)', name: 'Government Policy (PEZA / FIRB)', detail: 'Workers argue the tax incentives were used to push them back into offices for reasons that had nothing to do with productivity, and everything to do with protecting commercial landlords and the businesses that depend on foot traffic in BGC, Makati, and Ortigas.' },
  { rank: '#2', width: '65%', color: 'var(--report-accent4)', name: 'Corporate Control & Real Estate Interests', detail: 'Workers cite companies\' long-term office leases and middle management\'s need to feel important. "They trust us with their data but not with our time."' },
  { rank: '#3', width: '40%', color: 'var(--report-accent2)', name: 'Fellow Workers Who Abused WFH', detail: 'The most internally contentious target. But rebuttals are swift: "Slackers exist in the office too, they just look busy. WFH just made it measurable."' },
]

const abuseCards = [
  { icon: '😴', title: 'Sleeping During Shifts', body: '<p>The most commonly cited abuse, particularly for BPO workers on graveyard shifts serving U.S. time zones.</p><p>The counter-narrative: some workers openly admit napping but insist they met all KPIs.</p>' },
  { icon: '💼', title: 'Overemployment (J1, J2, J3)', body: '<p>The most divisive topic. Workers adopted the "overemployed" trend, holding two or three full-time remote jobs at once. Defenders frame it as "diskarte" (resourcefulness); critics call it fraud.</p>' },
  { icon: '💻', title: 'Unreturned Equipment', body: '<p>BPO companies distributed laptops, monitors, headsets, chairs. Reports circulated of resigned employees selling company laptops on Facebook Marketplace and Carousell PH.</p>' },
  { icon: '👻', title: 'Ghost Employees & Side Businesses', body: '<p>Workers used mouse jigglers and auto-clickers to simulate activity while running Shopee/Lazada stores, freelancing on Upwork, or watching Netflix.</p>' },
]

const culturalTerms = [
  { word: 'Diskarte', pron: '/dis·kar·te/', def: 'Resourcefulness, street-smarts, creative problem-solving. Pro-WFH workers use it to describe smart career management. Critics use it pejoratively: <em>"diskarte ng tamad"</em>, resourcefulness of the lazy.' },
  { word: 'Crab Mentality', pron: 'utak talangka', def: 'The idea that people pull others down to prevent them from succeeding. Workers who report colleagues\' misconduct are sometimes accused of crab mentality.' },
  { word: 'Paternalistic Supervision', pron: null, def: '<em>"Pag walang nagbabantay, walang gagawa"</em>: if no one is watching, no one will work. The surveillance tools companies deployed, like keystroke loggers and screenshot capture every 5 minutes, rebuild that same physical oversight in software.' },
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
