<template>
  <div class="achievements-page flex flex-col items-center py-8 px-2 min-h-screen">
    <h2 class="text-3xl font-bold mb-6">My Achievements</h2>
    <div class="flex flex-wrap gap-6 justify-center">
      <div v-for="badge in BADGES" :key="badge.id" :class="['card flex flex-col items-center p-6 w-72', { 'locked': !isUnlocked(badge) }]">
        <Avatar :icon="badge.icon" size="xlarge" :style="isUnlocked(badge) ? { background: 'var(--primary-color)', color: '#fff' } : { filter: 'grayscale(1)', opacity: 0.5, background: '#e5e7eb', color: '#9ca3af' }" class="mb-3" />
        <div class="font-bold text-lg mb-1" :style="isUnlocked(badge) ? {} : { color: '#9ca3af' }">{{ badge.name }}</div>
        <div class="text-sm text-500 mb-2">{{ badge.description }}</div>
        <div v-if="!isUnlocked(badge)" class="text-xs text-gray-400 mb-2">Locked</div>
        <div v-else class="flex gap-2 mt-2">
          <Button icon="pi pi-twitter" class="p-button-rounded p-button-info" @click="shareBadge(badge, 'twitter')" v-tooltip.top="'Share on Twitter'" />
          <Button icon="pi pi-facebook" class="p-button-rounded p-button-primary" @click="shareBadge(badge, 'facebook')" v-tooltip.top="'Share on Facebook'" />
          <Button icon="pi pi-copy" class="p-button-rounded p-button-secondary" @click="shareBadge(badge, 'copy')" v-tooltip.top="'Copy to Clipboard'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';
import TaskService from '@/services/TaskService';
import { BADGES } from '@/services/badges';

const userStats = ref({ totalPoints: 0, completedTasks: 0, currentStreak: 0 });
const unlocked = ref([]);

onMounted(() => {
  const stats = TaskService.getUserStats();
  userStats.value = stats;
  unlocked.value = stats.achievements || [];
});

function isUnlocked(badge) {
  // Unlock logic based on badge type
  if (badge.id === 1) {
    // Rookie: Earn 100 points
    return userStats.value.totalPoints >= badge.threshold;
  } else if (badge.id === 2) {
    // Streaker: 5-day streak
    return userStats.value.currentStreak >= badge.threshold;
  } else if (badge.id === 3) {
    // Task Titan: Complete 25 tasks
    return userStats.value.completedTasks >= badge.threshold;
  }
  // fallback to achievements array
  return unlocked.value.some(a => a.id === badge.id);
}

function shareBadge(badge, platform) {
  const text = `I just unlocked the '${badge.name}' badge on MotiTasking! ${badge.description} #MotiTasking`;
  const url = encodeURIComponent(window.location.origin);
  if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  } else if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`, '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(`${text} ${window.location.origin}`);
    alert('Share message copied to clipboard!');
  }
}
</script>

<style scoped>
.achievements-page {
  background: #f8fafc;
}
.card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  min-width: 250px;
  max-width: 320px;
  transition: filter 0.2s, opacity 0.2s;
  height: 260px; /* Ensures all cards have the same height */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card.locked {
  filter: grayscale(1);
  opacity: 0.6;
}
</style> 