# TaskMaster - To-Do List Application

A fully functional, feature-rich to-do list application with local storage persistence, dark mode, and comprehensive task management capabilities.

## Features

### ✨ Core Features
- **Add Tasks**: Create tasks with priorities (Low, Medium, High)
- **Task Management**: Complete, edit, and delete tasks
- **Local Storage**: All tasks and settings persist automatically
- **Persistent Cart**: Tasks are saved even after closing the browser
- **Task Filtering**: Filter by All, Active, Completed, or High Priority
- **Sorting Options**: Sort tasks by date or priority
- **Task Editing**: Edit task description, priority, and due date

### 🎨 User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Sound Effects**: Optional notification sounds
- **Visual Feedback**: Smooth animations and transitions
- **Empty State**: Helpful message when no tasks exist
- **Notifications**: Real-time feedback for all actions

### 📊 Statistics
- Total tasks count
- Completed tasks count
- Active tasks count
- Completion rate percentage

### 💾 Data Management
- **Export Tasks**: Download tasks as JSON file
- **Import Tasks**: Upload previously exported JSON files
- **Reset All**: Complete reset of all data (with confirmation)
- **Clear Completed**: Remove all completed tasks at once

### ⚙️ Settings
- Dark Mode toggle
- Enable/disable notifications
- Sound effects control
- Export and import functionality
- Data reset option

## Project Structure

```
todo-list/
├── index.html      # Main HTML file with structure
├── styles.css      # Complete styling and responsive design
├── script.js       # JavaScript functionality (TaskManager class)
└── README.md       # Project documentation
```

## Getting Started

1. **Open `index.html`** in your web browser
2. **No installation required** - runs entirely in the browser
3. All tasks are automatically saved to browser storage

## How to Use

### Adding Tasks
1. Enter task description in the input field
2. Select priority level (Low, Medium, High)
3. Click "Add Task" or press Enter
4. Task appears in the list with your chosen priority

### Managing Tasks
- **Complete**: Click "Complete" button to mark task as done
- **Edit**: Click "Edit" button to modify task details
- **Delete**: Click "Delete" button to remove task
- **Clear Completed**: Use button in filter section to remove all completed tasks

### Filtering Tasks
- **All**: Show all tasks
- **Active**: Show only incomplete tasks
- **Completed**: Show only completed tasks
- **High Priority**: Show only high-priority tasks

### Sorting Options
- **Sort by Date**: Most recent first
- **Sort by Priority**: High → Medium → Low

### Editing Tasks
1. Click the "Edit" button on any task
2. Modify the task description, priority, or due date
3. Click "Save Changes"
4. Task updates immediately

## Dark Mode

Toggle dark mode in Settings section:
- Applies to entire application
- Preference is saved automatically
- Eye-friendly night theme

## Data Export/Import

### Export Tasks
1. Go to Settings section
2. Click "Export Tasks"
3. JSON file downloads automatically
4. File contains all tasks and export timestamp

### Import Tasks
1. Go to Settings section
2. Click "Import Tasks"
3. Select previously exported JSON file
4. All tasks from file are restored

## Keyboard Shortcuts
- **Enter**: Add new task when focused on input field

## Statistics Tracking

TaskMaster automatically tracks:
- **Total Tasks**: All tasks created
- **Completed**: Successfully finished tasks
- **Active**: Tasks still to be done
- **Completion Rate**: Percentage of completed tasks

Statistics update in real-time as you manage tasks.

## Local Storage

The application stores:
- All tasks with details (text, priority, dates, completion status)
- Application settings (theme, notifications, sound)
- Data persists across browser sessions
- No server required

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Settings

Accessible from the Settings section:

### Display
- **Dark Mode**: Toggle dark/light theme

### Notifications
- **Enable Notifications**: Show/hide action notifications
- **Sound Effects**: Play sound on task actions

### Data
- **Export Tasks**: Save all tasks to JSON file
- **Import Tasks**: Load tasks from JSON file
- **Reset All**: Clear all data (requires double confirmation)

## Customization

### Change Color Scheme
Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... more colors */
}
```

### Add Priority Levels
Modify the priority select options in `index.html` and update the `priorityLabel` in `script.js`

## Tips & Tricks

1. **Bulk Export**: Export tasks regularly as backup
2. **Priority Focus**: Use "High Priority" filter to focus on urgent tasks
3. **Due Dates**: Set due dates when editing tasks for better organization
4. **Dark Mode**: Activate for comfortable late-night task management
5. **Sound Feedback**: Keep sounds on for satisfying task completion audio

## Future Enhancements

- Categories/Tags for tasks
- Recurring tasks
- Task reminders
- Cloud sync
- Collaboration features
- Task priority drag-and-drop reordering
- Time estimates for tasks
- Calendar view

## License

This project is free to use for personal and educational purposes.

## Support

For issues or suggestions, please check:
- Browser console for error messages
- Local storage is not full (clear browser cache if needed)
- JavaScript is enabled in browser settings

---

Stay productive with **TaskMaster**! ✓
