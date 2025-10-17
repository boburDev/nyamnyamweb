# Notification Read Status Fix

## Problem
The `is_read` status was changing after page refresh when using TanStack Query. This happened because:
1. Server-side pages were using `getNotificationsServer()` and `getNotificationByIdServer()`
2. No mechanism to mark notifications as read
3. TanStack Query cache wasn't being updated when notifications were viewed
4. Page refresh would reset the read status

## Solution

### 1. Created Client-Side Components
- **NotificationPageClient.tsx**: Client-side notification list page using TanStack Query
- **NotificationDetailClient.tsx**: Client-side notification detail page using TanStack Query

### 2. Automatic Mark as Read
Both components automatically mark notifications as read when:
- **Notification List Page**: All notifications are marked as read when the page loads
- **Notification Detail Page**: Specific notification is marked as read when viewed

### 3. Cache Management
The solution uses TanStack Query's `setQueryData` to update the cache:
```typescript
// Update specific notification
queryClient.setQueryData(["notification", id], (oldData) => ({
  ...oldData,
  is_read: true,
}));

// Update notification in list
queryClient.setQueryData(["notification"], (oldData) =>
  oldData.map((item) =>
    item.id === id ? { ...item, is_read: true } : item
  )
);
```

### 4. Updated Page Components
- **notification/page.tsx**: Now uses `NotificationPageClient`
- **notification/[id]/page.tsx**: Now uses `NotificationDetailClient`

## How It Works

1. **User visits notification page** → TanStack Query fetches notifications
2. **Component mounts** → `useEffect` automatically marks notifications as read
3. **Cache is updated** → Both individual and list caches are updated
4. **UI reflects changes** → Read status is immediately visible
5. **Page refresh** → TanStack Query cache persists the read status

## Benefits

- ✅ **Persistent read status**: No more reset after page refresh
- ✅ **Real-time updates**: WebSocket integration still works
- ✅ **Automatic marking**: No manual "mark as read" button needed
- ✅ **Cache consistency**: Both list and detail views stay in sync
- ✅ **Better UX**: Users see read status immediately

## Testing

### Manual Testing Steps:
1. **Start dev server**: `npm run dev`
2. **Login and visit notifications**: `/notification`
3. **Check unread notifications**: Should show with `bg-mainColor/10` background
4. **Visit notification detail**: Click on any notification
5. **Go back to list**: All notifications should now show as read (white background)
6. **Refresh page**: Read status should persist
7. **Check browser console**: Should see cache updates in React Query DevTools

### Expected Behavior:
- **Before fix**: Read status would reset after page refresh
- **After fix**: Read status persists across page refreshes and navigation

## Technical Details

### Cache Keys Used:
- `["notification"]`: For notification list
- `["notification", id]`: For individual notifications

### Components Updated:
- `src/components/notification/NotificationPageClient.tsx`
- `src/components/notification/NotificationDetailClient.tsx`
- `src/components/notification/index.ts`
- `src/app/[locale]/(user)/notification/page.tsx`
- `src/app/[locale]/(user)/notification/[id]/page.tsx`

### Dependencies:
- `@tanstack/react-query`: For cache management
- `useQueryClient`: For cache updates
- `useEffect`: For automatic read marking
