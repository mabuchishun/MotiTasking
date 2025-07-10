<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>User Profile</h5>
                <div class="flex flex-column md:flex-row gap-5">
                    <div class="flex flex-column align-items-center">
                        <div class="avatar-section mb-4">
                            <Avatar :image="selectedAvatar || undefined" :label="!selectedAvatar ? userInitials : undefined" 
                                shape="circle" class="mb-3 profile-avatar" />
                            <div class="text-xl font-bold mb-2">{{ userName }}</div>
                            <div class="text-500">Task Master</div>
                        </div>
                    </div>
                    
                    <div class="flex-1">
                        <div class="field">
                            <label for="name" class="font-bold mb-2 block">Display Name</label>
                            <InputText id="name" v-model="userName" class="w-full" :class="{'p-invalid': nameError}" />
                            <small v-if="nameError" class="p-error">{{ nameError }}</small>
                        </div>

                        <div class="field mt-4">
                            <label class="font-bold mb-2 block">Choose Avatar</label>
                            <div class="avatar-grid">
                                <div v-for="avatar in availableAvatars" 
                                     :key="avatar" 
                                     class="avatar-option"
                                     :class="{ 'selected': selectedAvatar === avatar }"
                                     @click="selectAvatar(avatar)">
                                    <img :src="avatar" :alt="'Avatar ' + avatar" />
                                </div>
                            </div>
                        </div>

                        <div class="save-btn-row">
                            <Button label="Save Changes" icon="pi pi-check" @click="saveProfile" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TaskService from '@/services/TaskService';

const AVATAR_OPTIONS = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/women/5.jpg',
    'https://randomuser.me/api/portraits/men/6.jpg',
    'https://randomuser.me/api/portraits/women/6.jpg'
];

export default {
    data() {
        return {
            userName: 'User',
            selectedAvatar: '',
            availableAvatars: AVATAR_OPTIONS,
            nameError: ''
        }
    },
    computed: {
        userInitials() {
            return this.userName
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase();
        }
    },
    created() {
        // Load profile from TaskService
        const profile = TaskService.getUserProfile();
        if (profile) {
            this.userName = profile.name;
            this.selectedAvatar = profile.avatar;
        } else {
            // Set default avatar if none selected
            this.selectedAvatar = this.availableAvatars[0];
        }
    },
    methods: {
        selectAvatar(avatar) {
            this.selectedAvatar = avatar;
        },
        saveProfile() {
            this.nameError = '';
            if (!this.userName || !this.userName.trim()) {
                this.nameError = 'Display name cannot be blank.';
                return;
            }
            const profile = {
                name: this.userName,
                avatar: this.selectedAvatar
            };
            TaskService.updateUserProfile(profile);
            this.$toast.add({
                severity: 'success',
                summary: 'Profile Updated',
                detail: 'Your profile has been saved successfully',
                life: 3000
            });
        }
    }
}
</script>

<style scoped>
.card {
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
}

.avatar-section {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
}

.profile-avatar {
    width: 128px !important;
    height: 128px !important;
    font-size: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
}

:deep(.p-avatar img) {
    width: 128px !important;
    height: 128px !important;
    object-fit: cover;
    border-radius: 50%;
}

.avatar-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    justify-content: center;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
}

.avatar-option {
    cursor: pointer;
    border-radius: 50%;
    transition: box-shadow 0.2s, border 0.2s;
    border: 2px solid transparent;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    padding: 2px;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-option.selected {
    border: 2.5px solid var(--primary-color);
    box-shadow: 0 0 0 4px rgba(16,185,129,0.12);
    background: none;
}

.avatar-option img {
    width: 64px !important;
    height: 64px !important;
    max-width: 64px !important;
    max-height: 64px !important;
    object-fit: cover;
    border-radius: 50%;
    display: block;
}

.save-btn-row {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.field label {
    font-size: 1rem;
    color: var(--text-color-secondary);
}

@media (max-width: 600px) {
    .card {
        padding: 1rem 0.5rem;
    }
    .avatar-grid {
        gap: 0.7rem;
        max-width: 95vw;
    }
}
</style> 