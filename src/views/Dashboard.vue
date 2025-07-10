<script setup>
import TaskService from '@/services/TaskService';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Message from 'primevue/message';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import { computed, onMounted, ref, onUnmounted } from 'vue';
import Dialog from 'primevue/dialog';
import Tooltip from 'primevue/tooltip';
import { ref as vueRef } from 'vue';

const showOnboarding = vueRef(false);

const tasks = ref([]);
const stats = ref({
    totalPoints: 0,
    currentStreak: 0,
    completedTasks: 0,
});
const userProfile = ref({ name: 'User', avatar: '' });

onMounted(() => {
    loadData();
    TaskService.subscribe(loadData);
    checkAndUpdateStreak();
    if (!localStorage.getItem('onboardingComplete')) {
        showOnboarding.value = true;
    }
});

onUnmounted(() => {
    TaskService.unsubscribe(loadData);
});

// Quick fix: reload profile when activated (for keep-alive views)
if (typeof activated === 'undefined') {
  // Vue 2 compatibility: do nothing
} else {
  activated(() => {
    loadData();
  });
}

function loadData() {
    tasks.value = TaskService.getTasks();
    stats.value = TaskService.getUserStats();
    userProfile.value = TaskService.getUserProfile();
}

function checkAndUpdateStreak() {
    const statsData = TaskService.getUserStats();
    if (!statsData.lastCompletionDate) return;
    const lastDate = new Date(statsData.lastCompletionDate);
    lastDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
        // User opened dashboard the day after last completion, increment streak
        TaskService.updateStreak(statsData.currentStreak + 1);
        TaskService.updateLastCompletionDate(today.toISOString());
        loadData();
    }
}

function closeOnboarding() {
    showOnboarding.value = false;
    localStorage.setItem('onboardingComplete', '1');
}

const userInitials = computed(() => userProfile.value.name.split(' ').map(w => w[0]).join('').toUpperCase());
const userTitle = computed(() => 'Task Master');
const completionPercentage = computed(() => {
    if (!tasks.value.length) return 0;
    const completed = tasks.value.filter(t => t.completed).length;
    return Math.round((completed / tasks.value.length) * 100);
});
const totalPoints = computed(() => stats.value.totalPoints);
const currentStreak = computed(() => stats.value.currentStreak);
const completedTasks = computed(() => stats.value.completedTasks);

// Badge system
const BADGES = [
    { id: 1, name: 'Rookie', description: 'Earn 100 points', unlocked: computed(() => totalPoints.value >= 100), icon: 'pi pi-star', color: 'info' },
    { id: 2, name: 'Streaker', description: '5-day streak', unlocked: computed(() => currentStreak.value >= 5), icon: 'pi pi-fire', color: 'warning' },
    { id: 3, name: 'Task Titan', description: 'Complete 25 tasks', unlocked: computed(() => completedTasks.value >= 25), icon: 'pi pi-check-circle', color: 'success' },
];
const unlockedBadges = computed(() => BADGES.filter(b => b.unlocked.value));

let motivationalMsg = '';
let msgSeverity = 'info';
if (completedTasks.value === 0) {
    motivationalMsg = "Every great journey starts with a single task. Let's go!";
    msgSeverity = 'info';
} else if (completedTasks.value === 3) {
    motivationalMsg = "You're gaining momentum! Keep it up!";
    msgSeverity = 'success';
} else if (completedTasks.value >= 5) {
    motivationalMsg = "You're on 🔥! Task Master mode engaged.";
    msgSeverity = 'warning';
}

// Mini leaderboard preview (top 3)
const MOCK_USERS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Product Manager',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        points: 2450,
        streak: 12,
        tasksCompleted: 156
    },
    {
        id: 2,
        name: 'Michael Chen',
        title: 'Senior Developer',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        points: 1980,
        streak: 8,
        tasksCompleted: 132
    },
    {
        id: 3,
        name: 'Emma Wilson',
        title: 'UX Designer',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        points: 1750,
        streak: 15,
        tasksCompleted: 98
    },
    {
        id: 4,
        name: 'David Kim',
        title: 'Project Lead',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        points: 1620,
        streak: 5,
        tasksCompleted: 87
    },
    {
        id: 5,
        name: 'Lisa Anderson',
        title: 'QA Engineer',
        avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
        points: 1450,
        streak: 7,
        tasksCompleted: 76
    },
    {
        id: 6,
        name: 'James Wilson',
        title: 'Frontend Developer',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
        points: 1320,
        streak: 4,
        tasksCompleted: 65
    },
    {
        id: 7,
        name: 'Maria Garcia',
        title: 'Backend Developer',
        avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
        points: 1180,
        streak: 6,
        tasksCompleted: 54
    },
    {
        id: 8,
        name: 'Robert Taylor',
        title: 'DevOps Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
        points: 1050,
        streak: 3,
        tasksCompleted: 48
    }
];
const leaderboardTop3 = computed(() => {
    // Add current user to the leaderboard if not present
    const user = {
        id: 'current',
        name: userProfile.value.name,
        title: userTitle.value,
        avatar: userProfile.value.avatar,
        points: totalPoints.value,
        streak: currentStreak.value,
        tasksCompleted: completedTasks.value
    };
    let allUsers = [...MOCK_USERS];
    // Check if user is already in the leaderboard (by name or id)
    if (!allUsers.some(u => u.name === user.name)) {
        allUsers.push(user);
    } else {
        // Optionally update the user's stats if already present
        allUsers = allUsers.map(u => u.name === user.name ? { ...u, ...user } : u);
    }
    return allUsers
        .sort((a, b) => b.points - a.points)
        .slice(0, 3);
});

