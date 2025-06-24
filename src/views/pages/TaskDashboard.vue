<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" :class="motivationalTheme">
                <div class="flex justify-content-between align-items-center mb-3">
                    <div class="flex align-items-center">
                        <div class="user-profile mr-4">
                            <Avatar :image="userProfile.avatar || undefined" :label="!userProfile.avatar ? userInitials : undefined" 
                                size="large" shape="circle" class="mr-2" />
                            <div class="user-info">
                                <div class="font-bold">{{ userProfile.name }}</div>
                                <div class="text-sm text-500">{{ userTitle }}</div>
                            </div>
                        </div>
                        <h5 class="mr-3">Total Task Completed</h5>
                        <div class="completed-tasks-number">{{ completedTasks }}</div>
                    </div>
                    <div class="flex align-items-center">
                        <div class="streak-badge mr-3" v-if="currentStreak > 0">
                            <i class="pi pi-fire mr-2"></i>
                            <span class="streak-text">{{ currentStreak }} Day Streak</span>
                        </div>
                        <div class="points-badge mr-3">
                            <i class="pi pi-star-fill mr-2"></i>
                            <span class="points-text">{{ totalPoints }} Points</span>
                        </div>
                        <div class="achievement-badges">
                            <Badge v-for="badge in unlockedBadges" 
                                   :key="badge.id" 
                                   :value="badge.name" 
                                   :severity="badge.severity"
                                   class="mr-2" />
                        </div>
                        <Button label="New Task" icon="pi pi-plus" @click="openNew" class="ml-3" />
                    </div>
                </div>

                <div class="motivational-message p-3 mb-3" :class="messageTheme">
                    <div class="flex align-items-center">
                        <i :class="messageIcon" class="mr-3 text-2xl"></i>
                        <div>
                            <div class="font-bold mb-1">{{ motivationalMessage.title }}</div>
                            <div class="text-sm">{{ motivationalMessage.message }}</div>
                        </div>
                    </div>
                </div>

                <DataTable :value="tasks" :paginator="true" :rows="10" dataKey="id" 
                    :rowsPerPageOptions="[5, 10, 25]" responsiveLayout="scroll">
                    <Column field="completed" header="Status" style="width: 5rem">
                        <template #body="slotProps">
                            <Checkbox v-model="slotProps.data.completed" :binary="true" @change="handleTaskCompletion(slotProps.data)" />
                        </template>
                    </Column>
                    <Column field="title" header="Task" style="min-width: 200px">
                        <template #body="slotProps">
                            <span :class="{ 'line-through': slotProps.data.completed }">
                                {{ slotProps.data.title }}
                            </span>
                        </template>
                    </Column>
                    <Column field="deadline" header="Deadline" style="min-width: 150px">
                        <template #body="slotProps">
                            {{ formatDeadline(slotProps.data.deadline) }}
                        </template>
                    </Column>
                    <Column field="priority" header="Priority" style="min-width: 120px">
                        <template #body="slotProps">
                            <Tag :severity="getPrioritySeverity(formatPriority(slotProps.data.priority))" 
                                :value="formatPriority(slotProps.data.priority)" />
                        </template>
                    </Column>
                    <Column field="description" header="Description" style="min-width: 250px" />
                    <Column header="Actions" style="width: 110px">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-text p-button-sm mr-2" @click="editTask(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="confirmDeleteTask(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <Dialog v-model:visible="taskDialog" :style="{width: '450px'}" header="Task Details" :modal="true" class="p-fluid">
            <div class="field">
                <label for="title">Title</label>
                <InputText id="title" v-model.trim="task.title" required autofocus :class="{'p-invalid': submitted && !task.title}" />
                <small class="p-error" v-if="submitted && !task.title">Title is required.</small>
            </div>
            <div class="field">
                <label for="description">Description</label>
                <Textarea id="description" v-model="task.description" rows="3" cols="20" />
            </div>
            <div class="field">
                <label for="deadline">Deadline</label>
                <Calendar id="deadline" v-model="task.deadline" dateFormat="dd/mm/yy" :showIcon="true" />
            </div>
            <div class="field">
                <label for="priority">Priority</label>
                <Dropdown id="priority" v-model="task.priority" :options="priorities" optionLabel="name" placeholder="Select a Priority">
                    <template #value="slotProps">
                        <Tag :severity="getPrioritySeverity(slotProps.value)" :value="slotProps.value" />
                    </template>
                    <template #option="slotProps">
                        <Tag :severity="getPrioritySeverity(slotProps.option.name)" :value="slotProps.option.name" />
                    </template>
                </Dropdown>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveTask" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import TaskService from '@/services/TaskService';
import Knob from 'primevue/knob';

const POINTS_PER_PRIORITY = {
    'High': 30,
    'Medium': 20,
    'Low': 10
};

const BADGES = [
    { id: 1, name: 'Novice', threshold: 100, severity: 'info' },
    { id: 2, name: 'Intermediate', threshold: 500, severity: 'success' },
    { id: 3, name: 'Expert', threshold: 1000, severity: 'warning' },
    { id: 4, name: 'Master', threshold: 2000, severity: 'danger' }
];

const MOTIVATIONAL_MESSAGES = {
    beginner: {
        title: "Welcome to Your Journey!",
        message: "Every great achievement starts with a single step. Let's begin your productivity adventure!",
        icon: "pi pi-heart",
        theme: "beginner-theme"
    },
    streak_3: {
        title: "Building Momentum!",
        message: "Three days strong! You're building a powerful habit. Keep the streak going!",
        icon: "pi pi-bolt",
        theme: "streak-theme"
    },
    streak_7: {
        title: "Week Warrior!",
        message: "A full week of consistency! You're becoming a productivity legend!",
        icon: "pi pi-crown",
        theme: "week-theme"
    },
    streak_30: {
        title: "Unstoppable Force!",
        message: "30 days of excellence! You've mastered the art of consistency!",
        icon: "pi pi-star",
        theme: "month-theme"
    },
    points_1000: {
        title: "Point Master!",
        message: "1000 points! Your dedication is paying off. You're a true task master!",
        icon: "pi pi-trophy",
        theme: "points-theme"
    },
    points_5000: {
        title: "Legendary Status!",
        message: "5000 points! You've reached legendary status in the productivity realm!",
        icon: "pi pi-shield",
        theme: "legend-theme"
    }
};

export default {
    components: {
        Knob
    },
    data() {
        return {
            tasks: [],
            taskDialog: false,
            task: {
                title: '',
                description: '',
                deadline: null,
                priority: 'Medium',
                completed: false
            },
            submitted: false,
            priorities: [
                { name: 'High' },
                { name: 'Medium' },
                { name: 'Low' }
            ],
            totalPoints: 0,
            completedTasks: 0,
            currentStreak: 0,
            lastCompletionDate: null,
            userProfile: {
                name: 'User',
                avatar: ''
            },
            motivationalMessage: MOTIVATIONAL_MESSAGES.beginner
        }
    },
    computed: {
        completionPercentage() {
            if (this.tasks.length === 0) return 0;
            const completedTasks = this.tasks.filter(task => task.completed).length;
            return Math.round((completedTasks / this.tasks.length) * 100);
        },
        unlockedBadges() {
            return BADGES.filter(badge => this.totalPoints >= badge.threshold);
        },
        userInitials() {
            return this.userProfile.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase();
        },
        userTitle() {
            if (this.currentStreak >= 30) return "Productivity Legend";
            if (this.currentStreak >= 7) return "Week Warrior";
            if (this.currentStreak >= 3) return "Streak Builder";
            return "Task Master";
        },
        messageTheme() {
            return this.motivationalMessage.theme;
        },
        messageIcon() {
            return this.motivationalMessage.icon;
        }
    },
    created() {
        // Load data from TaskService
        this.loadData();
    },
    activated() {
        // Reload user profile and stats when the page is activated (e.g., after navigating back)
        this.loadData();
    },
    methods: {
        loadData() {
            // Load tasks
            this.tasks = TaskService.getTasks();
            
            // Load user stats
            const stats = TaskService.getUserStats();
            this.totalPoints = stats.totalPoints;
            this.currentStreak = stats.currentStreak;
            this.lastCompletionDate = stats.lastCompletionDate ? new Date(stats.lastCompletionDate) : null;
            this.completedTasks = stats.completedTasks;
            
            // Load user profile
            this.userProfile = TaskService.getUserProfile();
            
            // Check streak and update message
            this.checkStreak();
            this.updateMotivationalMessage();
        },
        getPrioritySeverity(priority) {
            switch (priority) {
                case 'High':
                    return 'danger';
                case 'Medium':
                    return 'warning';
                case 'Low':
                    return 'success';
                default:
                    return 'info';
            }
        },
        openNew() {
            this.task = {
                title: '',
                description: '',
                deadline: null,
                priority: 'Medium',
                completed: false
            };
            this.submitted = false;
            this.taskDialog = true;
        },
        hideDialog() {
            this.taskDialog = false;
            this.submitted = false;
        },
        saveTask() {
            this.submitted = true;

            if (this.task.title.trim()) {
                if (this.task.id) {
                    // Update existing task
                    TaskService.updateTask(this.task.id, this.task);
                } else {
                    // Create new task
                    TaskService.addTask(this.task);
                }

                this.taskDialog = false;
                this.loadData(); // Reload data to refresh the view
            }
        },
        checkStreak() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (this.lastCompletionDate) {
                const lastDate = new Date(this.lastCompletionDate);
                lastDate.setHours(0, 0, 0, 0);

                const diffTime = today.getTime() - lastDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 1) {
                    // Streak broken - reset to 0
                    this.currentStreak = 0;
                }
            }
        },
        updateStreak() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (this.lastCompletionDate) {
                const lastDate = new Date(this.lastCompletionDate);
                lastDate.setHours(0, 0, 0, 0);

                const diffTime = today.getTime() - lastDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day - increment streak
                    this.currentStreak++;
                } else if (diffDays === 0) {
                    // Same day - no change to streak
                    return;
                } else {
                    // Streak broken - start new streak
                    this.currentStreak = 1;
                }
            } else {
                // First completion - start streak
                this.currentStreak = 1;
            }

            TaskService.updateStreak(this.currentStreak, today.toISOString());
            this.loadData();

            // Show streak notification
            if (this.currentStreak > 1) {
                this.$toast.add({
                    severity: 'success',
                    summary: 'Streak Updated!',
                    detail: `You're on a ${this.currentStreak} day streak! Keep it up!`,
                    life: 3000
                });
            }
        },
        handleTaskCompletion(task) {
            // Persist the completed state
            TaskService.updateTask(task.id, { completed: task.completed });
            if (task.completed) {
                // Award points when task is completed
                const points = POINTS_PER_PRIORITY[task.priority] || 10;
                TaskService.addPoints(points, task);
                TaskService.incrementCompletedTasks();
                // Update streak
                this.updateStreak();
                // Show toast notification
                this.$toast.add({
                    severity: 'success',
                    summary: 'Points Earned!',
                    detail: `You earned ${points} points for completing "${task.title}"`,
                    life: 3000
                });
                // Check for new badges
                this.checkNewBadges();
            } else {
                // Remove points when task is unchecked
                const points = POINTS_PER_PRIORITY[task.priority] || 10;
                TaskService.deductPoints(points, task);
                TaskService.decrementCompletedTasks();
            }
            // Reload data to refresh the view
            this.loadData();
        },
        checkNewBadges() {
            const previousBadges = this.unlockedBadges;
            const newBadges = BADGES.filter(badge => 
                this.totalPoints >= badge.threshold && 
                !previousBadges.some(pb => pb.id === badge.id)
            );

            newBadges.forEach(badge => {
                this.$toast.add({
                    severity: 'success',
                    summary: 'New Badge Unlocked!',
                    detail: `Congratulations! You've earned the ${badge.name} badge!`,
                    life: 5000
                });
            });
        },
        updateMotivationalMessage() {
            if (this.totalPoints >= 5000) {
                this.motivationalMessage = MOTIVATIONAL_MESSAGES.points_5000;
            } else if (this.totalPoints >= 1000) {
                this.motivationalMessage = MOTIVATIONAL_MESSAGES.points_1000;
            } else if (this.currentStreak >= 30) {
                this.motivationalMessage = MOTIVATIONAL_MESSAGES.streak_30;
            } else if (this.currentStreak >= 7) {
                this.motivationalMessage = MOTIVATIONAL_MESSAGES.streak_7;
            } else if (this.currentStreak >= 3) {
                this.motivationalMessage = MOTIVATIONAL_MESSAGES.streak_3;
            } else {
                this.motivationalMessage = MOTIVATIONAL_MESSAGES.beginner;
            }
        },
        formatDeadline(deadline) {
            if (!deadline) return '';
            // Handle both Date objects and ISO strings
            const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
            if (isNaN(date.getTime())) return '';
            return date.toISOString().slice(0, 10);
        },
        formatPriority(priority) {
            // Handle both string and object
            if (typeof priority === 'object' && priority !== null && priority.name) {
                return priority.name.charAt(0).toUpperCase() + priority.name.slice(1).toLowerCase();
            }
            if (typeof priority === 'string') {
                return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
            }
            return '';
        },
        editTask(task) {
            this.task = { ...task };
            this.taskDialog = true;
            this.submitted = false;
        },
        confirmDeleteTask(task) {
            if (confirm(`Are you sure you want to delete the task: "${task.title}"?`)) {
                this.deleteTask(task.id);
            }
        },
        deleteTask(taskId) {
            TaskService.deleteTask(taskId);
            this.loadData();
        }
    }
}
</script>

