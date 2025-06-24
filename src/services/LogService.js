const LOG_TYPES = {
    ACHIEVEMENT: 'achievement',
    STREAK: 'streak',
    POINTS: 'points',
    TASK: 'task',
    PROFILE: 'profile'
};

class LogService {
    constructor() {
        this.initializeLogs();
    }

    initializeLogs() {
        if (!localStorage.getItem('userLogs')) {
            localStorage.setItem('userLogs', JSON.stringify([]));
        }
    }

    getLogs() {
        return JSON.parse(localStorage.getItem('userLogs'));
    }

    addLog(type, data) {
        const logs = this.getLogs();
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type,
            data
        };
        logs.push(logEntry);
        localStorage.setItem('userLogs', JSON.stringify(logs));
        return logEntry;
    }

    // Achievement Logs
    logAchievement(achievement) {
        return this.addLog(LOG_TYPES.ACHIEVEMENT, {
            achievementId: achievement.id,
            achievementName: achievement.name,
            points: achievement.threshold,
            message: `Earned ${achievement.name} badge`
        });
    }

    // Streak Logs
    logStreakUpdate(streak, previousStreak) {
        return this.addLog(LOG_TYPES.STREAK, {
            currentStreak: streak,
            previousStreak,
            message: streak > previousStreak 
                ? `Extended streak to ${streak} days`
                : `Streak reset to ${streak} days`
        });
    }

    // Points Logs
    logPointsEarned(points, task) {
        return this.addLog(LOG_TYPES.POINTS, {
            points,
            taskId: task.id,
            taskTitle: task.title,
            priority: task.priority,
            message: `Earned ${points} points for completing "${task.title}"`
        });
    }

    logPointsDeducted(points, task) {
        return this.addLog(LOG_TYPES.POINTS, {
            points: -points,
            taskId: task.id,
            taskTitle: task.title,
            priority: task.priority,
            message: `Deducted ${points} points for unchecking "${task.title}"`
        });
    }

    // Task Logs
    logTaskCreated(task) {
        return this.addLog(LOG_TYPES.TASK, {
            taskId: task.id,
            taskTitle: task.title,
            priority: task.priority,
            message: `Created new task: "${task.title}"`
        });
    }

    logTaskCompleted(task) {
        return this.addLog(LOG_TYPES.TASK, {
            taskId: task.id,
            taskTitle: task.title,
            priority: task.priority,
            message: `Completed task: "${task.title}"`
        });
    }

    logTaskUncompleted(task) {
        return this.addLog(LOG_TYPES.TASK, {
            taskId: task.id,
            taskTitle: task.title,
            priority: task.priority,
            message: `Uncompleted task: "${task.title}"`
        });
    }

    // Profile Logs
    logProfileUpdate(previousProfile, newProfile) {
        return this.addLog(LOG_TYPES.PROFILE, {
            previousName: previousProfile.name,
            newName: newProfile.name,
            previousAvatar: previousProfile.avatar,
            newAvatar: newProfile.avatar,
            message: `Updated profile from "${previousProfile.name}" to "${newProfile.name}"`
        });
    }

    // Analytics Methods
    getAchievementHistory() {
        const logs = this.getLogs();
        return logs.filter(log => log.type === LOG_TYPES.ACHIEVEMENT);
    }

    getStreakHistory() {
        const logs = this.getLogs();
        return logs.filter(log => log.type === LOG_TYPES.STREAK);
    }

    getPointsHistory() {
        const logs = this.getLogs();
        return logs.filter(log => log.type === LOG_TYPES.POINTS);
    }

    getTaskHistory() {
        const logs = this.getLogs();
        return logs.filter(log => log.type === LOG_TYPES.TASK);
    }

    getProfileHistory() {
        const logs = this.getLogs();
        return logs.filter(log => log.type === LOG_TYPES.PROFILE);
    }

    // Statistics Methods
    getTotalPointsEarned() {
        const pointsLogs = this.getPointsHistory();
        return pointsLogs.reduce((total, log) => total + (log.data.points > 0 ? log.data.points : 0), 0);
    }

    getTotalPointsDeducted() {
        const pointsLogs = this.getPointsHistory();
        return pointsLogs.reduce((total, log) => total + (log.data.points < 0 ? Math.abs(log.data.points) : 0), 0);
    }

    getLongestStreak() {
        const streakLogs = this.getStreakHistory();
        return Math.max(...streakLogs.map(log => log.data.currentStreak), 0);
    }

    getAchievementCount() {
        const achievementLogs = this.getAchievementHistory();
        return achievementLogs.length;
    }

    // Clear Methods
    clearLogs() {
        localStorage.setItem('userLogs', JSON.stringify([]));
    }

    clearLogsByType(type) {
        const logs = this.getLogs();
        const filteredLogs = logs.filter(log => log.type !== type);
        localStorage.setItem('userLogs', JSON.stringify(filteredLogs));
    }
}

export default new LogService(); 