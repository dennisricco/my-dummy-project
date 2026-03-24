# Add Friend Feature

## Overview
A robust and elegant "Add Friend" feature integrated into the Sidebar UI with smooth animations powered by Framer Motion.

## Features

### 1. Enhanced Sidebar Header
- **User Avatar**: Displays current user with online status indicator
- **Action Buttons**: 
  - New Chat (MessageSquarePlus icon)
  - Status (Activity icon)
  - Add Friend (UserPlus icon with gradient background)
- **Hover Effects**: Scale animations and color transitions on all interactive elements

### 2. Add Friend Modal
- **Spring Physics Animation**: Modal appears with smooth spring animation (stiffness: 300, damping: 30)
- **Glassmorphism Design**: Blurred background with gradient borders and glowing effects
- **Responsive Layout**: Center-aligned, max-width 512px

### 3. Search Functionality
- **Real-time Search**: Debounced search with 400ms delay
- **Search Bar**: 
  - Focus state with border color change and shadow
  - Loading indicator during search
  - Auto-focus on modal open
- **Search Results**:
  - Fade-in animations with staggered delays (50ms per item)
  - Hover effects with translateX animation
  - Empty state messaging

### 4. User Result Cards
Each result displays:
- **Avatar**: Gradient background with emoji
- **Online Status**: Green dot indicator for online users
- **User Info**: Name and status message/email
- **Add Friend Button**: 
  - Three states: "Add Friend", "Pending", "Friends"
  - Smooth state transitions with layout animations
  - Disabled state for pending/accepted requests
  - Scale animations on hover/tap

### 5. Animations
- **Modal**: Spring physics entrance/exit
- **Backdrop**: Fade in/out with blur
- **Search Results**: Staggered fade-in from bottom
- **Buttons**: Scale on hover (1.05x) and tap (0.95x)
- **Status Transitions**: Smooth color and text changes

## Technical Implementation

### State Management (Zustand)
- `friendRequests`: Map of userId to request status
- `sendFriendRequest(userId)`: Sends friend request
- `searchUsers(query)`: Searches for users (simulated API call)

### Types
```typescript
type FriendRequestStatus = 'none' | 'pending' | 'accepted';

interface FriendSearchResult extends User {
  friendStatus: FriendRequestStatus;
}
```

### Mock Data
The search returns 5 mock users with various online statuses and status messages.

## Usage

Click the "Add Friend" button in the sidebar header to open the modal. Type to search for users by name or email. Click "Add Friend" on any result to send a request.

## Styling

Uses CSS custom properties for theming:
- `--glass-bg`: Glassmorphism background
- `--accent-primary`: Primary accent color
- `--bg-secondary`: Secondary background
- `--bg-hover`: Hover state background
- `--text-primary`: Primary text color
- `--text-muted`: Muted text color
- `--border-color`: Border color

## Dependencies
- `framer-motion`: Animations
- `lucide-react`: Icons
- `zustand`: State management
