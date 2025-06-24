<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable :value="rankedUsers" :paginator="true" :rows="10" 
                    :rowsPerPageOptions="[5, 10, 25]" responsiveLayout="scroll"
                    class="p-datatable-sm">
                    <Column field="rank" header="Rank" style="width: 5rem">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <i v-if="slotProps.data.rank === 1" class="pi pi-trophy text-yellow-500 mr-2"></i>
                                <i v-else-if="slotProps.data.rank === 2" class="pi pi-trophy text-gray-400 mr-2"></i>
                                <i v-else-if="slotProps.data.rank === 3" class="pi pi-trophy text-orange-500 mr-2"></i>
                                <span>{{ slotProps.data.rank }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="avatar" header="User" style="min-width: 200px">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <Avatar :image="slotProps.data.avatar" :label="getInitials(slotProps.data.name)" 
                                    class="mr-2" size="large" shape="circle" />
                                <div>
                                    <div class="font-bold">{{ slotProps.data.name }}</div>
                                    <div class="text-sm text-500">{{ slotProps.data.title }}</div>
                                </div>
                            </div>
                        </template>
                    </Column>
                    <Column field="points" header="Points" style="min-width: 120px">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <i class="pi pi-star-fill text-yellow-500 mr-2"></i>
                                <span class="font-bold">{{ slotProps.data.points.toLocaleString() }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="streak" header="Current Streak" style="min-width: 120px">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <i class="pi pi-fire text-orange-500 mr-2"></i>
                                <span>{{ slotProps.data.streak }} days</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="tasksCompleted" header="Tasks Completed" style="min-width: 120px">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                <span>{{ slotProps.data.tasksCompleted }}</span>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
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

export default {
    data() {
        return {
            users: MOCK_USERS
        }
    },
    computed: {
        rankedUsers() {
            return this.users
                .sort((a, b) => b.points - a.points)
                .map((user, index) => ({
                    ...user,
                    rank: index + 1
                }));
        }
    },
    methods: {
        getInitials(name) {
            return name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase();
        }
    }
}
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: var(--surface-card);
    color: var(--text-color);
    font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 1rem;
}

:deep(.p-avatar) {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
}

.text-yellow-500 {
    color: #FFD700;
}

.text-gray-400 {
    color: #9CA3AF;
}

.text-orange-500 {
    color: #F97316;
}

.text-green-500 {
    color: #22C55E;
}
</style> 