<style scoped>
.line-through {
    text-decoration: line-through;
    color: #9ca3af;
}

.field {
    margin-bottom: 1.5rem;
}

.field label {
    display: block;
    margin-bottom: 0.5rem;
}

.task-progress {
    position: relative;
    width: 60px;
    height: 60px;
}

.circular-progress {
    width: 100%;
    height: 100%;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
    font-weight: 600;
}

:deep(.p-progressbar) {
    border-radius: 50%;
    height: 100%;
}

:deep(.p-progressbar .p-progressbar-value) {
    border-radius: 50%;
}

:deep(.p-progressbar .p-progressbar-label) {
    display: none;
}

.points-badge {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-weight: 600;
}

.points-text {
    font-size: 1rem;
}

.achievement-badges {
    display: flex;
    align-items: center;
}

:deep(.p-badge) {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
}

.streak-badge {
    background-color: var(--orange-500);
    color: var(--orange-50);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-weight: 600;
}

.streak-text {
    font-size: 1rem;
}

:deep(.p-toast) {
    z-index: 1000;
}

.user-profile {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    flex-direction: column;
}

:deep(.p-avatar) {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
}

.motivational-message {
    border-radius: 8px;
    transition: all 0.3s ease;
}

.beginner-theme {
    background-color: var(--blue-50);
    border-left: 4px solid var(--blue-500);
}

