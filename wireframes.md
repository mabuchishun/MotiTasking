# MotiTasking - Task Dashboard Wireframes

## Overview
This document contains wireframes for the MotiTasking Task Dashboard based on the existing Vue.js prototype. The wireframes show the layout, components, and user flow for the task management system.

---

## 1. Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MOTI-TASKING DASHBOARD                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                              CARD HEADER                                │ │
│  │                                                                         │ │
│  │  ┌─────────┐  ┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐ │ │
│  │  │   👤    │  │   John Doe      │  │ Total Task  │  │      42         │ │ │
│  │  │ Avatar  │  │ Productivity    │  │ Completed   │  │   (Large #)     │ │ │
│  │  │         │  │   Legend        │  │             │  │                 │ │ │
│  │  └─────────┘  └─────────────────┘  └─────────────┘  └─────────────────┘ │ │
│  │                                                                         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────┐ │ │
│  │  │ 🔥 7 Day Streak │  │ ⭐ 1250 Points  │  │ [Novice] [Expert]│  │ [+] │ │ │
│  │  │                 │  │                 │  │   Badges        │  │New  │ │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │Task │ │ │
│  │                                                                 │     │ │ │
│  └─────────────────────────────────────────────────────────────────┘     │ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        MOTIVATIONAL MESSAGE                             │ │
│  │                                                                         │ │
│  │  🏆 Week Warrior!                                                       │ │
│  │  A full week of consistency! You're becoming a productivity legend!     │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                              TASK TABLE                                 │ │
│  │                                                                         │ │
│  │  ┌─────┬──────────────┬──────────┬──────────┬──────────────┬─────────┐   │ │
│  │  │ ✓   │ Task Title   │ Deadline │ Priority │ Description  │ Actions │   │ │
│  │  ├─────┼──────────────┼──────────┼──────────┼──────────────┼─────────┤   │ │
│  │  │ ☐   │ Complete     │ 15/12/24 │ [High]   │ Finish the   │ [✏️] [🗑️]│   │ │
│  │  │     │ project      │          │          │ project      │         │   │ │
│  │  ├─────┼──────────────┼──────────┼──────────┼──────────────┼─────────┤   │ │
│  │  │ ✓   │ ~~Review~~   │ 10/12/24 │ [Medium] │ Code review  │ [✏️] [🗑️]│   │ │
│  │  │     │ ~~code~~     │          │          │              │         │   │ │
│  │  ├─────┼──────────────┼──────────┼──────────┼──────────────┼─────────┤   │ │
│  │  │ ☐   │ Plan meeting │ 20/12/24 │ [Low]    │ Team meeting │ [✏️] [🗑️]│   │ │
│  │  │     │              │          │          │              │         │   │ │
│  │  └─────┴──────────────┴──────────┴──────────┴──────────────┴─────────┘   │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    PAGINATION CONTROLS                              │ │ │
│  │  │  [Previous] [1] [2] [3] [Next]  Rows per page: [10 ▼]              │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. New Task Dialog

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TASK DETAILS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  Title *                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Enter task title...                                                 │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  Description                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                                                                     │ │ │
│  │  │ Enter task description...                                           │ │ │
│  │  │                                                                     │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  Deadline                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ 📅 15/12/2024                                    ▼                 │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  Priority                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ [Medium]                                        ▼                   │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    [Cancel]                    [Save]                   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Mobile Responsive Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MOBILE VIEW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                              CARD HEADER                                │ │
│  │                                                                         │ │
│  │  ┌─────────┐  ┌─────────────────┐                                      │ │
│  │  │   👤    │  │   John Doe      │                                      │ │
│  │  │ Avatar  │  │ Productivity    │                                      │ │
│  │  │         │  │   Legend        │                                      │ │
│  │  └─────────┘  └─────────────────┘                                      │ │
│  │                                                                         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐                              │ │
│  │  │ Total Task      │  │      42         │                              │ │
│  │  │ Completed       │  │   (Large #)     │                              │ │
│  │  └─────────────────┘  └─────────────────┘                              │ │
│  │                                                                         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │ │
│  │  │ 🔥 7 Day        │  │ ⭐ 1250         │  │ [Novice]        │        │ │
│  │  │    Streak       │  │   Points        │  │ [Expert]        │        │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                              [+] New Task                           │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        MOTIVATIONAL MESSAGE                             │ │
│  │                                                                         │ │
│  │  🏆 Week Warrior!                                                       │ │
│  │  A full week of consistency! You're becoming a productivity legend!     │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                              TASK LIST                                  │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ ☐ Complete project                    [High] 15/12/24              │ │ │
│  │  │    Finish the project                                                │ │ │
│  │  │    [✏️] [🗑️]                                                        │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ ✓ ~~Review code~~                    [Medium] 10/12/24             │ │ │
│  │  │    ~~Code review~~                                                   │ │ │
│  │  │    [✏️] [🗑️]                                                        │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Hierarchy

```
TaskDashboard.vue
├── Header Section
│   ├── User Profile
│   │   ├── Avatar
│   │   ├── User Name
│   │   └── User Title
│   ├── Task Counter
│   │   └── Completed Tasks Number
│   └── Achievement Section
│       ├── Streak Badge
│       ├── Points Badge
│       ├── Achievement Badges
│       └── New Task Button
├── Motivational Message
│   ├── Icon
│   ├── Title
│   └── Message
└── Task DataTable
    ├── Status Column (Checkbox)
    ├── Task Column (Title)
    ├── Deadline Column
    ├── Priority Column (Tags)
    ├── Description Column
    └── Actions Column (Edit/Delete)
```

---

## 5. User Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│   View      │───▶│   Click     │───▶│   Task      │
│   Opens     │    │   Dashboard │    │   New Task  │    │   Dialog    │
│   App       │    │             │    │   Button    │    │   Opens     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Task      │◀───│   Save      │◀───│   Fill      │◀───│   Form      │
│   Created   │    │   Task      │    │   Form      │    │   Fields    │
│   & Saved   │    │             │    │   Details   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Task      │───▶│   User      │───▶│   Points    │───▶│   Badge     │
│   Completed │    │   Checks    │    │   Awarded   │    │   Unlocked  │
│   (Checkbox)│    │   Task      │    │             │    │   (Toast)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 6. Key Features Wireframes

### 6.1 Achievement System
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ACHIEVEMENT SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │
│  │   🔥            │  │   ⭐            │  │   🏆            │  │   🛡️    │ │
│  │ 7 Day Streak    │  │ 1250 Points     │  │ Week Warrior    │  │ Legend  │ │
│  │                 │  │                 │  │                 │  │ Status  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                            BADGES                                       │ │
│  │                                                                         │ │
│  │  [Novice] [Intermediate] [Expert] [Master]                             │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Motivational Messages
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MOTIVATIONAL MESSAGES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  🏆 Week Warrior!                                                       │ │
│  │  A full week of consistency! You're becoming a productivity legend!     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  🔥 Building Momentum!                                                  │ │
│  │  Three days strong! You're building a powerful habit. Keep it going!    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  ⭐ Point Master!                                                        │ │
│  │  1000 points! Your dedication is paying off. You're a true task master! │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Responsive Breakpoints

### Desktop (1200px+)
- Full table layout with all columns visible
- Side-by-side header elements
- Large motivational message area

### Tablet (768px - 1199px)
- Condensed table layout
- Stacked header elements
- Medium motivational message area

### Mobile (320px - 767px)
- Card-based task layout
- Vertically stacked header elements
- Compact motivational message
- Touch-friendly buttons and interactions

---

## 8. Color Scheme & Theming

### Light Theme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)
- Info: Blue (#3B82F6)

### Dark Theme
- Primary: Blue (#60A5FA)
- Success: Green (#34D399)
- Warning: Orange (#FBBF24)
- Danger: Red (#F87171)
- Info: Blue (#60A5FA)

### Motivational Themes
- Beginner: Blue gradient
- Streak: Orange gradient
- Week: Green gradient
- Month: Purple gradient
- Points: Yellow gradient
- Legend: Multi-color gradient

---

## 9. Interaction States

### Button States
- Default: Primary color with hover effect
- Hover: Slightly darker shade
- Active: Pressed state with shadow
- Disabled: Grayed out with reduced opacity

### Task States
- Pending: Normal text with checkbox
- Completed: Strikethrough text with checked checkbox
- Overdue: Red text with warning icon

### Badge States
- Unlocked: Full color with icon
- Locked: Grayed out (future feature)
- New: Pulsing animation (future feature)

---

## 10. Accessibility Considerations

### Keyboard Navigation
- Tab order: Header → Motivational message → Table → Pagination
- Enter/Space for checkbox selection
- Arrow keys for table navigation

### Screen Reader Support
- Proper ARIA labels for all interactive elements
- Descriptive alt text for icons
- Status announcements for task completion

### Color Contrast
- Minimum 4.5:1 contrast ratio for text
- Color not used as sole indicator of information
- High contrast mode support

---

This wireframe documentation provides a comprehensive view of the MotiTasking Task Dashboard interface, showing both the current implementation and potential future enhancements. 