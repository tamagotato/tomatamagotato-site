<template>
  <div class="case-study-page">
    <NuxtLink class="case-study-back" to="/work">&larr; Back to work</NuxtLink>

    <div class="case-study-intro">
      <h1>Overtime governance</h1>
      <p>Overtime requests get validated before they're approved, not after. These two clips show the batch-approval flow and what happens when one request in a batch fails validation.</p>
    </div>

    <WorkVideoTabViewer :clips="clips" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Overtime governance | tomatamagotato' })

const clips = [
  {
    label: 'Add overtime',
    caption: 'Selecting multiple team members and filing overtime for all of them in one batch action.',
    src: '/videos/work/add-ot.webm'
  },
  {
    label: 'Partial failure',
    caption: 'When one request in a batch breaks policy, the system applies the rest and flags only the one that failed — nothing silently succeeds or silently fails as a group.',
    src: '/videos/work/partial-failure.webm'
  }
]
</script>

<style src="~/assets/css/work-case-study.css"></style>