const today = new Date().toISOString().slice(0, 10);
const tasksCompletedToday = computed(() => tasks.value.filter(t => t.completed && t.deadline && t.deadline.slice(0, 10) === today).length);

const challenges = computed(() => [
  {
    id: 1,
    title: 'Complete 3 tasks today',
    reward: '+30 points',
    progress: Math.min(tasksCompletedToday.value / 3, 1),
    current: tasksCompletedToday.value,
    target: 3,
    completed: tasksCompletedToday.value >= 3
  },
  {
    id: 2,
    title: 'Maintain 5-day streak',
    reward: '+100 points',
    progress: Math.min(currentStreak.value / 5, 1),
    current: currentStreak.value,
    target: 5,
    completed: currentStreak.value >= 5
  },
  {
    id: 3,
    title: 'Earn 500 points total',
    reward: 'Badge unlocked',
    progress: Math.min(totalPoints.value / 500, 1),
    current: totalPoints.value,
    target: 500,
    completed: totalPoints.value >= 500
  }
]);
</script>

<template>
    <Dialog v-model:visible="showOnboarding" :modal="true" header="Welcome to MotiTasking!" :style="{ width: '500px' }">
        <div class="onboarding-content">
            <h3>Get the most out of MotiTasking</h3>
            <ul class="onboarding-list">
                <li><b>Points System:</b> Earn points for every task you complete. Higher priority tasks give more points.</li>
                <li><b>Streak Mechanics:</b> Complete at least one task each day to build your streak. Your streak increases every day you return and complete a task!</li>
                <li><b>Rewards & Badges:</b> Unlock badges and rewards as you accumulate points and maintain streaks. Check your progress in the dashboard!</li>
            </ul>
            <div class="flex justify-end mt-4">
                <Button label="Got it!" @click="closeOnboarding" />
            </div>
        </div>
    </Dialog>
    <div class="dashboard-bg min-h-screen flex flex-col items-center justify-center py-8 px-2">
        <div class="dashboard-main-card card flex flex-row gap-8 p-8 w-full max-w-5xl items-start justify-center">
            <div class="flex-1 flex flex-col items-center gap-6">
                <Avatar :image="userProfile.avatar || undefined" :label="!userProfile.avatar ? userInitials : undefined" size="xlarge" shape="circle" class="dashboard-avatar" />
                <div class="font-bold text-lg mt-2">{{ userProfile.name }}</div>
                <div class="text-sm text-500 mb-2">{{ userTitle }}</div>
                <div class="flex flex-row gap-8 w-full justify-center">
                    <div class="flex flex-col items-center">
                        <span class="text-xs mb-1">Total Task Completed</span>
                        <div class="dashboard-stat-number">{{ completedTasks }}</div>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-xs mb-1 flex items-center gap-1">Total Points
                            <i class="pi pi-info-circle text-primary cursor-pointer" v-tooltip.top="'Earn points for every completed task. Higher priority = more points.'"></i>
                        </span>
                        <div class="dashboard-stat-number dashboard-stat-points flex align-items-center"><i class="pi pi-star-fill mr-2"></i><span class="points-text text-lg">{{ totalPoints }}</span></div>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-xs mb-1 flex items-center gap-1">Current Streak
                            <i class="pi pi-info-circle text-primary cursor-pointer" v-tooltip.top="'Complete at least one task each day to build your streak.'"></i>
                        </span>
                        <div class="dashboard-stat-number dashboard-stat-streak flex align-items-center"><i class="pi pi-fire mr-2"></i><span class="streak-text text-lg">{{ currentStreak }} days</span></div>
                    </div>
                </div>
                <div class="flex flex-row gap-4 mt-4">
                    <router-link to="/tasks"><Button label="New Task" icon="pi pi-plus" class="p-button-lg animated-action" v-tooltip.top="'Create a new task'" /></router-link>
                    <router-link to="/leaderboard"><Button label="Leaderboard" icon="pi pi-trophy" class="p-button-lg p-button-secondary animated-action" v-tooltip.top="'View the leaderboard'" /></router-link>
                    <router-link to="/achievements"><Button label="Achievements" icon="pi pi-medal" class="p-button-lg p-button-help animated-action" v-tooltip.top="'See your achievements and badges'" /></router-link>
                </div>
                <!-- Remove Accordion and AccordionTab for badges, always show badges section -->
                <div class="w-full mt-6">
                    <div class="font-bold text-lg mb-2">Unlocked Badges</div>
                    <div v-if="unlockedBadges.length === 0" class="text-center text-500">No badges unlocked yet.</div>
                    <div v-else class="flex flex-wrap gap-4 justify-center">
                        <div v-for="badge in unlockedBadges" :key="badge.id" class="flex flex-col items-center gap-2">
                            <Avatar :icon="badge.icon" size="large" :style="{ background: 'var(--primary-color)', color: '#fff' }" />
                            <Tag :value="badge.name" :severity="badge.color" class="font-semibold" />
                            <span class="text-xs text-500">{{ badge.description }}
                                <i class="pi pi-info-circle text-primary cursor-pointer ml-1" v-tooltip.top="'Unlock badges by earning points and maintaining streaks.'"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dashboard-challenges flex-1 max-w-xs w-full">
                <div class="font-bold text-lg mb-4">Challenges</div>
                <div class="flex flex-col gap-5">
                    <div v-for="challenge in challenges" :key="challenge.id" class="challenge-row flex flex-col gap-2 p-3 rounded-lg border border-surface-200 bg-surface-0">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-semibold">{{ challenge.title }}</span>
                                <span class="ml-2 text-xs text-green-600" v-if="challenge.completed"><i class="pi pi-check-circle mr-1"/>Completed</span>
                            </div>
                            <span class="text-sm text-primary font-bold">{{ challenge.reward }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <ProgressBar :value="challenge.progress * 100" :showValue="false" style="flex:1; height: 10px;" />
                            <span class="text-xs text-500 ml-2">{{ Math.min(challenge.current, challenge.target) }} / {{ challenge.target }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card p-4 w-full max-w-5xl mt-8">
            <div class="flex justify-between items-center mb-3">
                <div class="font-bold text-lg">Leaderboard Preview</div>
                <router-link to="/leaderboard"><Button label="View Full Leaderboard" icon="pi pi-angle-right" class="p-button-sm p-button-text" /></router-link>
            </div>
            <DataTable :value="leaderboardTop3" :rows="3" class="p-datatable-sm" :paginator="false" responsiveLayout="scroll">
                <Column field="avatar" header="User" style="min-width: 180px">
                    <template #body="slotProps">
                        <div class="flex align-items-center">
                            <Avatar :image="slotProps.data.avatar" :label="slotProps.data.name[0]" class="mr-2" size="large" shape="circle" />
                            <div>
                                <div class="font-bold">{{ slotProps.data.name }}</div>
                                <div class="text-sm text-500">{{ slotProps.data.title }}</div>
                            </div>
                        </div>
                    </template>
                </Column>
                <Column field="points" header="Points" style="min-width: 100px">
                    <template #body="slotProps">
                        <div class="flex align-items-center">
                            <i class="pi pi-star-fill text-yellow-500 mr-2"></i>
                            <span class="font-bold">{{ slotProps.data.points.toLocaleString() }}</span>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
.dashboard-bg {
    background: #f8fafc;
}
.dashboard-main-card {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
    margin-bottom: 2rem;
}
.dashboard-challenges {
    background: #f9fafb;
    border-radius: 1rem;
    box-shadow: 0 1px 6px 0 rgba(16,185,129,0.04);
    padding: 2rem 1.5rem;
}
.challenge-row {
    transition: box-shadow 0.2s;
}
.challenge-row[style*='green'] {
    background: #f0fdfa;
}
.dashboard-stat-number {
    font-size: 2.2rem !important;
    font-weight: bold;
    color: var(--primary-color);
    background: var(--surface-card);
    border-radius: 2rem;
    padding: 0.5rem 2rem;
    margin-top: 0.25rem;
    box-shadow: 0 2px 8px 0 rgba(16,185,129,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    min-height: 56px;
}
.dashboard-stat-number span,
.dashboard-stat-number i {
    font-size: 2.2rem !important;
    line-height: 1;
}
.dashboard-stat-points {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
}
.dashboard-stat-streak {
    background-color: var(--orange-500);
    color: var(--orange-50);
}
.achievement-badges {
    display: flex;
    align-items: center;
}
.onboarding-content {
    padding: 1rem 0;
}
.onboarding-list {
    margin: 1rem 0 0 1rem;
    padding: 0;
    list-style: disc inside;
}
.animated-action {
  transition: box-shadow 0.2s, transform 0.2s;
}
.animated-action:hover, .animated-action:focus {
  box-shadow: 0 4px 16px 0 rgba(16,185,129,0.15);
  transform: translateY(-2px) scale(1.04);
  outline: none;
}
.dashboard-avatar {
  width: 120px !important;
  height: 120px !important;
  border: 4px solid var(--primary-color);
  box-shadow: 0 2px 8px 0 rgba(16,185,129,0.10);
}
</style>
