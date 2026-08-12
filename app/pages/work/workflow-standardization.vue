<template>
  <div class="case-study-page">
    <NuxtLink class="case-study-back" to="/work">&larr; Back to work</NuxtLink>

    <div class="case-study-intro">
      <h1>Workflow standardization</h1>
      <p>Bulk tools for keeping a schedule consistent across a team: applying an adjustment across people who don't share the same template, and marking a rest day without touching each record by hand.</p>
    </div>

    <WorkVideoTabViewer :clips="clips" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Workflow standardization | tomatamagotato' })

const clips = [
  {
    label: 'Create adjustment',
    caption: 'Applying a schedule adjustment across a selection that spans more than one template surfaces a heterogeneity warning before it goes through.',
    src: '/videos/work/create-adjustment.webm'
  },
  {
    label: 'Mark rest',
    caption: 'Marking a rest day for a selected group in one action instead of editing each person\'s record individually.',
    src: '/videos/work/mark-rest.webm'
  }
]
</script>

<style src="~/assets/css/work-case-study.css"></style>
