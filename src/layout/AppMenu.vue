<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'MotiTasking',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Tasks', icon: 'pi pi-fw pi-list', to: '/tasks' },
            { label: 'Leaderboard', icon: 'pi pi-fw pi-trophy', to: '/leaderboard' },
            { label: 'Achievements', icon: 'pi pi-fw pi-star', to: '/achievements' },
            { label: 'Profile', icon: 'pi pi-fw pi-user', to: '/profile' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
