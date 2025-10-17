# WebSocket Integration for User Notifications

## Overview
This document describes the WebSocket integration for real-time user notifications in the nyamnyamweb project, based on the implementation from nyamnyam-biznes.

## Changes Made

### 1. Updated UserData Interface
- **File**: `src/types/user-layout.ts`
- **Change**: Added `id: string` field to the `UserData` interface to support user identification for WebSocket connections.

### 2. Created WebSocket Hook
- **File**: `src/hooks/useNotificationWebSocket.ts`
- **Purpose**: Manages WebSocket connection for real-time notifications
- **Features**:
  - Connects to `wss://api.azera.uz/ws/notifications/?type=user&id=${userId}`
  - **Filtered refetch**: Only invalidates React Query cache for specific notification types
  - Handles connection lifecycle (open, message, error, close)
  - Provides connection status and cleanup methods
  - **Smart filtering**: Only refetches for order-related notifications

### 3. Updated NotificationMenu Component
- **File**: `src/components/menu/NotificationMenu.tsx`
- **Changes**:
  - Replaced manual state management with React Query
  - Integrated WebSocket hook for real-time updates
  - Uses user ID from profile data for WebSocket connection
  - Maintains existing UI and functionality

## How It Works

1. **User Authentication**: The component fetches user data using the existing `getUsers()` API
2. **WebSocket Connection**: Once user ID is available, the WebSocket hook establishes a connection
3. **Smart Filtering**: When new notifications arrive via WebSocket, the system checks the notification type
4. **Conditional Refetch**: Only order-related notifications trigger a refetch:
   - `order_created`
   - `order_status_changed`
   - `payment_status_changed`
   - `order_completed`
   - `order_rejected`
5. **UI Updates**: The component automatically re-renders with fresh notification data only when relevant

## WebSocket URL Format
```
wss://api.azera.uz/ws/notifications/?type=user&id={USER_ID}
```

## Testing the Integration

### Manual Testing Steps:
1. **Start the development server**: `npm run dev`
2. **Login to the application** to get user authentication
3. **Open browser developer tools** and check the Console tab
4. **Look for WebSocket connection logs**:
   - `✅ WebSocket connected for user notifications: wss://api.azera.uz/ws/notifications/?type=user&id={USER_ID}`
5. **Send a test notification** from the backend or admin panel
6. **Verify real-time updates** in the notification dropdown

### Expected Console Output:
```
✅ WebSocket connected for user notifications: wss://api.azera.uz/ws/notifications/?type=user&id=123
📩 New notification received: {notification_data}
🔄 Refetching notifications for type: order_created
```

### For Non-Order Notifications:
```
📩 New notification received: {notification_data}
⏭️ Skipping refetch for notification type: general_announcement
```

### Error Handling:
- Connection errors are logged to console
- Failed connections don't break the notification functionality
- Fallback to regular polling via React Query

## Key Differences from nyamnyam-biznes

| Aspect | nyamnyam-biznes | nyamnyamweb |
|--------|----------------|-------------|
| WebSocket Type | `type=branch&id=${branchId}` | `type=user&id=${userId}` |
| ID Source | Business branch ID | User ID from profile |
| State Management | Manual refetch | React Query invalidation |
| Hook Pattern | Inline useEffect | Custom hook |
| **Refetch Logic** | **Always refetch** | **Filtered refetch (order types only)** |

## Dependencies
- `@tanstack/react-query`: For data fetching and cache management
- `cookies-next`: For authentication token management (existing)
- `axios`: For API requests (existing)

## Browser Compatibility
- Modern browsers with WebSocket support
- Automatic fallback to regular HTTP polling if WebSocket fails

## Security Considerations
- WebSocket connection uses the same authentication as HTTP requests
- User ID is validated server-side
- No sensitive data is exposed in WebSocket messages
