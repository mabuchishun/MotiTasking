<template>
    <div class="activity-log">
        <div class="card">
            <h2>Activity Log</h2>
            
            <div class="activity-filters">
                <Dropdown v-model="selectedType" :options="logTypes" optionLabel="name" optionValue="value" 
                    placeholder="Filter by type" class="w-full md:w-14rem" />
                <Calendar v-model="dateRange" selectionMode="range" :showIcon="true" 
                    placeholder="Filter by date" class="w-full md:w-14rem" />
            </div>

            <DataTable :value="filteredLogs" :paginator="true" :rows="10" 
                :rowsPerPageOptions="[5, 10, 20, 50]" responsiveLayout="scroll"
                class="p-datatable-sm">
                <Column field="timestamp" header="Date" sortable>
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.timestamp) }}
                    </template>
                </Column>
                <Column field="type" header="Type" sortable>
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.type" :severity="getTypeSeverity(slotProps.data.type)" />
                    </template>
                </Column>
                <Column field="data.message" header="Activity" sortable>
                    <template #body="slotProps">
                        <div class="activity-message">
                            <i :class="getTypeIcon(slotProps.data.type)" class="mr-2"></i>
                            {{ slotProps.data.data.message }}
                        </div>
                    </template>
                </Column>
                <Column field="data.points" header="Points" sortable v-if="showPoints">
                    <template #body="slotProps">
                        <span :class="{'text-green-500': slotProps.data.data.points > 0, 'text-red-500': slotProps.data.data.points < 0}">
                            {{ slotProps.data.data.points > 0 ? '+' : '' }}{{ slotProps.data.data.points }}
                        </span>
                    </template>
                </Column>
            </DataTable>

            <div class="activity-stats">
                <div class="stat-card">
                    <i class="pi pi-trophy text-yellow-500"></i>
                    <div class="stat-content">
                        <h3>Total Points Earned</h3>
                        <p>{{ totalPointsEarned }}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="pi pi-calendar text-blue-500"></i>
                    <div class="stat-content">
                        <h3>Longest Streak</h3>
                        <p>{{ longestStreak }} days</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="pi pi-star text-purple-500"></i>
                    <div class="stat-content">
                        <h3>Achievements Earned</h3>
                        <p>{{ achievementCount }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LogService from '@/services/LogService';

export default {
    name: 'ActivityLog',
    data() {
        return {
            logs: [],
            selectedType: null,
            dateRange: null,
            logTypes: [
                { name: 'All Activities', value: null },
                { name: 'Achievements', value: 'achievement' },
                { name: 'Streaks', value: 'streak' },
                { name: 'Points', value: 'points' },
                { name: 'Tasks', value: 'task' },
                { name: 'Profile', value: 'profile' }
            ]
        };
    },
    computed: {
        filteredLogs() {
            let filtered = [...this.logs];
            
            if (this.selectedType) {
                filtered = filtered.filter(log => log.type === this.selectedType);
            }
            
            if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
                const startDate = new Date(this.dateRange[0]);
                const endDate = new Date(this.dateRange[1]);
                filtered = filtered.filter(log => {
                    const logDate = new Date(log.timestamp);
                    return logDate >= startDate && logDate <= endDate;
                });
            }
            
            return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
        showPoints() {
            return this.selectedType === 'points' || !this.selectedType;
        },
        totalPointsEarned() {
            return LogService.getTotalPointsEarned();
        },
        longestStreak() {
            return LogService.getLongestStreak();
        },
        achievementCount() {
            return LogService.getAchievementCount();
        }
    },
    methods: {
        loadLogs() {
            this.logs = LogService.getLogs();
        },
        formatDate(timestamp) {
            return new Date(timestamp).toLocaleString();
        },
        getTypeSeverity(type) {
            const severities = {
                achievement: 'success',
                streak: 'info',
                points: 'warning',
                task: 'primary',
                profile: 'secondary'
            };
            return severities[type] || 'info';
        },
        getTypeIcon(type) {
            const icons = {
                achievement: 'pi pi-trophy',
                streak: 'pi pi-calendar',
                points: 'pi pi-star',
                task: 'pi pi-check-circle',
                profile: 'pi pi-user'
            };
            return icons[type] || 'pi pi-info-circle';
        }
    },
    created() {
        this.loadLogs();
    }
};
</script>

<style scoped>
.activity-log {
    padding: 1rem;
}

.activity-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.activity-message {
    display: flex;
    align-items: center;
}

.activity-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
}

.stat-card {
    background: var(--surface-card);
    padding: 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card i {
    font-size: 2rem;
}

.stat-content h3 {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.stat-content p {
    margin: 0.5rem 0 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-color);
}

@media screen and (max-width: 768px) {
    .activity-filters {
        flex-direction: column;
    }
    
    .activity-stats {
        grid-template-columns: 1fr;
    }
}
</style> 