.streak-theme {
    background-color: var(--orange-50);
    border-left: 4px solid var(--orange-500);
}

.week-theme {
    background-color: var(--green-50);
    border-left: 4px solid var(--green-500);
}

.month-theme {
    background-color: var(--purple-50);
    border-left: 4px solid var(--purple-500);
}

.points-theme {
    background-color: var(--yellow-50);
    border-left: 4px solid var(--yellow-500);
}

.legend-theme {
    background: linear-gradient(45deg, var(--purple-50), var(--blue-50));
    border-left: 4px solid var(--purple-500);
}

:deep(.p-card) {
    transition: all 0.3s ease;
}

:deep(.p-card.beginner-theme) {
    background: linear-gradient(to bottom right, var(--surface-card), var(--blue-50));
}

:deep(.p-card.streak-theme) {
    background: linear-gradient(to bottom right, var(--surface-card), var(--orange-50));
}

:deep(.p-card.week-theme) {
    background: linear-gradient(to bottom right, var(--surface-card), var(--green-50));
}

:deep(.p-card.month-theme) {
    background: linear-gradient(to bottom right, var(--surface-card), var(--purple-50));
}

:deep(.p-card.points-theme) {
    background: linear-gradient(to bottom right, var(--surface-card), var(--yellow-50));
}

:deep(.p-card.legend-theme) {
    background: linear-gradient(45deg, var(--surface-card), var(--purple-50), var(--blue-50));
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
</style> 