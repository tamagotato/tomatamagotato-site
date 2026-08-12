<template>
  <div class="case-study-page">
    <NuxtLink class="case-study-back" to="/work">&larr; Back to work</NuxtLink>

    <div class="case-study-intro">
      <h1>Attendance and utilization tracking</h1>
      <p>Five pieces of the same system: viewing attendance detail, tracking activity across service streams, managing large teams, and handling the edge cases that come with real shift schedules.</p>
    </div>

    <WorkVideoTabViewer :clips="clips" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Attendance and utilization tracking | tomatamagotato' })

const clips = [
  {
    label: 'Attendance',
    caption: 'Viewing a shift bar pulls up the day\'s attendance detail without leaving the schedule view.',
    src: '/videos/work/attendance.webm'
  },
  {
    label: 'Activity tracker',
    caption: 'Stopping then starting a new activity inserts an Idle row for the gap. Switching directly between activities does not — the timer never stops.',
    src: '/videos/work/activity-tracker.webm'
  },
  {
    label: 'Grouping',
    caption: 'Large teams collapse into headers with filter chips, so a manager can narrow to who is on shift right now.',
    src: '/videos/work/grouping.webm'
  },
  {
    label: 'Night shift',
    caption: 'A shift spanning midnight reads as one continuous block, with a boundary marker rather than being split across two days.',
    src: '/videos/work/night-shift.webm'
  },
  {
    label: 'Past weeks',
    caption: 'Past weeks are read-only. The current week can carry a double shift, shown as two stacked bars on the same day.',
    src: '/videos/work/past-weeks.webm'
  }
]
</script>

<style src="~/assets/css/work-case-study.css"></style>
