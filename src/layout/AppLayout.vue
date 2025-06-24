<script setup>
import AppFooter from './AppFooter.vue';
import AppTopbar from './AppTopbar.vue';
</script>

<template>
    <div class="layout-wrapper">
        <app-topbar></app-topbar>
        <div class="layout-main-container" style="width: 100%;">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
    </div>
    <Toast />
</template>
