import LogService from './LogService';

// Initial mock data structure
const INITIAL_DATA = {
    tasks: [
        {
            id: 1,
            title: 'Complete project proposal',
            description: 'Write and submit the project proposal document',
            deadline: '2024-03-20',
            priority: 'high',
            completed: false,
            createdAt: '2024-03-15T10:00:00Z'
        },
        {
            id: 2,
            title: 'Review team submissions',
            description: 'Review and provide feedback on team member submissions',
            deadline: '2024-03-18',
            priority: 'medium',
            completed: true,
            createdAt: '2024-03-15T10:00:00Z'
        },
        {
            id: 3,
            title: 'Schedule team meeting',
            description: 'Set up weekly team sync meeting',
            deadline: '2024-03-17',
            priority: 'low',
            completed: false,
            createdAt: '2024-03-15T10:00:00Z'
        }
    ],
    userStats: {
        totalPoints: 0,
        currentStreak: 0,
        lastCompletionDate: null,
        completedTasks: 0,
        achievements: []
    },
    userProfile: {
        name: 'User',
        avatar: null
    }
};

class TaskService {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem('taskData')) {
            localStorage.setItem('taskData', JSON.stringify(INITIAL_DATA));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem('taskData'));
    }

    saveData(data) {
        localStorage.setItem('taskData', JSON.stringify(data));
    }

    // Task Methods
    getTasks() {
        return this.getData().tasks;
    }

    addTask(task) {
        const data = this.getData();
        const newTask = {
            ...task,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        data.tasks.push(newTask);
        this.saveData(data);
        LogService.logTaskCreated(newTask);
        return newTask;
    }

    updateTask(taskId, updates) {
        const data = this.getData();
        const taskIndex = data.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
            this.saveData(data);
            LogService.logTaskCompleted(data.tasks[taskIndex]);
            return data.tasks[taskIndex];
        }
        return null;
    }

    deleteTask(taskId) {
        const data = this.getData();
        data.tasks = data.tasks.filter(t => t.id !== taskId);
        this.saveData(data);
    }

    // User Stats Methods
    getUserStats() {
        return this.getData().userStats;
    }

    updateUserStats(updates) {
        const data = this.getData();
        data.userStats = { ...data.userStats, ...updates };
        this.saveData(data);
    }

    addPoints(points, task) {
        const data = this.getData();
        data.userStats.totalPoints += points;
        this.saveData(data);
        LogService.logPointsEarned(points, task);
    }

    deductPoints(points, task) {
        const data = this.getData();
        data.userStats.totalPoints -= points;
        this.saveData(data);
        LogService.logPointsDeducted(points, task);
    }

    updateStreak(streak) {
        const data = this.getData();
        const previousStreak = data.userStats.currentStreak;
        data.userStats.currentStreak = streak;
        this.saveData(data);
        LogService.logStreakUpdate(streak, previousStreak);
    }

    updateLastCompletionDate(date) {
        const data = this.getData();
        data.userStats.lastCompletionDate = date;
        this.saveData(data);
    }

    incrementCompletedTasks() {
        const data = this.getData();
        data.userStats.completedTasks += 1;
        this.saveData(data);
    }

    decrementCompletedTasks() {
        const data = this.getData();
        data.userStats.completedTasks = Math.max(0, data.userStats.completedTasks - 1);
        this.saveData(data);
    }

    // Achievement Methods
    getAchievements() {
        return this.getData().userStats.achievements;
    }

    addAchievement(achievement) {
        const data = this.getData();
        if (!data.userStats.achievements.some(a => a.id === achievement.id)) {
            data.userStats.achievements.push(achievement);
            this.saveData(data);
            LogService.logAchievement(achievement);
        }
    }

    // Profile Methods
    getUserProfile() {
        return this.getData().userProfile;
    }

    updateUserProfile(profile) {
        const data = this.getData();
        const previousProfile = { ...data.userProfile };
        data.userProfile = { ...data.userProfile, ...profile };
        this.saveData(data);
        LogService.logProfileUpdate(previousProfile, data.userProfile);
    }

    // Reset Methods
    resetAllData() {
        localStorage.setItem('taskData', JSON.stringify(INITIAL_DATA));
        LogService.clearLogs();
    }

    resetTasks() {
        const data = this.getData();
        data.tasks = INITIAL_DATA.tasks;
        this.saveData(data);
    }

    resetUserStats() {
        const data = this.getData();
        data.userStats = INITIAL_DATA.userStats;
        this.saveData(data);
    }
}

export default new TaskService(); 