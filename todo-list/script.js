// Task Manager Application
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.settings = JSON.parse(localStorage.getItem('settings')) || {
            darkMode: false,
            notifications: true,
            sound: true
        };
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.render();
        this.updateStats();
    }

    setupEventListeners() {
        // Input events
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Sort events
        document.getElementById('sortByDate').addEventListener('click', () => {
            this.currentSort = 'date';
            this.render();
            this.showNotification('Sorted by date', 'success');
        });

        document.getElementById('sortByPriority').addEventListener('click', () => {
            this.currentSort = 'priority';
            this.render();
            this.showNotification('Sorted by priority', 'success');
        });

        // Clear completed
        document.getElementById('clearCompleted').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all completed tasks?')) {
                this.tasks = this.tasks.filter(t => !t.completed);
                this.saveTasks();
                this.render();
                this.updateStats();
                this.showNotification('Completed tasks cleared', 'success');
            }
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelEdit').addEventListener('click', () => this.closeModal());
        document.getElementById('editForm').addEventListener('submit', (e) => this.saveEdit(e));

        // Settings events
        document.getElementById('darkModeToggle').addEventListener('change', () => this.toggleDarkMode());
        document.getElementById('notificationsToggle').addEventListener('change', () => this.toggleNotifications());
        document.getElementById('soundToggle').addEventListener('change', () => this.toggleSound());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importTasks(e));
        document.getElementById('resetBtn').addEventListener('click', () => this.resetAll());

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) this.closeModal();
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('prioritySelect').value;
        const text = input.value.trim();

        if (!text) {
            this.showNotification('Please enter a task', 'warning');
            return;
        }

        const task = {
            id: Date.now(),
            text,
            priority,
            completed: false,
            dueDate: null,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.render();
        this.updateStats();
        input.value = '';
        this.showNotification(`Task added: "${text}"`, 'success');
        this.playSound();
    }

    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            this.updateStats();
            this.showNotification(
                task.completed ? 'Task completed! 🎉' : 'Task marked as active',
                'success'
            );
            this.playSound();
        }
    }

    deleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (confirm(`Delete task: "${task.text}"?`)) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.render();
            this.updateStats();
            this.showNotification('Task deleted', 'success');
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        document.getElementById('editTaskId').value = id;
        document.getElementById('editTaskInput').value = task.text;
        document.getElementById('editPrioritySelect').value = task.priority;
        document.getElementById('editDueDate').value = task.dueDate || '';
        document.getElementById('editModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('show');
    }

    saveEdit(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editTaskId').value);
        const task = this.tasks.find(t => t.id === id);

        if (task) {
            task.text = document.getElementById('editTaskInput').value;
            task.priority = document.getElementById('editPrioritySelect').value;
            task.dueDate = document.getElementById('editDueDate').value || null;
            this.saveTasks();
            this.render();
            this.updateStats();
            this.closeModal();
            this.showNotification('Task updated', 'success');
        }
    }

    getFilteredTasks() {
        let filtered = this.tasks;

        if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (this.currentFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'high') {
            filtered = filtered.filter(t => t.priority === 'high');
        }

        return filtered;
    }

    getSortedTasks(tasks) {
        const sorted = [...tasks];

        if (this.currentSort === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else {
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return sorted;
    }

    render() {
        const filtered = this.getFilteredTasks();
        const sorted = this.getSortedTasks(filtered);
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');

        tasksList.innerHTML = '';

        if (sorted.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        sorted.forEach(task => {
            tasksList.appendChild(this.createTaskElement(task));
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-card ${task.priority} ${task.completed ? 'completed' : ''}`;

        const priorityLabel = {
            high: '🔴 High',
            medium: '🟡 Medium',
            low: '🟢 Low'
        };

        const date = new Date(task.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        div.innerHTML = `
            <div class="task-header">
                <span class="priority-badge ${task.priority}">${priorityLabel[task.priority]}</span>
            </div>
            <div class="task-text">${this.escapeHtml(task.text)}</div>
            <div class="task-meta">
                <div class="task-date">📅 ${date}</div>
                ${task.dueDate ? `<div>Due: ${new Date(task.dueDate).toLocaleDateString()}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="task-btn task-btn-complete ${task.completed ? 'active' : ''}" 
                    onclick="taskManager.completeTask(${task.id})">
                    ${task.completed ? '✓ Completed' : 'Complete'}
                </button>
                <button class="task-btn task-btn-edit" onclick="taskManager.openEditModal(${task.id})">Edit</button>
                <button class="task-btn task-btn-delete" onclick="taskManager.deleteTask(${task.id})">Delete</button>
            </div>
        `;

        return div;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const active = total - completed;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('activeTasks').textContent = active;
        document.getElementById('completionRate').textContent = `${rate}%`;
    }

    toggleDarkMode() {
        const isEnabled = document.getElementById('darkModeToggle').checked;
        this.settings.darkMode = isEnabled;
        this.saveSetting();
        document.body.classList.toggle('dark-mode', isEnabled);
        this.showNotification(isEnabled ? 'Dark mode enabled' : 'Dark mode disabled', 'success');
    }

    toggleNotifications() {
        this.settings.notifications = document.getElementById('notificationsToggle').checked;
        this.saveSetting();
    }

    toggleSound() {
        this.settings.sound = document.getElementById('soundToggle').checked;
        this.saveSetting();
    }

    loadSettings() {
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').checked = true;
        }
        document.getElementById('notificationsToggle').checked = this.settings.notifications;
        document.getElementById('soundToggle').checked = this.settings.sound;
    }

    saveSetting() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    exportTasks() {
        const data = {
            tasks: this.tasks,
            exportedAt: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Tasks exported successfully', 'success');
    }

    importTasks(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.tasks && Array.isArray(data.tasks)) {
                    this.tasks = data.tasks;
                    this.saveTasks();
                    this.render();
                    this.updateStats();
                    this.showNotification('Tasks imported successfully', 'success');
                } else {
                    this.showNotification('Invalid file format', 'error');
                }
            } catch (error) {
                this.showNotification('Error importing tasks', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    resetAll() {
        if (confirm('Are you sure? This will delete all tasks and reset settings. This cannot be undone!')) {
            if (confirm('Really delete everything?')) {
                this.tasks = [];
                this.settings = {
                    darkMode: false,
                    notifications: true,
                    sound: true
                };
                localStorage.clear();
                this.loadSettings();
                this.render();
                this.updateStats();
                this.showNotification('All data has been reset', 'warning');
            }
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    showNotification(message, type = 'success') {
        if (!this.settings.notifications) return;

        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    playSound() {
        if (!this.settings.sound) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the application
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});