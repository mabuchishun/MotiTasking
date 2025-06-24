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
import { computed, onMounted, ref } from 'vue';

const tasks = ref([]);
const stats = ref({
    totalPoints: 0,
    currentStreak: 0,
    completedTasks: 0,
});
const userProfile = ref({ name: 'User', avatar: '' });

onMounted(() => {
    loadData();
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
    return [...MOCK_USERS]
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
    <div class="flex flex-col justify-center items-center min-h-screen bg-surface-50">
        <div class="w-full flex justify-center mb-6">
            <Message :severity="msgSeverity" class="dashboard-banner-message text-lg font-semibold px-8 py-4">
                {{ motivationalMsg }}
            </Message>
        </div>
        <div class="card p-6 w-full max-w-2xl flex flex-col items-center gap-6">
            <div class="flex flex-col items-center gap-2">
                <Avatar :image="userProfile.avatar || undefined" :label="!userProfile.avatar ? userInitials : undefined" size="xlarge" shape="circle" class="mb-2" />
                <div class="font-bold text-lg">{{ userProfile.name }}</div>
                <div class="text-sm text-500 mb-2">{{ userTitle }}</div>
            </div>
            <div class="flex flex-wrap justify-center gap-8 w-full">
                <div class="flex flex-col items-center">
                    <span class="text-xs mb-1">Total Task Completed</span>
                    <div class="completed-tasks-number">{{ completedTasks }}</div>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-xs mb-1">Total Points</span>
                    <div class="points-badge flex align-items-center"><i class="pi pi-star-fill mr-2"></i><span class="points-text text-lg">{{ totalPoints }}</span></div>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-xs mb-1">Current Streak</span>
                    <div class="streak-badge flex align-items-center"><i class="pi pi-fire mr-2"></i><span class="streak-text text-lg">{{ currentStreak }} days</span></div>
                </div>
            </div>
            <div class="flex flex-wrap justify-center gap-4 mt-4">
                <router-link to="/tasks"><Button label="New Task" icon="pi pi-plus" class="p-button-lg" /></router-link>
                <router-link to="/leaderboard"><Button label="Leaderboard" icon="pi pi-trophy" class="p-button-lg p-button-secondary" /></router-link>
            </div>
            <Accordion class="w-full mt-6">
                <AccordionTab header="Unlocked Badges" :disabled="unlockedBadges.length === 0">
                    <div v-if="unlockedBadges.length === 0" class="text-center text-500">No badges unlocked yet.</div>
                    <div v-else class="flex flex-wrap gap-4 justify-center">
                        <div v-for="badge in unlockedBadges" :key="badge.id" class="flex flex-col items-center gap-2">
                            <Avatar :icon="badge.icon" size="large" :style="{ background: 'var(--primary-color)', color: '#fff' }" />
                            <Tag :value="badge.name" :severity="badge.color" class="font-semibold" />
                            <span class="text-xs text-500">{{ badge.description }}</span>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </div>
        <!-- Mini Leaderboard Preview -->
        <div class="card p-4 w-full max-w-2xl mt-4">
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
        <div class="card p-4 w-full max-w-2xl mt-4">
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
</template>

<style scoped>
.dashboard-banner-message {
    border-radius: 1rem;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
    max-width: 700px;
    width: 100%;
    text-align: center;
}
.points-badge {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    font-weight: 600;
}
.streak-badge {
    background-color: var(--orange-500);
    color: var(--orange-50);
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    font-weight: 600;
}
.achievement-badges {
    display: flex;
    align-items: center;
}
.completed-tasks-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--primary-color);
    background: var(--surface-card);
    border-radius: 1rem;
    padding: 0.5rem 2rem;
    margin-top: 0.25rem;
    box-shadow: 0 2px 8px 0 rgba(16,185,129,0.08);
}
.challenge-row {
    transition: box-shadow 0.2s;
}
.challenge-row[style*='green'] {
    background: #f0fdfa;
}
</style>
